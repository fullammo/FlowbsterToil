import { NodeDescriptor } from './nodeDescriptor';

// could match the workflow attributes like this.
export interface OccopusDescriptor {
    infra_id: number // we used this property in 0.14 version.
    user_id: string,
    infra_name: string,
    variables: {
        flowbster_global: {
            collector_ip: string,
            collector_port: string,
            receiver_port: string
        }
    },
    nodes?: NodeDescriptor[],
    dependencies?: Array<string>
}
