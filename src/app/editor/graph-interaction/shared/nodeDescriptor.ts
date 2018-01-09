import { InputPort } from 'app/editor/flowbster-forms/input-properties/inputPort';
import { OutputPort } from 'app/editor/flowbster-forms/output-properties/outputPort';

/**
 * Describes information about a Node in YAML parsable and Occopus understandable fashion.
 */
export interface NodeDescriptor {

  /**
   * The name of the actual node.
   */
  name: string;

  /**
   * Type of the node. (Mainly flowbsternode)
   */
  type: string;

  /**
   * The scalability parammeters of the node.
   */
  scaling: {
    /**
     * Minimum number to scale.
     */
    min: number;

    /**
     * Maximum number to scale.
     */
    max: number;
  };

  /**
   * Entity for custom variables that can be used in the YAMl descriptor.
   */
  variables: {

    /**
     * Entity for declaring a flowbster workflow.
     */
    flowbster: {
      app: {
        exe: {
          filename: string;
          tgzurl: string;
        };
        args: string;
        in?: InputPort[];
        out?: OutputPort[];
      };
    };
  };
}
