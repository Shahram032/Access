export enum UserStatus {
  ACTIVE = 'ACTIVE',
  DEACTIVATE = 'DEACTIVATE',
  SUSPEND = 'SUSPEND'
}


export const UserStatusMapping: Record<UserStatus, string> = {
  [UserStatus.ACTIVE]: "Active",
  [UserStatus.DEACTIVATE]: "Deactivate",
  [UserStatus.SUSPEND]: "Suspend",
};
