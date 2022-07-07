import { FlowStep } from "./flow-step";
import { SystemEntity } from "./system-entity";

export interface WorkFlow {
    id: number;
    fromDate: Date;
    toDate?: Date;
    entity: SystemEntity;
    steps: FlowStep;    
}