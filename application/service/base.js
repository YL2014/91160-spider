const { Service } = require('salak')

class Base extends Service {
  constructor (...args) {
    super(...args)
    this.cookie = ''
  }
  async baseCurl (url, options = {}) {
    const result = await this.curl(url, Object.assign({
      method: 'POST',
      dataType: 'json'
    }, options, {
      headers: Object.assign({
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
        'Origin': 'https://user.91160.com',
        'Referer': 'https://user.91160.com/login.html',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        // 'Cookie': this.cookie
      }, options.headers)
    }))
    return {
      data: result.data,
      headers: result.headers
    }
  }
}

module.exports = Base
