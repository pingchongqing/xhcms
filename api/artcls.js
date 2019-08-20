const db = require('../db')
const Artcls = db.Artcls

// 分类列表接口
const list = async (req, res) => {
  const result = await Artcls.find()
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
      message: '查询分类列表失败'
    })
  }
}

// 新增分类
const create = async (req, res) => {
  const { body } = req
  if (!body.className) {
    return res.status(200).send({
      data: {}, 
      code: 'fail',
      message: '分类名称不能为空'
    })
  }
  const findRes = await Artcls.find({ className: body.className })
  if (findRes.length) {
    return res.status(200).send({
      code: 'fail',
      message: `分类名称${body.className}已存在`
    })
  }
  const createData = { className: body.className, singlePage: body.singlePage }
  const artclsEntity = new Artcls(createData)
  const result = await artclsEntity.save()
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
      message: '新增分类失败'
    })
  }
}

// 修改分类
const modify = async (req, res) => {
  const { body } = req
  if (!body._id) {
    return res.status(200).send({
      data: {}, 
      code: 'fail',
      message: '_id不能为空'
    })
  }
  const result = await Artcls.updateOne({ _id: body._id }, { ...body })
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
      message: '修改分类失败'
    })
  }
}

const del = async (req, res) => {
  const { body } = req
  if (!body._id) {
    return res.status(200).send({
      data: {}, 
      code: 'fail',
      message: '_id不能为空'
    })
  }
  const result = await Artcls.deleteOne({ _id: body._id })
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
      message: '删除分类失败'
    })
  }
}

const detail = async (req, res) => {  
  const { query } = req
  if (!query._id) {
    return res.status(200).send({
      data: {}, 
      code: 'fail',
      message: '_id不能为空'
    })
  }
  const result = await Artcls.findOne({ _id: query._id})
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
      message: '查询文章详情失败'
    })
  }
}

module.exports = { list, create, modify, del, detail }