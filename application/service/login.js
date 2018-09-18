const cheerio = require('cheerio')
const Base = require('./base')

class Login extends Base {
  constructor (...args) {
    super(...args)
    this.cookie = super.cookie
    this.url = this.config('url')
  }

  // 模块入口
  async start () {
    await this.login()
  }

  // 登录，给后续接口提供cookie
  async login () {
    let { token, cookie } = await this.checkUser()
    const res = await this.baseCurl(this.url.login, {
      body: {
        username: this.config('username'),
        password: this.config('password'),
        error_num: '0',
        checkcode: '',
        token,
        clientLoginUrl: '',
        target: 'https://www.91160.com/',
        autoLogin: '1'
      },
      headers: {
        'Cookie': cookie
      }
    })
    const { data, headers } = res
    if (headers['set-cookie'] && headers['set-cookie'].length > 0) {
      const newCookie = headers['set-cookie'].join(';')
      cookie = cookie + ';' + newCookie
    }
    return { data, cookie }
  }

  // 登录前验证
  async checkUser () {
    let { token, cookie } = await this.getHomeToken()
    const res = await this.baseCurl(this.url.checkUser, {
      body: {
        type: 'm',
        username: this.config('username'),
        password: this.config('password'),
        checkcode: '',
        token
      },
      headers: {
        'Cookie': cookie
      }
    })
    const { data, headers } = res
    const { code } = data
    // code 1表示成功
    if (code === 1) {
      if (headers['set-cookie'] && headers['set-cookie'].length > 0) {
        const newCookie = headers['set-cookie'].join(';')
        cookie = cookie + ';' + newCookie
      }
      return { token, cookie }
    }
  }

  // 获取登录页面的cookie和token
  async getHomeToken () {
    const homeContent = await this.baseCurl(this.url.home, { methods: 'GET' })
    const { data, headers } = homeContent
    const $ = cheerio.load(data)
    const token = $('#tokens').val()
    const cookie = headers['set-cookie'].join(';')
    return { token, cookie }
  }
}

module.exports = Login
