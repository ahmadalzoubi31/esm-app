/**
 * This file is a bridge between your CASL permission system and your MikroORM database layer.
 * It solves a difficult problem: How do I filter database results based on complex permission rules
 * without fetching everything into memory first?
 */

import { AppAbility } from './casl-ability.factory';
import { FilterQuery } from '@mikro-orm/core';
import { InferSubjects } from '@casl/ability';
import { Role } from '../roles/entities/role.entity';
import { Permission } from '../permissions/entities/permission.entity';
import { Group } from '../groups/entities/group.entity';
import { BusinessLine } from '../business-lines/entities/business-line.entity';
import { User } from '../users/entities/user.entity';
import { Case } from 'src/esm/cases/entities/case.entity';
import { CaseAttachment } from 'src/esm/cases/entities/case-attachment.entity';
import { CaseComment } from 'src/esm/cases/entities/case-comment.entity';
import { SlaTarget } from '../sla/entities/sla-target.entity';
import { Department } from '../departments/entities/department.entity';
import { Category } from '../categories/entities/category.entity';

type Subjects =
  | InferSubjects<
      | typeof User
      | typeof Role
      | typeof Permission
      | typeof Group
      | typeof BusinessLine
      | typeof Case
      | typeof CaseAttachment
      | typeof CaseComment
      | typeof SlaTarget
      | typeof Category
      | typeof Department
    >
  | 'all';

/**
 * Converts CASL ability rules into MikroORM FilterQuery conditions.
 * Only supports positive 'can' rules. 'cannot' rules with conditions are difficult to apply in DB queries
 * and are typically enforced at the object level after retrieval or by specific exclusion queries.
 */
export function caslToMikroOrm<T>(
  ability: AppAbility,
  action: string,
  subjectName: Subjects,
): FilterQuery<T> | undefined {
  // Filter for rules that allow this action on this subject
  const rules = ability.rules.filter((rule) => {
    console.log({
      actions: rule.action,
      action,
      1: rule.action === action,
      subject: rule.subject,
      subjectName,
      2: rule.subject === subjectName || rule.subject === 'all',
      3: !rule.inverted,
    });
    return (
      (rule.action === action || rule.action === 'manage') &&
      (rule.subject === subjectName || rule.subject === 'all') &&
      !rule.inverted
    );
  });

  console.log({ rules });

  // If no allowing rules exist, technically access is denied.
  // However, usually the Guard checks this before ensuring at least one rule exists.
  // If the Guard passed, but we found no rules here, it might differ in strictness.
  // But strictly speaking:
  if (rules.length === 0) {
    // Return a condition that matches nothing?
    // Or mostly this function is called only if ability.can() is true.
    // If ability.can() is true but no rules? (Global admin catch-all?)
    // If 'all' is used, it should be in rules.
    return undefined; // Or throw error?
  }

  // Check for any rule that provides full access (no conditions)
  const fullAccessRule = rules.find(
    (rule) => !rule.conditions || Object.keys(rule.conditions).length === 0,
  );
  if (fullAccessRule) {
    return {} as FilterQuery<T>; // No filter, return all
  }

  // Collect conditions from all limited rules (implied OR between rules)
  const orConditions: FilterQuery<T>[] = [];

  for (const rule of rules) {
    if (rule.conditions) {
      const converted = convertMongoToMikroOrm(rule.conditions);
      orConditions.push(converted);
    }
  }

  // If we have conditions, return them.
  // MikroORM accepts $or operator for OR logic
  if (orConditions.length === 0) {
    return {} as FilterQuery<T>;
  } else if (orConditions.length === 1) {
    return orConditions[0];
  } else {
    return { $or: orConditions } as FilterQuery<T>;
  }
}

function convertMongoToMikroOrm(mongoConditions: any): any {
  // MikroORM natively supports MongoDB-style query operators
  // So we can mostly pass through the conditions as-is
  // We just need to handle any special cases or nested structures

  const result: any = {};

  for (const [key, value] of Object.entries(mongoConditions)) {
    // MikroORM supports $or, $and, $in, $ne, $gt, $gte, $lt, $lte, $exists natively
    // So we can pass them through directly
    if (key.startsWith('$')) {
      result[key] = value;
    } else if (
      typeof value === 'object' &&
      value !== null &&
      !Array.isArray(value)
    ) {
      // Check if this is an operator object
      const valObj = value as Record<string, any>;
      const operators = Object.keys(valObj);

      if (operators.length > 0 && operators.some((op) => op.startsWith('$'))) {
        // This is an operator object, pass it through
        result[key] = value;
      } else {
        // This might be a nested object, recurse
        result[key] = convertMongoToMikroOrm(value);
      }
    } else {
      // Direct equality or array value
      result[key] = value;
    }
  }

  return result;
}
