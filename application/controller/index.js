const { Controller } = require('salak')

class Index extends Controller {
  async actionIndex () {
    console.log(this.service('index').run)
    await this.service('index').run()
  }
}

module.exports = Index
