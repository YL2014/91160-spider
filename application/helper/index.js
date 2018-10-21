const crypto = require('crypto')

module.exports = {
  md5 (str) {
    return crypto.createHash('md5').update(str).digest('hex')
  },
  sha1 (str, secret) {
    if (secret) {
      return crypto.createHmac('sha1', secret).update(str).digest('hex')
    } else {
      return crypto.createHash('sha1').update(str).digest('hex')
    }
  }
}
