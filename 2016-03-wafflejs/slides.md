# The Poem

## Preamble

### Before I start:

(In response to Alfred Tennyson’s poem Vision of Sin, which included the line Every moment dies a man, // every moment one is born.) If this were true, the population of the world would be at a stand-still. In truth, the rate of birth is slightly in excess of death. I would suggest that the next edition of your poem should read: “Every moment dies a man, every moment 1 1/16 is born.” Strictly speaking, the actual figure is so long I cannot get it into a line, but I believe the figure 1 1/16 will be sufficiently accurate for poetry.

### Hi There

```javascript
JSON.parse(text) // => { name: "Parser for Things" }
```

So there Are lots of Ways to take Text from a File
and turn That into Data we can Munge or Compile

Today we will Parse a few Things, Gradually
By the Time we are Done we'll have read CSV

"But Parsing is Hard", I hear Everyone Say
"There are Scanners and Lexers and Tokens and..." Hey!

Don't you Fret! It's OK! Parsers Really are None
Of these Things that you Feared from CS 101.

### What Is Happening

```
parseNumbers + parseObjects + parseStrings + parseBool = parseJSON!
```

Here Tonight I will Talk of a Simpler Approach
For those Times when your Files all have Commas and Quotes

and with Me you will Learn how small Parsers Combine
to form Bigger and Better ones, and Do it in Rhyme


### Basic Thing Parser

```javascript
function parser (string) {
  return [ // list
    [ // pair
      {thing:true},
      string
    ]
  ]
}

parser('foo') // => [ [ { thing: true }, 'foo' ] ]
```

The Biggest Components are these Functions that Parse
And As you can See, it's all Really quite Sparse.

What we want to Return are Arrays of Arrays
With a Value and Tail as the String slides Away.

Now this Value can Be any Thing, even Fake
Just as Long as this Isn't a Structure you Break

We'll say Parsers for Things, then, are Functions from Strings
to Lists of Pairs of Things and Strings.

## Parser Combinator Intro

### The Tetrarchy of the Essential Parsers

```javascript
value()
fail()
token()
bind()
```

Now in Order to Get at these Parsers I Love
We need First to Define these four Functions Above.

And This is just It, all you Need is these Four
There are Utils and Details, but These are the Core.

### Basic Parser Maker

```javascript
function value (thing) {
  return function parser (string) {
    return [
      [thing, string]
    ]
  }
}

var parser = value('hi') // always parses 'hi' as the Thing
parser('parse me') // => [ [ 'hi', 'parse me' ] ]

var parser2 = value({})
parser2('parse me too!') // => [ [ {}, 'parse me too!' ] ]
```

Our First Function is Simple, all it does is Enclose
It fulfills our base Contract, with some Thing that we Chose

See, our Thing here's a Value that's now Caught in our Net
The Result of our Parsing, it's what Users will Get.

We shall Say that this Parser will Always just Pass
No Matter what Value or Input it Has.

And while Simple, please Note that it's Not just for Fun
But by Sheer count of Uses, its Rank's surely One.

### Parser That Always Fails

```javascript
function fail () {
  return function parser (string) {
    return []
  }
}

var parser = fail()
parser('please parse me?') // => [] (no results!)
```

Now Failing Fulfills here Another Requirement:
To Determine, at All, when it's Time for Retirement

I said Earlier that Parsing Required a Pair
But there's more to the story -- so I fibbed just a Hair

The Array will be Empty when Parsers Abort
And Therefore we Use this to Cut this branch Short

### Parser That Consumes One Token

```javascript
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

var parser = token()
parser('abc') // => [ [ 'a', 'bc' ] ]
```

Having Values is Good, and Aborting is not,
But we're Writing a Parser, and our Input is Stuck!

Let's write Token like this: Take one Thing, ask for More,
If there Was nothing Else, give it Up, let's Abort.

### Parser That Binds Together (Combines) Parsers

```javascript
function bind (parser, handler) {
  return function (string) {
    var finalValues = []
    var parserResult = parser(string)
    parserResult.forEach(function (pair) {
      var thing = pair[0]
      var string = pair[1]
      var returnedParser = handler(thing)
      finalValues = finalValues.concat(returnedParser(string))
    })
    return finalValues
  }
}

var parser = bind(token(), function (tok) {
  // `tok` is the Thing that got parsed by `token()`!
  return value(tok.toUpperCase()) // has to return a parser!
})
parser('foo') // => [ [ 'F', 'oo' ] ]
```

Now our first Combinator's a bit more Complex
But it's needed for Parsers I'll Talk about Next

See the First arg's a Parser whose Result it will Save
Then for Every pair In there, that Handler you Gave?

It will Call on the Value, and a Parser Expect
And those Parsers will Run, we are Almost all Set

Just as Soon as we Cat all those Values Together,
And one Call to our Bind, we have Walked through Together

### Consuming Multiple Things

```javascript
var parser = bind(token(), function (one) {
      return bind(token(), function (two) {
      return bind(token(), function (three) {
      return value(three + two + one)
    })
  })
})
parser('abc') // => [ [ 'cba', '' ] ]
parser('ab') // => []
```

This Simple Example might help Illustrate
How Chaining Together your Binds is quite Great

You'll Notice if One of the Nested ones Fails
It Simply yields Nothing, so Then it just Bails

### Is This What You Wanted?

```javascript
function is (test) {
  return bind(token(), function (tok) {
    if (test(tok)) {
      return value(tok)
    } else {
      return fail()
    }
  })
}
var parser = is(function (tok) { return tok === 'a' })
parser('abb') // => [ [ 'a', 'bb' ] ]
```

I'd Like you to Read how the `is` parser's Written
It calls the `test` Function, see if `token()` will fit in.

And Because we are Binding, we then Promptly call `value()`,
Unless `test` turned out Falsy, then just `fail()` and don't Argue.

### Parsing The One Or The Other One

```javascript
function or (parserOne, parserTwo) {
  return function (string) {
    var res1 = parserOne(string)
    var res2 = parserTwo(string)
    return res1.concat(res2)
  }
}

function alphaNumeric () {
  return or(alpha(), number())
}

var parser = alphaNumeric()
parser('a') // => [ [ 'a', '' ] ]
parser('1') // => [ [ '1', '' ] ]
```

Two more Functions to Go! This one `or` makes Decisions
It takes Two of your Parsers, combines with Precision

(wow that was bad)

But as you can see, it runs Both, just for You
And Then in the End, joins `res1` and `res2`

With it we Take, these two Parsers that we Found
and very Easily get a Bigger one -- Potential Abound!

### Recursing For Fun And Profit

```javascript
function collect (parser) {
  return bind(or(parser, value(null)), function (red) {
    if (res == null) {
      return value([]) // Base case! :D
    } else {
      return bind(collect(parser), function (more) {
        return value([res].concat(more))
      })
    }
  })
}
var parser = collect(alpha())
parser('aaa1')[0] // => [ [ 'a', 'a', 'a' ], '1' ]
```

We have Gone over So many Basics, you're Finding
Values and Failures and Tokens and Bindings

This One recurses, and That way collects
By first parsing a Head and then catting the Rest.

As with Any such Function, we must Always Remember
The Base case that Tells us when It's time to Surrender

## Parsing a CSV

### Starting at the Top

```javascript
function parseCSV (text) {
  var parser = csv()
  var res = parser(text)
  if (res.length) {
    return res[0][0]
  }
}

parseCSV('foo\nbar,baz\nquux,asd,323\n')
// => [ [ 'foo' ], [ 'bar', 'baz' ], [ 'quux', 'asd', '323' ] ]
```

Here we Are, as I Promised, a Complete working Parser
Or at least the Beginning, but it's Not that much Longer

So the Thing that we Do when there's Text to parse Out
Is we Start at the Top, and then Work our way Down

For Convenience, you See, we Extract the first Value
And we Throw out the Rest, Shoot it Down, just like: Pew pew!

Our Thing, in the end, is an Array of Arrays,
with each Array in the Top one listing Cells in their Place.

### csv()

```javascript
// parses an entire CSV text
function csv () {
  return lib.splitEnd(commaLine(), lib.string('\n'))
}

var splitter = lib.splitEnd(lib.alpha(), lib.string('x'))
splitter('axbxcx')[0][0] // => [ 'a', 'b', 'c' ]
```

`csv`'s our top Parser, it uses `splitEnd`
"But you Didn't Define it Above!", you contend.

This is True, as it Happens, it's Part of a Library
Writing `splitEnd` is Not just more Load we must Carry

The real Magic, you See now, of This kind of Parsing
is that We just Reuse others' Work without Tiring.

### commaLine()

```javascript
// parses a comma-separated line
function commaLine () {
  return lib.split(cell(), lib.string(','))
}

var splitter = lib.split(lib.alpha(), lib.string('x'))
splitter('axbxc')[0][0] // => [ 'a', 'b', 'c' ]

var lineParser = commaLine()
lineParser('a,"b",c')[0][0] // => [ 'a', 'b', 'c' ]
```

We still need `commaLine()`, it is Something we're Missing
it just Splits cells by Commas, quoted Field quotes Dismissing

And so `lib` once Again pops in Here with `lib.split`
Handy that, it's just There! This Library's the Shit.

### cell()

```javascript
// parses a single cell of CSV data
function cell () {
  return lib.or(quotedCell(),
                unquotedCell())
}

var cellParser = cell()
cellParser('abc')[0][0] // => 'abc'
cellParser('"this,has,commas"')[0][0] // => 'this has spaces'
cellParser('"this "" is escaped"')[0][0] // => 'this " is escaped'
```

CSV `cell`s are Text, between Commas they're Placed
And if We're being real Strict, double quotes can Escape.

It Looks like this Parser is Doing so Much
But it's Using `lib.or()`, passing Parsers to Such

### unquotedCell()

```javascript
function unquotedCell () {
  var end = lib.or(lib.string(','), lib.string('\n'))
  var cellCharacter = lib.and(lib.not(end), lib.token())
  return lib.text(cellCharacter)
}
```

A Cell without Quotes is just Text before `end`
We Collect all the Chars and conCat them with `text`

See that `and` is a Parser that Runs both its Args
and then Gives back whatEver its Last one would Parse

`lib.not`, by the Way, is not Quite like the Rest
It just Runs the one Parser, not Consuming -- A Test!

### quotedCell()

```javascript
// Parses a cell with quotes around it -- used for spaces and escapes
function quotedCell () {
  return lib.between(lib.string('"'),
                     lib.string('"'),
                     lib.text(quotedChar()))
}

var cellParser = quotedCell()
cellParser('abc') // => []
cellParser('"this has spaces"')[0][0] // => 'this has spaces'
cellParser('"this "" is escaped"')[0][0] // => 'this " is escaped'
```

`quotedCell` here takes Care of this One special Case
where we Want quotes or Commas or Spaces, Escaped

Just for Cases like These we have `lib.between`
It takes Open and Close and Inside, for the win.

### quotedChar()

```javascript
function quotedChar () {
  var escapedQuote = lib.followedBy(lib.string('"'), lib.string('"'))
  return lib.or(lib.noneOf('"'), escapedQuote)
}

var char = quotedChar()
char('a')[0][0] // => 'a'
char('""')[0][0] // => '"'
char('"') // => []
```

`quotedChar` is the Last of our Parsers Tonight
It just Parses the Characters in `quotedCell` Right.

See, they're Usually Anything Other than Quotes
But those Quotes can be Quoted, and Yield just one Quote.

### The ~25-line Parser

```javascript
function parseCSV (text) {
  var parser = csv()
  var res = parser(text)
  if (res.length) {
    return res[0][0]
  }
}
function csv () {
  return lib.splitEnd(commaLine(), lib.string('\n'))
}
function commaLine () {
  return lib.split(cell(), lib.string(','))
}
function cell () {
  return lib.or(quotedCell(), unquotedCell())
}
function unquotedCell () {
  var terminator = lib.or(lib.string(','), lib.string('\n'))
  var cellCharacter = lib.and(lib.not(terminator), lib.token())
  return lib.text(cellCharacter)
}
function quotedCell () {
  return lib.between(lib.string('"'),
                     lib.string('"'),
                     lib.text(quotedChar()))
}
function quotedChar () {
  return lib.or(lib.noneOf('"'),
                lib.and(lib.string('""'),
                        lib.value('"')))
}
```

There you Have it, that's All. As I Promised Before,
25 Lines of Code, and you Didn't get Bored.

So next Time you need Things, just use Functions from Strings
To Lists of Pairs of Things and Strings.

## Credits

Base tutorial: https://github.com/drewc/smug/blob/master/doc/tutorial.org
Original Rhyme: http://www.willamette.edu/~fruehr/haskell/seuss.html
