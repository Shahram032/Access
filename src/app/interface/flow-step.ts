export interface FlowStep {
    id: number;
    step: number;
    okCaption: string;
    rejectCaption: string;
    startFlow: boolean;
    endFlow: boolean;
    nextStep: number;
    previousStep: number;
}