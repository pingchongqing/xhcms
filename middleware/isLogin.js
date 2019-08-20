const { NOTLOGIN_CODE } = require('../config')

const isLogin = (req, res, next) => {
  const { url, session } = req
  if (url.includes('login') || url.includes('webApi')) {
    next()
  } else {
    if (session.sign) {
      next()
    } else {
      res.send({
        data: {}, 
        code: NOTLOGIN_CODE,
        message: '登陆失效，请重新登陆'
      })
    }
  }
}
module.exports = isLogin