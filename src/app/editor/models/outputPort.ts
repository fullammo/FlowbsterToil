/**
  * A type interface for flowbster Node's Input port of a {@link FlowbsterNode}.
  */
export interface OutputPort {

  /**
   * The display name of the Output port in string format.
   */
  name: string;

  /**
   * The file's name in strnig format, that we are waiting to get.
   */
  fileName: string;

  /**
   * The given {@link FlowbsterNode}'s name in string format, whom we want to connect to.
   */
  targetName?: string;

  /**
   * The given {@link FlowbsterNode}'s IP address in string format, whom we want to connect to.
   */
  targetIp?: string;

  /**
   * The given {@link FlowbsterNode}'s Port address in string format, whom we want to connect to.
   */
  targetPort?: string;

  /**
   * A boolean value that decides, if this port can distribute the file in chunks.
   */
  isGenerator?: boolean;

  /**
   * The regular expression in string format, how we want to filter these data chunks.
   */
  filterExpression?: string;

  /**
   * Describes the type of distribution.
   * There are two values of this type: random and round-robin.
   */
  distributionType?: string
}
