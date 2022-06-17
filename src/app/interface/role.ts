import { AppRole } from "./app-role";

export interface UserRole {
    id: number;
    roleName: string;
    accessSetId: number;
    priority: number;
    appRole: AppRole;    
}