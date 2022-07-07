import { OrgSet } from '../components/org/chart/interface/node';
import { AppRole } from './app-role';
import { PassedUser } from './passed-user';
import { UserRole } from './role';
import { RoleAccess } from './role-access';
import { SystemEntity } from './system-entity';
import { AppUser } from './user';
import { WorkFlow } from './work-flow';

export interface CustomResponse {
  timeStamp: Date;
  statusCode: number;
  status: string;
  reason: string;
  message: string;
  developerMessage: string;
  data: {
    passedUser?: PassedUser;
    appUsers?: AppUser[];
    appUser?: AppUser;
    orgSet?: OrgSet;
    orgSets?: OrgSet[];
    userRoles?: UserRole[];
    roles?: AppRole[];
    roleAccesses?: RoleAccess[],
    roleAccess?: RoleAccess,
    entities?: SystemEntity[],
    workFlows?: WorkFlow[],
  };
}
