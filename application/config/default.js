module.exports = (app) => {
  const config = {
    username: '18000000000',
    password: '123456',
    url: {
      home: 'https://user.91160.com/login.html',
      checkUser: 'https://user.91160.com/checkUser.html',
      login: 'https://user.91160.com/login.html'
    }
  }

  config.logger = {
    defaultLevel: 'info'
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

  return config
}
