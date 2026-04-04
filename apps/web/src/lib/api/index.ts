/**
 * API Index
 * Main API export combining all API modules
 */

import { authApi } from './auth.api'
import { sessionApi } from './session.api'
import { usersApi } from './users.api'
import { rolesApi } from './roles.api'
import { permissionsApi } from './permissions.api'
import { ldapApi } from './ldap.api'
import { groupsApi } from './groups.api'
import { businessLinesApi } from './business-lines.api'
import { departmentsApi } from './departments.api'
import { casesApi } from './cases.api'
import { caseCommentsApi } from './case-comments.api'
import { caseAttachmentsApi } from './case-attachments.api'
import { categoriesApi } from './categories.api'
import { slaApi } from './sla.api'
import { serviceCategoriesApi } from './service-categories.api'
import { servicesApi } from './services.api'
import { serviceCardsApi } from './service-cards.api'

/**
 * Unified API client
 * Provides access to all API endpoints organized by domain
 */
export const api = {
  auth: authApi,
  session: sessionApi,
  users: usersApi,
  roles: rolesApi,
  permissions: permissionsApi,
  ldap: ldapApi,
  groups: groupsApi,
  businessLines: businessLinesApi,
  departments: departmentsApi,
  cases: casesApi,
  caseComments: caseCommentsApi,
  caseAttachments: caseAttachmentsApi,
  categories: categoriesApi,
  sla: slaApi,
  serviceCategories: serviceCategoriesApi,
  services: servicesApi,
  serviceCards: serviceCardsApi,
}

// Re-export individual modules for direct imports if needed
export { authApi } from './auth.api'
export { sessionApi } from './session.api'
export { usersApi } from './users.api'
export { rolesApi } from './roles.api'
export { permissionsApi } from './permissions.api'
export { ldapApi } from './ldap.api'
export { groupsApi } from './groups.api'
export { businessLinesApi } from './business-lines.api'
export { departmentsApi } from './departments.api'
export { casesApi } from './cases.api'
export { caseCommentsApi } from './case-comments.api'
export { caseAttachmentsApi } from './case-attachments.api'
export { categoriesApi } from './categories.api'
export { slaApi } from './sla.api'
export { serviceCategoriesApi } from './service-categories.api'
export { servicesApi } from './services.api'
export { serviceCardsApi } from './service-cards.api'

// Re-export the core client for advanced use cases
export { apiFetch } from '../api-client'
