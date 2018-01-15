/**
 * The third layer datatable record entity. It holds information about a given deployments
 * different data sets and its processes, that were sent in to the built workflow to be processed.
 */
export interface Experiment {
  /**
   * The name that represents the different datasets.
   */
  name: string;

  /**
   * The parent deployment's identifier in the FireStore database.
   * Needed to identify and save the actual Experiment.
   */
  deploymentKey?: string;

  /**
   * The status of the actual data processing.
   */
  status?: string;

  /**
   *The experiments record indentifier in the FireStore database.
   */
  $key?: string;
}
