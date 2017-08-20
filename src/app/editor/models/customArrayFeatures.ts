interface Array<T> {
  remove();
}

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
