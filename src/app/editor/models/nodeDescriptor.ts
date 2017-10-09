import { OutputPort } from './outputPort';
import { InputPort } from 'app/editor/models/InputPort';

export interface NodeDescriptor {
  name: string,
  type: string,
  scaling: {
    min: number,
    max: number
  },
  variables: {
    flowbster: {
      app: {
        exe: {
          filename: string,
          tgzurl: string
        },
        args: string,
        in?: InputPort[],
        out?: OutputPort[]
      }
    }
  }
}
