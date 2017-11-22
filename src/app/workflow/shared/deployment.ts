import { DeploymentType } from 'app/workflow/shared/deployment-type.enum';
import { Status } from 'app/workflow/shared/status.enum';

export interface Deployment {
  name: string;
  date: Date;
  infraid: string;
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
