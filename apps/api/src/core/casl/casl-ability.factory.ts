import { ExtractSubjectType, InferSubjects, MongoAbility } from '@casl/ability';
import { Injectable, Type } from '@nestjs/common';
import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import { User } from 'src/core/users/entities/user.entity';
import { Role } from 'src/core/roles/entities/role.entity';
import { Permission } from 'src/core/permissions/entities/permission.entity';
import { ACTION_ENUM } from 'src/core/casl/constants/action.constant';
import { PermissionsService } from '../permissions/permissions.service';
import { Group } from '../groups/entities/group.entity';
import { BusinessLine } from '../business-lines/entities/business-line.entity';

type Subjects =
  | InferSubjects<
      | typeof User
      | typeof Role
      | typeof Permission
      | typeof Group
      | typeof BusinessLine
    >
  | 'all';

export type AppAbility = MongoAbility<[ACTION_ENUM, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  constructor(private readonly permissionsService: PermissionsService) {}

  async createForUser(user: {
    userId: string;
    username: string;
    roles: [];
    groups: { id: string }[];
  }): Promise<AppAbility> {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createMongoAbility,
    );

    // 1. Load permissions from the permission service
    const permissions = await this.permissionsService.getEffectivePermissions(
      user.userId,
      user.groups.map((group) => group.id),
    );

    // 2. Build CASL rules from permissions
    for (const perm of permissions) {
      const action = perm.action as ACTION_ENUM;
      const subject = this.resolveSubject(perm.subject);
      const conditions = this.parseConditions(perm.conditions, user);

      if (conditions) {
        console.log({ conditions });
        can(action, subject, undefined, conditions);
      } else {
        can(action, subject);
      }
    }

    // 3. Build the ability
    return build({
      detectSubjectType: (item) => {
        return item.constructor as ExtractSubjectType<Subjects>;
      },
    });
  }

  /**
   * Resolve subject string to actual class or 'all'
   * Can also accept a class constructor and return it as-is (for consistency)
   */
  resolveSubject(subject: string | Type<any> | 'all'): any {
    // If it's already a class or 'all', return as-is
    if (typeof subject === 'function' || subject === 'all') {
      return subject;
    }
    // If it's a string, resolve it
    const subjectMap: Record<string, any> = {
      User: User,
      Role: Role,
      Permission: Permission,
      Group: Group,
      BusinessLine: BusinessLine,
      all: 'all',
    };
    return subjectMap[subject] || subject;
  }

  /**
   * Parse conditions JSON and replace $user.* placeholders with actual values
   * Examples:
   * - {"op": "eq", "field": "requesterId", "value": "$user.id"} -> { requesterId: user.userId }
   * - {"op": "in", "field": "assignmentGroupId", "value": "$user.groupIds"} -> { assignmentGroupId: { $in: user.groupIds } }
   */
  private parseConditions(
    conditions: Record<string, any> | null | undefined,
    user: {
      userId: string;
      username: string;
      roles: [];
      groups: { id: string }[];
    },
  ): Record<string, any> | null {
    if (!conditions) return null;

    // Handle simple condition format: { op, field, value }
    if (conditions.op && conditions.field) {
      const value = this.resolveValue(conditions.value, user);
      const field = conditions.field;

      switch (conditions.op) {
        case 'eq':
          return { [field]: value };
        case 'in':
          return { [field]: { $in: Array.isArray(value) ? value : [value] } };
        case 'ne':
          return { [field]: { $ne: value } };
        case 'gt':
          return { [field]: { $gt: value } };
        case 'gte':
          return { [field]: { $gte: value } };
        case 'lt':
          return { [field]: { $lt: value } };
        case 'lte':
          return { [field]: { $lte: value } };
        default:
          return { [field]: value };
      }
    }

    // Handle direct MongoDB-style conditions: { requesterId: "$user.id" }
    const parsed: Record<string, any> = {};
    for (const [key, val] of Object.entries(conditions)) {
      parsed[key] = this.resolveValue(val, user);
    }
    return parsed;
  }

  /**
   * Replace $user.* placeholders with actual user values
   */
  private resolveValue(
    value: any,
    user: {
      userId: string;
      username: string;
      roles: [];
      groups: { id: string }[];
    },
  ): any {
    if (typeof value === 'string' && value.startsWith('$user.')) {
      const path = value.substring(6); // Remove "$user."
      switch (path) {
        case 'id':
        case 'userId':
          return user.userId;
        case 'username':
          return user.username;
        case 'roles':
          return user.roles;
        case 'groupIds':
          return user.groups.map((group) => group.id) || [];
        default:
          return value;
      }
    }
    return value;
  }

  /**
   * Extract MongoDB query conditions for a specific action and subject
   * Returns null if no restrictions (user can access all) or the conditions object
   * This method queries permissions directly instead of extracting from the ability object
   */
  async extractConditions(
    user: {
      userId: string;
      username: string;
      roles: [];
      groups: { id: string }[];
    },
    action: ACTION_ENUM,
    subject: string | Type<any> | 'all',
  ): Promise<Record<string, any> | null> {
    const normalizedSubject = this.resolveSubject(subject);

    // Get all effective permissions for the user
    const permissions = await this.permissionsService.getEffectivePermissions(
      user.userId,
      user.groups.map((group) => group.id),
    );

    // Find permissions that match the action and subject
    const matchingPermissions = permissions.filter((perm) => {
      const matchesAction = perm.action === action;
      const subjectName =
        typeof normalizedSubject === 'function'
          ? normalizedSubject.name
          : normalizedSubject === 'all'
            ? 'all'
            : normalizedSubject;
      const matchesSubject =
        perm.subject === subjectName || perm.subject === 'all';
      return matchesAction && matchesSubject;
    });

    // If no matching permissions, return null (no restrictions)
    if (matchingPermissions.length === 0) {
      return null;
    }

    // If there's a permission without conditions, user can access all (no restrictions)
    const unrestrictedPerm = matchingPermissions.find(
      (perm) => !perm.conditions || Object.keys(perm.conditions).length === 0,
    );
    if (unrestrictedPerm) {
      return null;
    }

    // Extract and parse conditions from matching permissions
    const conditions = matchingPermissions
      .map((perm) => this.parseConditions(perm.conditions, user))
      .filter((cond) => cond && Object.keys(cond).length > 0);

    if (conditions.length === 0) {
      return null;
    }

    // If multiple conditions, merge them (for "own" permissions, typically one condition)
    // If conditions are incompatible, we might need $or, but for now merge them
    return conditions.length === 1 ? conditions[0] : { $or: conditions };
  }
}
