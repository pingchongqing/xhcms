var mongoose = require('mongoose') // 引入 mongoose
var url = "mongodb://localhost:27017/xhdata" // 本地数据库地址
mongoose.connect(url, { useNewUrlParser: true }, (err, res)=>{
  if(!err){
    console.log('db is ok')
  }
})

// connect() 返回一个状态待定（pending）的连接，可以用来判断连接成功或失败
var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.log("Successful connection to " + url )
})

var Schema = mongoose.Schema

let admin = {
  username: String,
  password: String
}
let artcls = {
  className: String,
  singlePage: Boolean,
  content: String
}
let article = {
  categoryId: { type: Schema.Types.ObjectId, ref: 'Artcls'},
  category: Object,
  title: String,
  authorName: String,
  keyWord: String,
  weight: Number,
  picPath: String,
  text: String,
  createDate: Date
}

var adminSchema = Schema(admin)
var artclsSchema = Schema(artcls)
var articleSchema = Schema(article)

var Admin = mongoose.model('Admin', adminSchema, 'admin')
var Artcls = mongoose.model('Artcls', artclsSchema, 'artcls')
var Article = mongoose.model('Article', articleSchema, 'article')

module.exports = { mongoose, Admin, Artcls, Article}