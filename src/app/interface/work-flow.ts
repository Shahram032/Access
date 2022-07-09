import { LinkData } from "./link-data";
import { NodeData } from "./node-data";
import { SystemEntity } from "./system-entity";

export interface WorkFlow {
    id?: number;
    fromDate?: Date;
    toDate?: Date;
    entity?: SystemEntity;
    nodeDataArray?: NodeData[];
    linkDataArray?: LinkData[];
}