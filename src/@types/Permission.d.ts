enum PERMISSIONS {
  'admins',
  'player',
}

type PermissionType = keyof typeof PERMISSIONS;
