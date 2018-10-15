const { Service } = require('salak')

class Index extends Service {
  constructor (...args) {
    super(...args)
    this.loginService = this.service('login')
    this.hospitalService = this.service('hospital')
    this.hospital = this.config('hospital')
    this.submit = this.config('submit')
  }
  // 抢南山医院口腔科几个医生的号，个人使用
  async run () {
    // 获取医生排号时间段
    const { unitId, depId, doctorIds } = this.hospital
    const { mid, mobile } = this.submit
    const doctorId = doctorIds[1]
    // 获取上下午放号
    const schedules = await this.hospitalService.getDoctorSchedule({ doctorId, unitId })
    const schIds = this._getHolyDay(schedules)
    if (!schIds || schIds.length === 0) {
      return '该医生暂无放号信息'
    }
    const schId = schIds[schIds.length - 1]
    // 获取具体放号时段
    const detlnews = await this.hospitalService.getDetlNew({
      unitId, doctorId, depId, scheduleId: schId
    })
    if (!detlnews || detlnews.length === 0) {
      return '该医生暂无放号信息（无有效具体时段）'
    }
    const detlId = detlnews[detlnews.length - 1].detl_id
    // 获取页面token_key
    const tokenKey = await this.hospitalService.getPageToken({ unitId, schId, detlId, mid })
    return tokenKey
  }

  /**
   * 获取周六周日的放号信息
   * @param {Array} sch 排号时间段
   * @param {Boolean} needWeekend 强行获取周末放号信息，没有返回空数组
   */
  _getHolyDay (sch, needWeekend = false) {
    const arrWork = []
    const arrHoly = []
    sch.map(item => {
      if (item.week_num >= 1 && item.week_num <= 5) {
        arrWork.push(item)
      } else {
        arrHoly.push(item)
      }
    })
    if (arrHoly.length > 0) {
      return this._filterHolyDay(arrHoly)
    } else {
      if (needWeekend) {
        return []
      } else {
        return this._filterHolyDay(arrWork)
      }
    }
  }

  // 筛选有效填的有效时段
  _filterHolyDay (schsArr) {
    const schs = []
    schsArr.map(item => {
      if (item.sch.am.y_state === '1') {
        schs.push(item.sch.am.schedule_id)
      }
      if (item.sch.pm.y_state === '1') {
        schs.push(item.sch.pm.schedule_id)
      }
    })
    return schs
  }
}

module.exports = Index
