module.exports = (app) => {
  return {
    success (data) {
      const Joi = this.Joi
      return {
        code: Joi.number().required(),
        msg: Joi.string().allow(''),
        data
      }
    }
  }
}
