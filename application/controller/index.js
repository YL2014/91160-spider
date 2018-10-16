const BaseController = require('./base')

class Index extends BaseController {
  async actionIndex () {
    await this.service('index').run()
  }

  async actionLogin () {
    const data = await this.service('base').login()
    this.success(data)
  }
}

module.exports = Index
