/**
  * A type interface for flowbster Node's Input port of a {@link FlowbsterNode}.
  */
export interface OutputPort {

  /**
   * The file's name in strnig format, that we are waiting to get.
   */
  name: string;

  /**
   * The name of the node that has been connected to this outport.
   */
  targetnode?: string;

  /**
   * The given {@link FlowbsterNode}'s name in string format, whom we want to connect to.
   */
  targetname?: string;

  /**
   * The given {@link FlowbsterNode}'s IP address in string format, whom we want to connect to.
   */
  targetip?: string;

  /**
   * The given {@link FlowbsterNode}'s Port address in string format, whom we want to connect to.
   */
  targetport?: string;

  /**
   * A boolean value that decides, if this port can distribute the file in chunks.
   */
  isGenerator?: boolean;

  /**
   * The regular expression in string format, how we want to filter these data chunks.
   */
  filter?: string;

  /**
   * Describes the type of distribution.
   * There are two values of this type: random and round-robin.
   */
  distribution?: string

  /**
   * The display name of the Output port in string format.
   */
  displayName?: string;
}
