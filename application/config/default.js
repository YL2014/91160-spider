module.exports = (app) => {
  const config = {
    username: '18000000000',
    password: '123456',
    urls: {
      loginHome: 'https://user.91160.com/login.html', // 登录首页，需获取该页cookie'
      home: 'https://weixin.91160.com/', // 首页，需获取该页cookie
      checkUser: 'https://user.91160.com/checkUser.html', // 登录前参数校验
      login: 'https://user.91160.com/login.html', // 登录
      hospital: 'https://www.91160.com/home/ajaxgetguahaourl.html', // 医院信息
      depbyunit: 'https://www.91160.com/ajax/getdepbyunit.html', // 科室信息
      homeWx: 'https://weixin.91160.com',
      loginWx: 'https://weixin.91160.com/user/login.html', // 微信登录
      doctors: 'https://weixin.91160.com/depart/getDepDoctorList.html', // 获取医生列表
      doctorSchedule: 'https://weixin.91160.com/doctor/schedule.html', // 获取医生放号信息
      detlnew: 'https://weixin.91160.com/doctor/detlnew.html', // 获取上午和下午具体时段放号信息
      confirm: 'https://weixin.91160.com/order/confirm.html', // 获取下单前的确认页面信息
      submit: 'https://weixin.91160.com/order/submit.html' // 提交挂号单
    }
  }

  config.notFound = {
    pageUrl: 'https://www.jd.com'
  }

  config.error = {
    status: 200,
    type: 'json'
  }

  config.logger = {
    defaultLevel: 'info'
  }

  config.httpClient = {
    dataType: 'json'
  }

  config.curl = {
    beforeRequest (request) {
      app.logger.debug(request)
    },
    afterResponse: (err, response) => {
      if (err) {
        app.logger.error(err)
      }
      if (response) {
        app.logger.debug(response)
      }
    }
  }

  // 这两个信息暂时手动从页面获取
  config.submit = {
    mid: 12345678,
    mobile: 18800000000
  }

  config.hospital = {
    unitId: 131, // 南山医院ID
    depId: 770, // 口腔镶牙科室ID
    doctorIds: [ // 医生ID合集，可以从接口获取
      123456
    ]
  }

  config.wx = {
    token: 'test',
    secret: '',
    appId: '',
    templateId: '76pAHH9MScX08zR2ZsuZytcPqZUjBXv5EHOdW4rGT_w'
  }

  return config
}
