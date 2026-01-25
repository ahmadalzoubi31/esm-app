export const AuthSource = {
  LOCAL: 'local',
  LDAP: 'ldap',
} as const;

export type AuthSource = (typeof AuthSource)[keyof typeof AuthSource];

export const AuthSourceValues = Object.values(AuthSource);
