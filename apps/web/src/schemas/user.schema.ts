import z from 'zod'
import { AuthSource } from '@/types/users'

export const UserSchema = z
  .object({
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z
      .union([z.string().email('Invalid email address'), z.literal('')])
      .transform((e) => (e === '' ? undefined : e)),
    avatar: z.string().optional(),
    auth_source: z.enum([AuthSource.LOCAL, AuthSource.LDAP]),
    department: z.string(),
    phone: z.string().optional(),
    manager: z.string().optional(),
    password: z.string(),
    external_id: z.string().optional(),
    is_active: z.boolean(),
    is_licensed: z.boolean(),
    roles: z.array(z.string()).default([]).optional(),
    permissions: z.array(z.string()).default([]).optional(),
    groups: z.array(z.string()).default([]).optional(),
    metadata: z
      .object({
        mobile: z.string().optional(),
        title: z.string().optional(),
        company: z.string().optional(),
        employeeId: z.string().optional(),
        employeeType: z.string().optional(),
        location: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        country: z.string().optional(),
        userPrincipalName: z.string().optional(),
      })
      .catchall(z.any())
      .default({})
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.auth_source === AuthSource.LOCAL && !data.password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Password is required for local authentication',
        path: ['password'],
      })
    }
  })
