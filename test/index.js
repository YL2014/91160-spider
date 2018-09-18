const assert = require('assert')
const app = require('..')
const request = require('supertest')

describe('Test 160-spider', () => {
  describe('GET /', () => {
    it('should see title "Salak Application"', (done) => {
      request(app.callback())
        .get('/')
        .expect(200, (err, res) => {
          if (err) {
            done(err)
            return
          }
          assert(res.text.includes('<title>Salak Application</title>'))
          assert(res.text.includes('Hello, 160-spider'))
          done()
        })
    })
  })

  describe('GET /welcome', () => {
    it('should see title "Salak Application"', (done) => {
      request(app.callback())
        .get('/welcome')
        .expect(200, (err, res) => {
          if (err) {
            done(err)
            return
          }
          assert(res.text.includes('<title>Salak Application</title>'))
          assert(res.text.includes('Hello, 160-spider'))
          done()
        })
    })
  })
})
