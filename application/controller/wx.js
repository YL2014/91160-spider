const BaseController = require('./base')

class WxController extends BaseController {
  async actionIndex () {
    const query = this.query
    const token = await this.service('wx').token(query)
    return token
  }

  async actionAccessToken () {
    const data = await this.service('wx').accessToken()
    this.success(data)
  }

  async actionSendMsg () {
    await this.service('wx').sendMsg()
    this.success()
  }
}

module.exports = WxController
