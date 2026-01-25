// /**
//  * This file is a bridge between your CASL permission system and your TypeORM database layer.
//  * It solves a difficult problem: How do I filter database results based on complex permission rules
//  * without fetching everything into memory first?
//  */

// import { AppAbility } from './casl-ability.factory';
// import {
//   FindOptionsWhere,
//   In,
//   MoreThan,
//   MoreThanOrEqual,
//   LessThan,
//   LessThanOrEqual,
//   Not,
//   IsNull,
// } from 'typeorm';
// import { InferSubjects } from '@casl/ability';
// import { Role } from '../roles/entities/role.entity';
// import { Permission } from '../permissions/entities/permission.entity';
// import { Group } from '../groups/entities/group.entity';
// import { BusinessLine } from '../business-lines/entities/business-line.entity';
// import { User } from '../users/entities/user.entity';

// type Subjects =
//   | InferSubjects<
//       | typeof User
//       | typeof Role
//       | typeof Permission
//       | typeof Group
//       | typeof BusinessLine
//     >
//   | 'all';

// /**
//  * Converts CASL ability rules into TypeORM FindOptionsWhere conditions.
//  * Only supports positive 'can' rules. 'cannot' rules with conditions are difficult to apply in DB queries
//  * and are typically enforced at the object level after retrieval or by specific exclusion queries.
//  */
// export function caslToTypeOrm<T>(
//   ability: AppAbility,
//   action: string,
//   subjectName: Subjects,
// ): FindOptionsWhere<T> | FindOptionsWhere<T>[] | undefined {
//   // Filter for rules that allow this action on this subject
//   const rules = ability.rules.filter((rule) => {
//     console.log({
//       actions: rule.action,
//       action,
//       1: rule.action === action,
//       subject: rule.subject,
//       subjectName,
//       2: rule.subject === subjectName || rule.subject === 'all',
//       3: !rule.inverted,
//     });
//     return (
//       (rule.action === action || rule.action === 'manage') &&
//       (rule.subject === subjectName || rule.subject === 'all') &&
//       !rule.inverted
//     );
//   });

//   console.log({ rules });

//   // If no allowing rules exist, technically access is denied.
//   // However, usually the Guard checks this before ensuring at least one rule exists.
//   // If the Guard passed, but we found no rules here, it might differ in strictness.
//   // But strictly speaking:
//   if (rules.length === 0) {
//     // Return a condition that matches nothing?
//     // Or mostly this function is called only if ability.can() is true.
//     // If ability.can() is true but no rules? (Global admin catch-all?)
//     // If 'all' is used, it should be in rules.
//     return undefined; // Or throw error?
//   }

//   // Check for any rule that provides full access (no conditions)
//   const fullAccessRule = rules.find(
//     (rule) => !rule.conditions || Object.keys(rule.conditions).length === 0,
//   );
//   if (fullAccessRule) {
//     return {}; // No filter, return all
//   }

//   // Collect conditions from all limited rules (implied OR between rules)
//   const orConditions: FindOptionsWhere<T>[] = [];

//   for (const rule of rules) {
//     if (rule.conditions) {
//       const converted = convertMongoToTypeOrm(rule.conditions);
//       orConditions.push(converted);
//     }
//   }

//   // If we have conditions, return them.
//   // TypeORM accepts an array of objects for OR logic at the root level WHERE.
//   return orConditions.length > 0 ? orConditions : {};
// }

// function convertMongoToTypeOrm(mongoConditions: any): any {
//   const result: any = {};

//   for (const [key, value] of Object.entries(mongoConditions)) {
//     // Handle $or at root of condition
//     if (key === '$or' && Array.isArray(value)) {
//       // This is complex because TypeORM root is Array<Object>, but nested OR is not supported well in FindOptionsWhere
//       // unless we expand it. But let's assume simple field conditions for now.
//       // If we encounter $or, we might need to return an array of conditions from this function?
//       // Recursive handling needed.
//       // For simplicity, we skip $or complex mapping in this version unless necessary.
//       continue;
//     }

//     if (typeof value === 'object' && value !== null) {
//       if (Array.isArray(value)) {
//         // Implicit equality match for array? Unlikely in Mongo syntax unless specific.
//         // Assuming direct value.
//         result[key] = value;
//       } else {
//         // Check for operators
//         const valObj = value as Record<string, any>;
//         const operators = Object.keys(valObj);

//         // Handle simple operators
//         if (operators.length > 0) {
//           // We map each operator. Note that TypeORM FindOptionsWhere field can usually take only one FindOperator.
//           // But if multiple checks (e.g. > 5 AND < 10), TypeORM supports Between or And(MoreThan(5), LessThan(10))
//           // Implementation of combined operators is advanced.
//           // We handle single common operators first.

//           for (const op of operators) {
//             const opValue = valObj[op];
//             switch (op) {
//               case '$in':
//                 result[key] = In(opValue);
//                 break;
//               case '$ne':
//                 result[key] = Not(opValue);
//                 break;
//               case '$gt':
//                 result[key] = MoreThan(opValue);
//                 break;
//               case '$gte':
//                 result[key] = MoreThanOrEqual(opValue);
//                 break;
//               case '$lt':
//                 result[key] = LessThan(opValue);
//                 break;
//               case '$lte':
//                 result[key] = LessThanOrEqual(opValue);
//                 break;
//               case '$exists':
//                 // $exists: false -> IsNull()
//                 // $exists: true -> Not(IsNull())
//                 result[key] = opValue ? Not(IsNull()) : IsNull();
//                 break;
//               default:
//                 // Unknown operator, assign as is (might fail)
//                 // Or it is a nested property check
//                 // result[key] = value;
//                 break;
//             }
//           }
//         } else {
//           result[key] = value;
//         }
//       }
//     } else {
//       // Direct equality
//       result[key] = value;
//     }
//   }
//   return result;
// }
