import { SystemField } from "./system-field";

export interface SystemEntity {
    id: number;
    entityName: string;
    fullName: string;
    systemName: string;
    systemFields: Array<SystemField>;
}