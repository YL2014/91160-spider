const { Service } = require('salak')
const fse = require('fs-extra')

const path = require('path')

class Base extends Service {
  constructor (...args) {
    super(...args)
    this.urls = this.config('urls')
  }

  /**
   * 通用接口调用
   * @param {String} url 接口地址
   * @param {Object} options 接口相关参数
   * @param {Object} config 配置信息，包括平台，是否需要返回header等
   */
  async baseCurl (url, options = {}, config = {}) {
    config = Object.assign({
      platform: 'wx',
      login: false,
      needHeader: false
    }, config)
    let headers = {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
      'Referer': 'https://weixin.91160.com/',
      'Origin': 'https://weixin.91160.com',
      'Host': 'weixin.91160.com',
      // 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'X-Requested-With': 'XMLHttpRequest'
    }
    if (config.platform === 'pc') {
      headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
        'Referer': 'https://www.91160.com/',
        'Origin': 'https://www.91160.com',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest'
      }
    }
    headers['Cookie'] = config.login && config.platform === 'wx'
      ? await this.login()
      : await this.getPageCookie(this.urls.home)

    const result = await this.curl(url, Object.assign({
      method: 'POST',
      dataType: 'json'
    }, options, {
      headers: Object.assign(headers, options.headers || {})
    }))

    if (config.needHeader) {
      return {
        data: result.data,
        headers: result.headers
      }
    } else {
      return result.data
    }
  }

  // 获取主页的cookie
  async getPageCookie (url) {
    const res = await this.curl(this.urls.home)
    const { headers } = res
    const cookie = headers['set-cookie'].join(';')
    return cookie
  }

  // 登录
  async login () {
    const cookieFilePath = path.resolve(__dirname, '../../.cookie.json')
    // 读取文件里的cookie信息
    if (await fse.pathExists(cookieFilePath)) {
      const cookieInfo = await fse.readJson(cookieFilePath)
      const nowTime = +new Date()
      // 暂定有效期5分钟
      if (nowTime - cookieInfo.timestamp < 10 * 60 * 1000) {
        return cookieInfo.cookie
      }
    }
    const res = await this.baseCurl(this.urls.loginWx, {
      method: 'POST',
      headers: {
        'Referer': 'https://weixin.91160.com/account/index.html',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      body: {
        username: this.config('username'),
        password: this.config('password')
      }
    }, { needHeader: true })
    const { data, headers } = res
    if (data.state !== 1) {
      throw Error(data.msg || '登录失败')
    }
    const cookie = headers['set-cookie'].join(';')
    const nowTime = +new Date()
    // cookie写入文件，防止频繁登录
    await fse.outputJson(cookieFilePath, { cookie, timestamp: nowTime, accessToken: data.access_token })
    return cookie
  }
}

module.exports = Base
