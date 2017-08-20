import { OutPutDescriptor } from './outputDescriptor';
import { InputDescriptor } from './inputDescriptor';

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
                in?: InputDescriptor[],
                out?: OutPutDescriptor[]
            }
        }
    }
}
