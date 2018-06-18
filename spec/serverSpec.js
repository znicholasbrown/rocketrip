const request = require("request")
const url = "http://localhost:8000/"
let serverFunctions;

beforeAll(() => {
   serverFunctions = require("../server.js")
   console.log("Running tests...")
})

afterAll(() => {
   serverFunctions.server.close()
   console.log("All tests complete.")
})

describe('Word counting captcha server', () => {

  describe("server", () => {

    describe("get /", () => {
        let data = {}

        it("returns status code 200", (done) => {
          request.get(url, (error, response) => {
              expect(response.statusCode).toBe(200)
              console.log("...returns status code 200")
              done()
          })

        })

        it("returns a body of text and an array", (done) => {
          request.get(url, (error, response) => {
              data.body = JSON.parse(response.body)

              expect(data.body.body).toEqual(jasmine.any(String))
              expect(data.body.exclude).toEqual(jasmine.any(Array))
              console.log("...returns a body of text and an array")
              done()
          })
        })
    })

    describe("post /", () => {
        // console.log("post /")
        it("returns status code 200 if passed the correct word count, body string, and exclude array", (done) => {
          let data = {}

          let params = {
            body: 'The small brown fox rests on a lazy Sunday',
            exclude: ['small', 'lazy'],
            count: 7
          }

          request.post(url, {contentType: "application/json", body: params, json: true}, (err, response, body) => {
              expect(response.statusCode).toBe(200)
              console.log("...returns status code 200 if passed the correct word count, body string, and exclude array")
              done()
            })
        })

        it("returns status code 400 if passed an incorrect word count", (done) => {
          let data = {}

          let params = {
            "body": 'The small brown fox rests on a lazy Sunday',
            "exclude": ["small", "lazy"],
            "count": 9
          }

          request.post(url, {contentType: "application/json", body: params, json: true}, (err, response, body) => {
            data.body = JSON.parse(response.statusMessage)

            expect(response.statusCode).toBe(400)
            expect(data.body.body).toEqual('The small brown fox rests on a lazy Sunday')
            expect(data.body.exclude).toEqual(["small", "lazy"])
            expect(data.body.attemptedCount).toBe(9)
            expect(data.body.actualCount).toBe(7)
            expect(data.body.excludedBreakdown).toEqual({ small: 1, lazy: 1 })
            console.log("...returns status code 400 if passed an incorrect word count")
            done()
            })
        })

    })

  })

  describe('word counter', () => {
    it('counts the number of words in a given string, minus the words in a given array', () => {
      expect(serverFunctions.countWords("The small brown fox rests on a lazy Sunday", ["small", "lazy"])).toEqual({count: 7, breakdown: {small: 1, lazy: 1}})
      console.log("... counts the number of words in a given string, minus the words in a given array")
    })
  })

  describe('random whole number', () => {
    it('returns a random whole number between a min and max', () => {

      for(let i = 0; i < 1000; ++i) {
         expect(serverFunctions.randomWhole(5, 10)).not.toBeLessThan(5)
         expect(serverFunctions.randomWhole(5, 10)).not.toBeGreaterThan(10)
      }
      console.log("...returns a random whole number between a min and max (run 1000 times)")
    })
  })

  describe('text body getter', () => {
    it('returns a string', () => {

      expect(serverFunctions.getBody()).toEqual(jasmine.any(String))
      console.log("... returns a string")
    })
  })

  describe('text exclude getter', () => {
    it('returns an array', () => {

      expect(serverFunctions.getExclude('The small brown fox rests on a lazy Sunday')).toEqual(jasmine.any(Array))
      console.log("... returns an array")
    })
  })

})
