const db = require('../db')
const Admin = db.Admin
const { DEFAULT_PASSWORD, NOTLOGIN_CODE } = require('../config')

// 管理员登陆接口
const login = (req, res) => {
  const { query, session } = req
  if (!session.sign) {
    Admin.find({ username: query.username, password: query.password }, (err, result) => {
      if(err) {
        res.send({
          data: {}, 
          code: 'fail',
          message: err
        })
      }
      if (result.length) {
        console.log(query.username + ',  islogin--->')
        session.sign = true
        session.name = query.username
        res.send({
          data: { username: session.name }, 
          code: 'success',
          message: '欢迎登陆,' + req.session.name
        })
      } else {
        res.send({
          data: {}, 
          code: 'fail',
          message: '用户名密码错误'
        })
      }
    })
  } else {
    res.send({
      data: { username: session.name }, 
      code: 'success',
      message: '欢迎登陆,' + session.name
    })
  }
}

// 管理员退出接口
const logout = (req, res) => {
  const { session } = req
  delete session.name
  delete session.sign
  res.send({
    data: {}, 
    code: NOTLOGIN_CODE
  })
}

// 管理员列表接口
const list = async (req, res) => {
  const result = await Admin.find({}, '-password')
  if (result) {
    res.send({
      data: result, 
      code: 'success',
      message: '查询成功'
    })
  } else {
    res.send({
      data: {}, 
      code: 'fail',
      message: '查询用户列表失败'
    })
  }
}

// 新增管理员
const add = async (req, res) => {
  const { body } = req
  if (!body.username) {
    return res.status(200).send({
      data: {}, 
      code: 'fail',
      message: '用户名不能为空'
    })
  }
  const findRes = await Admin.find({ username: body.username })
  if (findRes.length) {
    return res.status(200).send({
      data: {}, 
      code: 'fail',
      message: `用户名${body.username}已存在`
    })
  }
  const createData = { username: body.username, password: DEFAULT_PASSWORD }
  const adminEntity = new Admin(createData)
  const result = await adminEntity.save()
  if (result) {
    res.send({
      data: result, 
      code: 'success',
      message: '操作成功'
    })
  } else {
    res.status(200).send({
      data: {}, 
      code: 'fail',
      message: '新增管理员失败'
    })
  }
}

// 删除管理员
const del = async (req, res) => {
  const { body } = req
  if (!body._id) {
    return res.status(200).send({
      data: {}, 
      code: 'fail',
      message: '用户_id不能为空'
    })
  }
  const result = await Admin.deleteOne({ _id: body._id })
  if (result) {
    res.send({
      data: result, 
      code: 'success',
      message: '操作成功'
    })
  } else {
    res.status(200).send({
      data: {}, 
      code: 'fail',
      message: '删除用户失败'
    })
  }
}
 
//重置密码
const resetpassword = async (req, res) => {
  const { body } = req
  if (!body._id) {
    return res.status(200).send({
      data: {}, 
      code: 'fail',
      message: '用户_id不能为空'
    })
  }
  const result = await Admin.updateOne({ _id: body._id}, { password: DEFAULT_PASSWORD })
  if (result) {
    res.send({
      data: result, 
      code: 'success',
      message: '操作成功'
    })
  } else {
    res.status(200).send({
      data: {}, 
      code: 'fail',
      message: '重置密码失败'
    })
  }
}

const updatepassword = async (req, res) => {
  const { body, session } = req
  if (!body.oldpassword || !body.newpassword) {
    res.status(200).send({
      data: {}, 
      code: 'fail',
      message: '新密码或者旧密码不能空'
    })
  }
  const findRes = await Admin.find({ username: session.name, password: body.oldpassword})
  if (!findRes) {
    res.status(200).send({
      data: {}, 
      code: 'fail',
      message: '旧密码输入不正确'
    })
  }
  const result = await Admin.updateOne({ username: session.name}, { password: body.newpassword })
  if (result) {
    res.send({
      data: result, 
      code: 'success',
      message: '操作成功'
    })
  } else {
    res.status(200).send({
      data: {}, 
      code: 'fail',
      message: '修改密码失败'
    })
  }
}

module.exports = { login, logout, list, add, del, resetpassword, updatepassword }