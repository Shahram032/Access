import { OrgSet } from "../components/org/chart/interface/node";
import { AppRole } from "./app-role";

export interface UserRole {
    id: number;
    roleName: string;
    priority: number;
    appRole: AppRole;
    orgSet: OrgSet;
    assignDate?: Date;
}