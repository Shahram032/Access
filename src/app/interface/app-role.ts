import { RoleAccess } from "./role-access";

export interface AppRole {
    id: number;
    roleName: string;
    roleAccesses: Array<RoleAccess>;
}