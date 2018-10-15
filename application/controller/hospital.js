const BaseController = require('./base')

class Hospital extends BaseController {
  // 获取医院信息
  async actionIndex () {
    const data = await this.service('hospital').getHospital()
    this.success(data)
  }

  // 获取科室信息
  async actionDepartment () {
    const { id = 131 } = this.query
    const data = await this.service('hospital').getDepartment(id)
    this.success(data)
  }

  // 获取医生列表
  async actionDoctors () {
    const { unitId = 131, depId = 770, size = 10, p = 1, valid = true } = this.query
    const data = await this.service('hospital').getDoctors({ unitId, depId, size, p, valid })
    this.success(data)
  }

  // 获取医生排号信息
  async actionDoctorSchedule () {
    const { doctorId, unitId = 131, valid = true } = this.query
    const data = await this.service('hospital').getDoctorSchedule({ doctorId, unitId, valid })
    this.success(data)
  }
}

module.exports = Hospital
