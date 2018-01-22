/**
 * Describes the workflows basic attributes.
 */
export interface Workflow {

    /**
     * Infrastructure Identification in number format is neccessary to uniquely identify the workflow.
     */
    infraid: number;

    /**
     * The Unique Identificiation of the workflow user in string format.
     */
    userid: string,

    /**
      *The infrastructure's name in string format.
      */
    infraname: string,

    /**
     * The running gather service's IP address.
     */
    gatherip: string,

    /**
     * The running gather service's Port address.
     */
    gatherport: number,

    /**
     * The starter port to start the flow in the workflow.
     */
    receiverport: number
}
