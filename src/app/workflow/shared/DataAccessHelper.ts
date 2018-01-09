import { WorkflowEntry } from './workflowEntry';

/**
 * Utility methods collection for Data Access
 */
export class DataAccessHelper {

  /**
   * Peels the unneccessary information from the workflow entry, and adds 'clone' at the end of
   * its name for saving purposes.
   * @param entry A fully qualified workflow entry.
   */
  static peelTemplate(entry: WorkflowEntry): WorkflowEntry {
    return {
      name: entry.name + ' clone',
      description: entry.description,
      descriptor: entry.descriptor,
      graph: entry.graph
    };
  }

  /**
   * Creates an initial workflow entry without the database information.
   * @param entry Optional workflowEntry to be reinitialized to initial values without the key.
   */
  static initTemplate(entry?: WorkflowEntry): WorkflowEntry {
    if (entry) {
      return {
        name: entry.name,
        description: entry.description,
        descriptor: entry.descriptor,
        graph: entry.graph
      };
    }
    return { name: '', description: '', descriptor: '', graph: '' };
  }
}
