import z from 'zod'
import { AuthSource } from '@/types/users'

export const UserSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z
    .union([z.email('Invalid email address'), z.literal('')])
    .transform((e) => (e === '' ? undefined : e)),
  avatar: z.string().optional(),
  authSource: z.enum([AuthSource.LOCAL, AuthSource.LDAP]),
  department: z.string().optional(),
  phone: z.string().optional(),
  manager: z.string().optional(),
  password: z.string().optional(),
  externalId: z.string().optional(),
  isActive: z.boolean(),
  isLicensed: z.boolean(),
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

export const CreateUserSchema = UserSchema.superRefine((data, ctx) => {
  if (data.authSource === AuthSource.LOCAL && !data.password) {
    ctx.addIssue({
      code: 'custom',
      message: 'Password is required for local authentication',
      path: ['password'],
    })
  }
})

export const UpdateUserSchema = UserSchema
