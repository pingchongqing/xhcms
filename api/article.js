const db = require('../db')
const Article = db.Article

// 文章列表接口
const list = async (req, res) => {
  const result = await Article.find()
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
      message: '查询文章列表失败'
    })
  }
}
// 文章分页列表接口
const search = async (req, res) => {
  const { body } = req
  const { pageNum = 1, pageSize, title, createDate, authorName, categoryId } = body
  const titleExp = new RegExp(title, 'i')
  const authExp = new RegExp(authorName, 'i')
  const searchFileds = {title: { $regex: titleExp }, authorName: { $regex: authExp }}
  if (createDate) {
    searchFileds.createDate = {$gte: createDate[0], $lt: createDate[1]}
  }
  if (categoryId) {
    searchFileds.categoryId = categoryId
  }
  var total = 0
  Article.countDocuments(searchFileds, function (err, doc) { 
    if (err) {
      console.log(err)
    } else {
      total = doc
    }
  })
  const option = { populate: 'categoryId' }
  if (pageSize) {
    option.limit = Number(pageSize)
  }
  if (Number(pageNum) > 1) {
    option.skip = pageSize * (pageNum - 1)
  }

  const result = await Article.find(searchFileds, { text: 0 }, option)
  if (result) {
    res.send({
      data: {
        list: result,
        total: total
      }, 
      code: 'success',
      message: '查询成功'
    })
  } else {
    res.send({
      data: {}, 
      code: 'fail',
      message: '查询文章列表失败'
    })
  }
}

// 新增文章
const create = async (req, res) => {
  const { body } = req
  if (!body.categoryId || !body.title || !body.text) {
    return res.status(200).send({
      data: {}, 
      code: 'fail',
      message: '分类，标题，文章内容不能为空'
    })
  }
  const createData = { ...body, createDate: Date.now() }
  let result = {}
  if (body._id) {
    result = await Article.updateOne({ _id: body._id }, createData)
  } else {
    const articleEntity = new Article(createData)
    result = await articleEntity.save()
  }

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
      message: '更新文章失败'
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
  const result = await Article.findOne({ _id: query._id})
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

const del = async (req, res) => {
  const { body } = req
  if (!body._id) {
    return res.status(200).send({
      data: {}, 
      code: 'fail',
      message: '_id不能为空'
    })
  }
  const result = await Article.deleteOne({ _id: body._id })
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
      message: '删除失败'
    })
  }
}


module.exports = { list, create, search, detail, del }