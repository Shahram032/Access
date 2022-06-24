import { newArray } from "@angular/compiler/src/util";

export interface OrgSet {
    id?: number;
    title?: string;
    item?: string;
    children?: OrgSet[];
    parent?: OrgSet;
    setLevel?: number;
}