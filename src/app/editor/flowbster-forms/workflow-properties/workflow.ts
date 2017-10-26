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
     * The running collector service's IP address.
     */
    collectorip: string,

    /**
     * The running collector service's Port address.
     */
    collectorport: number,

    /**
     * The starter port to start the flow in the workflow.
     */
    receiverport: number
}
