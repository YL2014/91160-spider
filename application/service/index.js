const { Service } = require('salak')

class Index extends Service {
  constructor (...args) {
    super(...args)
    this.loginService = this.service('login')
  }
  async run () {
    await this.loginService.start()
  }
}

module.exports = Index
