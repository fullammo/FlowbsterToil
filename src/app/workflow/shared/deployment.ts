export interface Deployment {
  name: string;
  date?: Date;
  infraid?: string;
  tempalteKey?: string;
  $key?: string;
  deploymentType?: DeploymentType;
  status?: Status;
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
// we should set the various cloud provider list here.
