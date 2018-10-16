const { Behavior } = require('salak')

class Index extends Behavior {
  static get routes () {
    return {
      'GET /': 'index',
      'GET /login': 'login'
    }
  }
}

module.exports = Index
