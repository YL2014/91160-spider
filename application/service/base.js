const { Service } = require('salak')
const cheerio = require('cheerio')

class Base extends Service {
  constructor (...args) {
    super(...args)
    this.urls = this.config('urls')
  }
  async baseCurl (url, options = {}, type = 'home') {
    let getCookieMethod = this.getHomeCookie.bind(this)
    let headers = {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
      'Referer': 'https://www.91160.com/',
      'Origin': 'https://www.91160.com',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'X-Requested-With': 'XMLHttpRequest'
    }
    if (type === 'login') {
      getCookieMethod = this.getLoginHomeCookie.bind(this)
      headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
        'Origin': 'https://user.91160.com',
        'Referer': 'https://user.91160.com/login.html',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }
    const { cookie } = await getCookieMethod()
    headers['Cookie'] = cookie
    const result = await this.curl(url, Object.assign({
      method: 'POST',
      dataType: 'json'
    }, options, {
      headers: Object.assign(headers, options.headers || {})
    }))
    return {
      data: result.data,
      headers: result.headers
    }
  }

  async getLoginHomeCookie () {
    const res = await this.curl(this.urls.loginHome)
    const { data, headers } = res
    const $ = cheerio.load(data)
    const token = $('#tokens').val()
    const cookie = headers['set-cookie'].join(';')
    return { token, cookie }
  }

  async getHomeCookie () {
    const res = await this.curl(this.urls.home)
    const { headers } = res
    const cookie = headers['set-cookie'].join(';')
    return { cookie }
  }
}

module.exports = Base
