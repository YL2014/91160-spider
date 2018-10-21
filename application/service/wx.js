const { Service } = require('salak')
const fse = require('fs-extra')

const path = require('path')

class WxService extends Service {
  // 微信服务器验证token
  token (query) {
    const { signature, timestamp, nonce, echostr } = query
    const { token } = this.config('wx')
    const tmpArr = [token, timestamp, nonce]
    const tmpStr = tmpArr.sort().join('')
    if (this.helper.sha1(tmpStr) === signature) {
      return echostr
    } else {
      return 'check faild'
    }
  }

  // 获取access_token
  async accessToken (update) {
    const tokenFilePath = path.resolve(__dirname, '../../.token.json')
    if (!update) {
      if (await fse.pathExists(tokenFilePath)) {
        const tokenInfo = await fse.readJson(tokenFilePath)
        const { token, timestamp, expires } = tokenInfo
        const nowTime = +new Date()
        // 有效期2小时减2分
        if (nowTime - timestamp < expires * 1000 - 120000) {
          return token
        }
      }
    }
    const { appId, secret } = this.config('wx')
    const res = await this.curl(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${secret}`, {
      dataType: 'json'
    })
    const data = res.data
    const _token = data.access_token
    const _expires = data.expires_in
    const _timestamp = +new Date()
    await fse.outputJson(tokenFilePath, { token: _token, expires: _expires, timestamp: _timestamp })
    return _token
  }

  // 获取关注用户的openid列表
  async getUsers () {
    const token = await this.accessToken()
    const res = await this.curl(`https://api.weixin.qq.com/cgi-bin/user/get?access_token=${token}`, { dataType: 'json' })
    const { data } = res
    const { openid } = data.data
    return openid
  }

  // 获取模版列表
  async getTemplate () {
    const token = await this.accessToken()
    const res = await this.curl(`https://api.weixin.qq.com/cgi-bin/template/get_all_private_template?access_token=${token}`, {
      dataType: 'json'
    })
    const { data } = res
    return data.template_list
  }

  // 发送模板消息
  // @TODO 监控放号的医院科室医生
  async sendMsg () {
    const token = await this.accessToken()
    const tousers = await this.getUsers()
    const hospital = '测试医院'
    const department = '测试科室'
    const doctors = '测试医生'
    const body = {
      hospital: { value: hospital, color: '#173177' },
      department: { value: department, color: '#173177' },
      doctors: { value: doctors, color: '#173177' }
    }
    await Promise.all(tousers.map(async item => {
      await this.curl(`https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${token}`, {
        dataType: 'json',
        method: 'POST',
        body: {
          data: body,
          touser: item,
          template_id: this.config('wx').templateId
        }
      })
    }))
  }
}

module.exports = WxService
