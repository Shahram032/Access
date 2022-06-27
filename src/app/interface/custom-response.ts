import { OrgSet } from '../components/org/chart/interface/node';
import { AppRole } from './app-role';
import { PassedUser } from './passed-user';
import { UserRole } from './role';
import { AppUser } from './user';

export interface CustomResponse {
  timeStamp: Date;
  statusCode: number;
  status: string;
  reason: string;
  message: string;
  developerMessage: string;
  data: {
    passedUser?: PassedUser;
    users?: AppUser[];
    orgSet?: OrgSet;
    orgSets?: OrgSet[];
    userRoles?: UserRole[];
    roles?: AppRole[];
  };
}
