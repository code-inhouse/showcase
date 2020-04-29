export function getCurrency() {
  switch (window.COUNTRY) {
    case 'Ukraine': {
      return __('грн.')
    }

    default: {
      return __('руб.')
    }
  }
}


export function getURLParams() {
  var params = {}
  if (location.search) {
      var parts = location.search.substring(1).split('&')
      for (var i = 0; i < parts.length; i++) {
          var nv = parts[i].split('=')
          if (!nv[0]) continue
          params[nv[0]] = nv[1] || true
      }
  }
  return params
}


export function range(a, b) {
  // returns [a, a+1, ..., b-1]
  let arr = []
  for (let i = a; i < b; i++) {
    arr.push(i)
  }
  return arr
}
