export interface NodeData {
    id?: number;
    key?: number;
    category?: string;
    loc?: string;
    text?: string;
    okCaption?: string;
    rejectCaption?: string;
    startFlow?: boolean;
    endFlow?: boolean;
    nextStep?: number;
    previousStep?: number;    
}