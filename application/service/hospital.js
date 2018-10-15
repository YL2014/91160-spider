const Base = require('./base')
const cheerio = require('cheerio')

class Hospital extends Base {
  constructor (...args) {
    super(...args)
    this.urls = this.config('urls')
    this.loginService = this.service('login')
  }

  async start () {
    await this.getHospital()
  }
  async _baseCurl (url, options) {

  }

  // 获取医院信息
  async getHospital () {
    const res = await this.baseCurl(this.urls.hospital)
    const { data } = res
    const arr = this._filterHospital(data.quikhospitals)
    return arr
  }

  // 从返回的html字符串匹配出医院信息
  _filterHospital (str) {
    const reg = /<option value="[\d]*"\s>([\s\S]*?)<\/option>/g
    const matchArr = str.match(reg)
    const arr = matchArr.map(item => {
      const ireg = /<option value="([\d]*)"\s>([\s\S]*?)<\/option>/g
      const matchItem = ireg.exec(item)
      return {
        value: matchItem[1],
        name: matchItem[2]
      }
    })
    return arr
  }

  /**
   * 获取医院的科室信息
   * 南山医院 131，反回的口腔修复科:770，口腔内科:769，拔牙:768
   * @param {*} id 医院ID
   */
  async getDepartment (id = 131) {
    const res = await this.baseCurl(this.urls.depbyunit, {
      mtehod: 'POST',
      body: { keyValue: id }
    })
    const { data } = res
    return data
  }

  /**
   * 获取医生列表
   * @param unit_id 医院ID
   * @param dep_id 科室ID
   * @param size 每页数量
   * @param p 页数
   * @param valid 只输出可预约医生
   */
  async getDoctors ({ unitId, depId, size, p, valid }) {
    const res = await this.baseCurl(this.urls.doctors, {
      query: {
        unit_id: unitId,
        dep_id: depId,
        size,
        p,
        date: ''
      }
    })
    const { data } = res
    if (data.state !== 1) {
      throw Error(data.msg || '获取失败')
    }
    if (valid) {
      const filterData = data.data.list.filter(item => item.leftNum > 0)
      data.data.list = filterData
    }
    return data.data
  }

  /**
   *  获取有号的医生的具体信息
   * @param doctorId 医生ID，getDoctors返回里的doctor_id
   * @param unitId 医院ID
   * @param valid 只获取可预约信息
   */
  async getDoctorSchedule ({ doctorId, unitId, valid }) {
    const res = await this.baseCurl(this.urls.doctorSchedule, {
      query: {
        unit_id: unitId,
        doctor_ids: doctorId
      }
    })
    const { data } = res
    const filterData = this._filterDoctorSchedule(data, unitId, valid)
    return filterData
  }

  /**
   * 过滤上面获取到的医生排号信息，获取到的是上午和下午
   * @param {String} data 获取到的排号数据
   * @param {String} unitId 医院ID
   * @param {Boolean} valid 是否只获取可预约信息
   */
  _filterDoctorSchedule (data, unitId, valid = true) {
    const wrap1 = data.sch[unitId]
    const keys1 = Object.keys(wrap1)
    const wrap2 = wrap1[keys1[0]]
    const keys2 = Object.keys(wrap2)
    const wrap3 = wrap2[keys2[0]]
    const arr = []
    for (let key in wrap3) {
      let curInfo = wrap3[key]
      if (valid) {
        if (curInfo.sch.am.y_state === '1' || curInfo.sch.pm.y_state === '1') {
          arr.push(curInfo)
        }
      } else {
        arr.push(curInfo)
      }
    }
    return arr
  }
  /**
   * 获取医生排号的具体时段
   * @param {Object} param0
   *  - unitId 医院ID
   *  - doctorID 医生ID
   *  - depId 科室ID
   *  - scheduleId 预约时段ID(上午或者下午)，通过getDoctorSchedule方法来获取
   */
  async getDetlNew ({ unitId, doctorId, depId, scheduleId }) {
    const res = await this.baseCurl(this.urls.detlnew, {
      query: {
        unit_detl_map: JSON.stringify([{
          unit_id: unitId,
          doctor_id: doctorId,
          dep_id: depId,
          schedule_id: scheduleId
        }])
      }
    })
    const { data } = res
    if (data.status !== 1) {
      throw Error(data.msg)
    }
    let newData = Object.values(data.data)
    if (newData.length === 0) return []
    return newData[0].filter(item => item.yuyue_max - item.yuyue_num > 0)
  }

  /**
   * 拉取下单前的确认页面，解析页面上的token_key
   * @param unitId 医院ID
   * @param schId 时段ID
   * @param detlId 具体时段ID
   * @param mid 就医用户的mid
   */
  async getPageToken ({ unitId, schId, detlId, mid }) {
    const { cookie } = await this.loginService.login()
    const res = await this.baseCurl(this.urls.confirm, {
      query: {
        unit_id: unitId,
        sch_id: schId,
        detl_id: detlId,
        mid
      },
      headers: {
        'Cookie': cookie
      }
    })
    const { data } = res
    const $ = cheerio.load(data)
    const tokenKey = $('input[name=token_key]').val()
    return tokenKey
  }

  /**
   * 下挂号单：参数需从页面上获取
   * @param mobile 用户手机号
   * @param mid 用户mid
   * @param token_key 页面token
   */
  async submit ({ mobile, mid, tokenKey }) {
    const res = await this.baseCurl(this.urls.submit, {
      method: 'POST',
      body: {
        mobile,
        mid,
        token_key: tokenKey,
        submit_anxin: 0,
        accident_id: 0,
        insurance_alias: 0,
        setting_refresh: 0
      }
    })
    const { data } = res
    if (data.state !== 1) {
      throw Error(data.msg || '下单失败')
    }
    return data.data
  }
}

module.exports = Hospital
