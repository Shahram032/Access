import { OrgSet } from '../components/org/chart/interface/node';
import { UserStatus } from '../enum/user-status';
import { Person } from './person';
import { UserRole } from './role';

export interface AppUser {
  id: number;
  username: string;
  password: string;
  creationDate: Date;
  changePassDate: Date;
  status: UserStatus;
  person: Person;
  userRoles: Array<UserRole>;
  defaultOrgSet: OrgSet;
}
