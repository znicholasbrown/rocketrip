const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 8000 // Defaults to port 8000 if no port is provided by the process environment
const stringArray = process.argv[2] || require('./eloisaToAbelard.js') // Allows provsion of a different array of strings but defaults to the provided if none is provided

function randomWhole(min, max) { // Returns a random whole number between min and the max (inclusive)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getBody() {
  let body = stringArray[randomWhole(0, stringArray.length - 1)].trim() // Random sentence from the stringArray based on the stringArray's length

  // This check is for edge cases where string arrays contain errors like undefined portions or only whitespace (whive we've trimmed)
  while (!body) {
    getBody()
  }
  return body
}

function getExclude(body) {
  let num = body.length > 1 ? randomWhole(1, (body.length - 1 > 8 ? 8 : body.length - 1)) : 0 // If the number of words in the body is > 1, the number of words to exclude (max 8)
  let exclude = []
  let wordArray = body.toLowerCase().replace(/[.,"\/#!$%\^&\*;:{}=\-_`~()]/g,"").split(' ').filter((word) => word !== "" && word !== " " && word !== undefined ) // Removes all punctuation and splits the body into individual words

  for ( let i = 0; i < num; ++i ) {
    let random = randomWhole(0, wordArray.length - 1)
    let word = wordArray.slice(random, random + 1)

    // Check if word is already excluded
    if ( exclude.indexOf(word[0]) === -1 ) exclude.push(word[0]) // Since slice returns a shallow array, get the contents of the array
  }

  return exclude
}

function countWords(body, exclude) {
  let wordArray = body.toLowerCase().replace(/[.,"\/#!$%\^&\*;:{}=\-_`~()]/g,"").split(' ') // Converts the text to lowercase, removes all punctuation, and splits the body into individual words
  let excludeObject = {}

  for ( let i = 0; i < exclude.length; ++i ) {
    let found = true
    let excludedWord = exclude[i].toLowerCase()
    excludeObject[excludedWord] = 0

    do {
      let index = wordArray.indexOf(excludedWord)

      found = index > -1 ? true : false

      if ( index === -1 ) {
        found = false
      } else {
        ++excludeObject[excludedWord] // Adds one to the excludedWord's count every time it's found
        wordArray.splice(index, 1)
      }

    } while (found)
  }

  return {count: wordArray.length, breakdown: excludeObject}
}

app.get("/", function (request, response) {
  const body = getBody()
  const exclude = getExclude(body)

  response.send({
    body: body,
    exclude: exclude
  })
})

app.use(bodyParser.json())

app.post("/", function (request, response) {
  if (typeof request.body !== 'object' || request.headers['content-type'] !== 'application/json') { // Check to be sure the requester has sent the correct body
    if (request['content-type'] !== 'application/json') response.writeHead(400, 'Server was expecting a content-type of "application/json" but instead recieved a content-type of ' + request.headers['content-type']);
    if (typeof request.body !== 'object') response.writeHead(400, 'Server was expecting a body of type "object" but instead recieved a body of type ' + typeof request.body);
    response.send();
    return;
  } else {

    const query = request.body
    const body = query.body
    const exclude = query.exclude
    const clientCount = query.count
    const realCount = countWords(body, exclude)

    if ( clientCount == realCount.count ) {
      response.writeHead(200);
      response.send();
    } else {
      let data = {
        body: body,
        exclude: exclude,
        attemptedCount: clientCount,
        actualCount: realCount.count,
        excludedBreakdown: realCount.breakdown
      }
      response.writeHead(400, JSON.stringify(data));

      response.send();
    }
  }
})

// listen for requests :)
const server = app.listen(port, function () {
  console.log('Listening on ' + server.address().port)
})

// listen for the CTRl-C event
process.on('SIGINT', terminate)

// gracefully shuts down the server
function terminate () {
  console.log('Shutting down server...')
  server.close(() => {
    console.log('Server shutdown complete.')
  })
}

module.exports = { server, countWords, getBody, randomWhole, getExclude }
