const Salak = require('salak')

const app = new Salak({
  baseDir: __dirname,
  opts: {
    root: 'application'
  }
})

module.exports = app
