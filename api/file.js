const fs = require('fs')
const multiparty = require('multiparty')
const { FILEDOMAIN } = require('../config')

const uploadFile = (req, res) => {
  //生成multiparty对象，并配置上传目标路径
  var form = new multiparty.Form({uploadDir: './static/files/'})
  //上传完成后处理
  form.parse(req, function(err, fields, files) {
    if(err){
      res.send({
        code: 'fail',
        message: err
      })
    } else {
      var inputFile = files.file[0]
      var uploadedPath = inputFile.path
      uploadedPath = uploadedPath.replace(/\\+/g, '/').replace(/static\/files\//, '')
      res.send({
        data: '/files/' + uploadedPath, 
        code: 'success',
        message: '操作成功'
      })
    }
  })  
}
module.exports = { uploadFile }