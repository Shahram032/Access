import { Person } from "./person";
import { UserRole } from "./role";

export interface AppUser {
    id: number;
    username: string;
    password: string;
    userSetId: number;
    creationDate: Date;
    isActive: boolean;
    person: Person;
    userRoles: Array<UserRole>;
}
