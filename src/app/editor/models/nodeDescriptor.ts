import { OutputPort } from 'app/editor/models/outputPort';
import { InputPort } from './inputPort';

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
