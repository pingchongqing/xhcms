const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const sessionParser  = require('express-session')
const api = require('./api')
const isLogin = require('./middleware/isLogin')
const app = express()

app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(sessionParser({
  secret: 'xinhui',
  cookie: {maxAge: 60 * 1000 * 30},
  resave: false,
  saveUninitialized: true
}))
app.use(express.static(__dirname + '/static'))

app.use(isLogin)

app.get('/', (req, res) => {
  res.send('hello word')
})

// app.post('/c', (req, res) => {  
//   res.cookie('username', "caae", { maxAge: 10000*2, httpOnly: true, signed:true })
//   res.cookie('pass', "ddd", { maxAge: 10000*2, httpOnly: true })
//   res.status(200).send('sr')
// })

app.get('/api/auth/login', api.auth.login)
app.get('/api/auth/list', api.auth.list)
app.post('/api/auth/add', api.auth.add)
app.post('/api/auth/del', api.auth.del)
app.post('/api/auth/resetpassword', api.auth.resetpassword)
app.post('/api/auth/updatepassword', api.auth.updatepassword)
app.post('/api/auth/logout', api.auth.logout)

app.get('/api/artcls/list', api.artcls.list)
app.post('/api/artcls/create', api.artcls.create)
app.post('/api/artcls/modify', api.artcls.modify)
app.delete('/api/artcls/del', api.artcls.del)

app.get('/api/article/list', api.article.list)
app.post('/api/article/create', api.article.create)
app.post('/api/article/search', api.article.search)
app.get('/api/article/detail', api.article.detail)

app.post('/api/file/uploadFile', api.file.uploadFile)


app.get('/webApi/artcls/detail', api.artcls.detail)
app.post('/webApi/article/search', api.article.search)
app.get('/webApi/article/detail', api.article.detail)



app.listen(3000, () => {
  console.log('app is listen 3000')  
})