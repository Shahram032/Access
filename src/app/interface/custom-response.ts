import { PassedUser } from "./passed-user";
import { AppUser } from "./user";

export interface CustomResponse {
    timeStamp: Date;
    statusCode: number;
    status: string;
    reason: string;
    message: string;
    developerMessage: string;
    data: { passedUser?: PassedUser, users?: AppUser[] };
}