import { Person } from "./person";

export interface PassedUser {
    username: string;
    person: Person;
    accessToken: string;
    refreshToken: string;
}