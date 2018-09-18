module.exports = (app) => {
  const config = {}

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
}
