export interface Deployment {
  name: string;
  date?: Date;
  infraid?: string;
  tempalteKey?: string;
  $key?: string;
  deployType?: DeploymentType;
  status?: Status;
  starterPoint?: string;
  endPoints?: string[];
}

export enum Status {
  'Active',
  'Pending',
  'Down'
}

export enum DeploymentType {
  'sigma',
  'ec2'
}
