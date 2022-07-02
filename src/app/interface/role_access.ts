import { FlowStep } from "./flow-step";
import { SystemEntity } from "./system-entity";
import { SystemField } from "./system-field";

export interface RoleAccess {
    id: number;
    name: string;
    entity: SystemEntity;
    allowInsert: boolean;
    allowEdit: boolean;
    allowDelete: boolean;
    readAll: boolean;
    writeAll: boolean;
    readOwner: boolean;
    writeOwner: boolean;
    readSet: boolean;
    writeSet: boolean;
    setReadDeep: number;
    setWriteDeep: number;
    deniedViewList: SystemField[];
    deniedEditList: SystemField[];
    viewSteps: FlowStep[];
    editSteps: FlowStep[];    
}