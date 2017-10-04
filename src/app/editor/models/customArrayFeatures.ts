/**
 * The basic Array interface with a plus feature.
 */
interface Array<T> {

  /**
   * A remove function is added to the array to support port deletion from a collection.
   */
  remove();
}

/**
 * Idk.
 */
Array.prototype.remove = function () {
  const a = arguments;
  let what, L = a.length, ax;
  while (L && this.length) {
    what = a[--L];
    while ((ax = this.indexOf(what)) !== -1) {
      this.splice(ax, 1);
    }
  }
  return this;
}
