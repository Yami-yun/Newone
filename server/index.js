const express = require("express");
const app = express();
const bodyParser = require("body-parser");
// app.use(express.json());


const mongoose = require("mongoose");
const connect= mongoose.connect("mongodb+srv://yunyami:1234@cluster0.s4kox.mongodb.net/test?retryWrites=true&w=majority", {
    useNewUrlParser: true, useUnifiedTopology: true,
    useCreateIndex: true, useFindAndModify: false
})
.then(()=> console.log('MongoDB Connected...'))
.catch(err=> console.log(err));

app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.send('hello world2222');
});

// use($1: 미들웨어가 함수가 적용되는 기본 경로, $2 로컬 경로) : api를 모아놓을 수 있음


app.use('/api/users', require('./routes/users'));;
// 3000 번 포트에 연결
app.listen(5000);