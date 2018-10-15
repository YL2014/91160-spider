const BaseController = require('./base')

class Index extends BaseController {
  async actionIndex () {
    await this.service('index').run()
  }
}

module.exports = Index
