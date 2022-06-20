export interface OrgSet {
    id: number;
    title: string;
    children?: OrgSet[];    
}