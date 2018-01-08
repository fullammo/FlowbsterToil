export interface Deployment {
  name: string;
  graph?: string;
  date?: Date;
  infraid?: string;
  templateKey?: string;
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
