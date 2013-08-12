function combinations_str(str) {
  var fn = function(active, rest, a) {
    if (!active && !rest)
      return;
    if (!rest) {
      a.push(active);
    } else {
      fn(active + rest[0], rest.slice(1), a);
      fn(active, rest.slice(1), a);
    }
    return a;
  }
  return fn("", str, []);
}


function combinations_arr(arr) {
  var fn = function(active, rest, a) {
    if (!active.length && !rest.length)
      return;
    if (!rest.length) {
      a.push(active);
    } else {
      var active1 = active.concat()
      active1.push(rest[0])
      fn(active1, rest.slice(1), a);
      fn(active, rest.slice(1), a);
    }
    return a;
  }
  return fn([], arr, []);
}


exports.str = combinations_str
exports.arr = combinations_arr
