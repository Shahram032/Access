import { UserStatus } from '../enum/user-status';
import { Person } from './person';
import { UserRole } from './role';

export interface AppUser {
  id: number;
  username: string;
  password: string;
  userSetId: number;
  creationDate: Date;
  changePassDate: Date;
  status: UserStatus;
  person: Person;
  userRoles: Array<UserRole>;
}
