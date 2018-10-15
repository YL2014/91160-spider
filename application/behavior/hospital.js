const { Behavior } = require('salak')

class Hospital extends Behavior {
  static get routes () {
    return {
      'GET /': 'hospital',
      'GET /hospital': 'hospital',
      'GET /department': 'department',
      'GET /doctors': 'doctors',
      'GET /doctorschedule': 'doctorSchedule'
    }
  }
}

module.exports = Hospital
