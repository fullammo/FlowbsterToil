 /**
  * A type interface for flowbster Node's Input port of a {@link FlowbsterNode}
  */
export interface InputPort {

    /**
     * A string property which holds the InputPorts name,
     * which can be the input file with the extension.
     */
    name: string;

    /**
     * A boolean value to decide wether this port accepts
     * data chunks from a generator output port {@link OutputPort}
     */
    collector?: boolean;

    /**
     * The given regular expression,states in which format you want to store the data.
     */
    format?: string;
}
