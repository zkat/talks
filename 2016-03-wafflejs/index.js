exports.value = value
function value (thing) {
  return function parser (string) {
    return [
      [thing, string]
    ]
  }
}

exports.fail = fail
function fail () {
  return function parser (string) {
    return []
  }
}

exports.token = token
function token () {
  return function parser (string) {
    if (string.length > 0) {
      return [
        [string[0], string.slice(1)]
      ]
    } else {
      return []
    }
  }
}

exports.bind = bind
function bind (parser, handler) {
  return function (string) {
    var results = []
    parser(string).forEach(function (pair) {
      var thing = pair[0]
      var string = pair[1]
      var parser = handler(thing)
      results = results.concat(parser(string))
    })
    return results
  }
}

exports.is = is
function is (test) {
  return bind(token(), function (tok) {
    if (test(tok)) {
      return value(tok)
    } else {
      return fail()
    }
  })
}

exports.isEq = isEq
function isEq (char) {
  return is(function (x) { return x === char })
}

exports.isNotEq = isNotEq
function isNotEq (char) {
  return is(function (x) { return x !== char })
}

var alphaChars = 'abcdefghijklmnopqrstuvqwxyz'
exports.alpha = alpha
function alpha () {
  return is(function (tok) {
    return alphaChars.indexOf(tok) >= 0
  })
}

var numChars = '1234567890'
exports.number = number
function number () {
  return is(function (tok) {
    return numChars.indexOf(tok) >= 0
  })
}

exports.or = or
function or (parserOne, parserTwo) {
  return function (string) {
    return parserOne(string).concat(parserTwo(string))
  }
}

exports.alphaNumeric = alphaNumeric
function alphaNumeric () {
  return or(alpha(), number())
}

exports.maybe = maybe
function maybe (parser) {
  return or(parser, value(null))
}

exports.not = not
function not (parser) {
  return function (string) {
    if (parser(string).length === 0) {
      return [ [ true, string ] ]
    } else {
      return []
    }
  }
}

exports.noMoreInput = noMoreInput
function noMoreInput () {
  return function (string) {
    if (string.length === 0) {
      return [ [ true, '' ] ]
    } else {
      return []
    }
  }
}

exports.matches = matches
function matches (string) {
  if (string.length === 0) {
    return value('')
  } else {
    return bind(isEq(string[0]), _first =>
           bind(matches(string.slice(1)), _rest =>
           value(string)))
  }
}

exports.and = and
function and (before, after) {
  return bind(before, _before =>
         after)
}

exports.followedBy = followedBy
function followedBy (parser, follower) {
  return bind(parser, res =>
         bind(follower, _followed =>
         value(res)))
}

exports.between = between
function between (open, close, inside) {
  return bind(open, _opener =>
         bind(inside, result =>
         bind(close, _closer =>
         value(result))))
}

exports.collect = collect
function collect (parser) {
  return bind(maybe(parser), res => {
    if (res == null) {
      return value([]) // Base case! :D
    } else {
      return bind(collect(parser), more =>
             value([res].concat(more)))
    }
  })
}

exports.text = text
function text (parser) {
  return bind(collect(parser), chars =>
         value(chars.join('')))
}

exports.line = line
function line () {
  return bind(collect(isNotEq('\n')), lineChars =>
         bind(isEq('\n'), _lineDone =>
         value(lineChars.join(''))))
}

exports.lines = lines
function lines () {
  return collect(line())
}

exports.eol = eol
function eol () {
  return isEq('\n')
}

exports.split = split
function split (parser, separator) {
  return bind(parser, first =>
         bind(collect(and(separator, parser)), rest =>
         value([first].concat(rest))))
}

exports.splitEnd = splitEnd
function splitEnd (parser, separator) {
  return collect(followedBy(parser, separator))
}

exports.parseCSV = parseCSV
function parseCSV (text) {
  var res = csv()(text)
  if (res.length) {
    return res[0][0]
  }
}
exports.csv = csv
function csv () {
  return splitEnd(commaLine(), matches('\n'))
}
exports.commaLine = commaLine
function commaLine () {
  return split(cell(), matches(','))
}
exports.cell = cell
function cell () {
  return or(quotedCell(),
            unquotedCell())
}
exports.unquotedCell = unquotedCell
function unquotedCell () {
  return text(and(not(or(matches(','), matches('\n'))),
                  token()))
}
exports.quotedCell = quotedCell
function quotedCell () {
  return between(matches('"'),
                 matches('"'),
                 text(quotedChar()))
}
exports.quotedChar = quotedChar
function quotedChar () {
  return or(isNotEq('"'),
            and(matches('""'),
                value('"')))
}
