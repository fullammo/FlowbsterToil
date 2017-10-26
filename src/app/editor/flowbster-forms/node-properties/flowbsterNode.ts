/**
 * Describes a flowbster node entity, which computes by the given input data
 * and transports it to other service endpoints.
 */
export interface FlowbsterNode {

    /**
     * The alias for the node in string format.
     */
    name: string;

    /**
     * The executable file's name with the extension in string format.
     * This executable will describe the computation mechanisms done by the node.
     */
    execname: string;

    /**
     * The executable file's arguments in string format
     */
    args: string;

    /**
     * The FlowbsterNode can download the executable file from a given URL.
     * We provide it in this property in string format.
     */
    execurl: string;

    /**
     * The flowbsterNode's minimum scalability value in number format.
     * Describes how many other virtual machines can be created for the execution of the task.
     */
    scalingmin: number;

    /**
     * The flowbsterNode's maximum scalability value in number format.
     * Describes how many other virtual machines can be created for the execution of the task.
     */
    scalingmax: number;
}
