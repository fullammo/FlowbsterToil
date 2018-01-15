import { NodeDescriptor } from './nodeDescriptor';

// could match the workflow attributes like this.
/**
 * Describes information about the whole infrastructure
 * process, that is YAMl parsable for the Occopus tool
 */
export interface OccopusDescriptor {
    // infra_id: number // we used this property in 0.14 version.

    /**
     * The user unique identifier in the Occopus system.
     */
    user_id: string,

    /**
     * The infrastructure qualified name.
     */
    infra_name: string,

    /**
     * The identity for global variables
     */
    variables: {

      /**
       * Flowbster Workflow System based options.
       */
        flowbster_global: {

            /**
             * Gather components IP address.
             */
            collector_ip: string,

            /**
             * Gather components Port address.
             */
            collector_port: string,

            /**
             * Feeder component Port address.
             */
            receiver_port: string
        }
    },

    /**
     * Array of holding Flowbster Node Descriptors.
     */
    nodes?: NodeDescriptor[],

    /**
     * Array for holding the Dependency graph of the nodes.
     */
    dependencies?: Array<string>
}
