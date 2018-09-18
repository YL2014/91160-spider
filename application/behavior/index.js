const { Behavior } = require('salak')

class Index extends Behavior {
  static get routes () {
    return {
      'GET /': 'index'
    }
  }
}

module.exports = Index
