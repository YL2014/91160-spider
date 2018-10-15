const { Behavior } = require('salak')

class Index extends Behavior {
  static get routes () {
    return {
      'GET /': 'index',
      'GET /hospital': 'hospital',
      'GET /department': 'department'
    }
  }
}

module.exports = Index
