var express = require('express');
var app = express();

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'your_host',
    port: 'your_port',
    user: 'your_name',
    password: 'your_password',
    database: 'your_dbName'
});

connection.connect(function (err) {
    if (err) {
        console.error('mysql connection error :' + err);
    } else {
        console.log('mysql is connected successfully.');
    }
});

var bodyParser = require('body-parser');
var session = require('express-session');
var fs = require("fs");

var queryResultForKeyword;
var queryResultForPlace;

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//검색할 시 나오는 post
app.get('/keyword', function (req, res) {
    let userInputkeyword = req.query.keyword;
    let sql = 'select count, coorX, coorY from twitter_keyword inner join twitter_place2 on twitter_keyword.local_id = twitter_place2.place_id where keyword = ? ';

    connection.query(sql, userInputkeyword, (err, rows) => {
        //TODO : err handler
        if (err) {
            console.log(err);
        }
        else if (rows.length == 0) {
            alert('검색 결과가 없습니다.');
        }

        res.send(rows);
    });

});

var server = app.listen(3000, function () {
    console.log("Express server has started on port 3000");
});



var router = require('./router/main')(app);
