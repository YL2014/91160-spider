const { Behavior } = require('salak')

class Wx extends Behavior {
  static get routes () {
    return {
      'GET /': 'index',
      'GET /token': 'accessToken',
      'GET /sendmsg': 'sendMsg'
    }
  }
}

module.exports = Wx
