import { InputPort } from 'app/editor/flowbster-forms/input-properties/inputPort';
import { OutputPort } from 'app/editor/flowbster-forms/output-properties/outputPort';

export interface NodeDescriptor {
  name: string;
  type: string;
  scaling: {
    min: number;
    max: number;
  };
  variables: {
    flowbster: {
      app: {
        exe: {
          filename: string;
          tgzurl: string;
        };
        args: string;
        in?: InputPort[];
        out?: OutputPort[];
      };
    };
  };
}
