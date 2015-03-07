module.exports = function load(src, async) {
  var s = document.createElement('script');
  s.src = src;
  if (typeof async === 'boolean') {
    s.async = async;
  }
  (document.head || document.body).appendChild(s);
  return s;
};
