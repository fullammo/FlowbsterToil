export interface OutputPort {
    name: string;
    fileName: string;
    targetName?: string;
    targetIp?: string;
    targetPort?: string;
    isGenerator?: boolean;
    filterExpression?: string;
    distributionType?: string
}
