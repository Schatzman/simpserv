var http = require('http'),
    express = require('express'),
    app = express(),
    MongoClient = require('mongodb').MongoClient,
    ObjectId = require('mongodb').ObjectId;
    bodyParser = require('body-parser');
var db;
app.use(bodyParser.json());

var MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb://localhost:27017/simpdb/', function (err, database) {
    if (!err) {
        console.log('Connected to simpdb.');
        db = database;
    } else {
        throw err;
    }
});

var port = process.env.PORT || 5000,
    server = app.listen(port, function () {
    var port = server.address().port;
    console.log('simpsrv listening at http://localhost:%s', port);
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
app.use('/static', express.static(__dirname + '/bower_components'));
app.use('/static/public', express.static(__dirname + '/public'));

app.get('/users', function (req, res) {
    var users = [];
    var cursor = db.users.find({});
    cursor.each(function (err, doc) {
        if (doc == null) {
            res.json(users);
        } else {
            users.push(doc);
        }
    });
});

app.get('/api/:collection/:docId', function (req, res, next) {
    var collection = req.params.collection;
    var docId = req.params.docId;
    console.log(collection, docId);
    var cursor = db.collection(collection).find({_id:ObjectId(docId)});
    var data = [];
    cursor.each(function (err, doc) {
        if (doc == null) {
            res.json(data);
        } else {
            console.log("Logging doc:", doc);
            data.push(doc);
        }
    });
});

app.get('/api/:collection/:_key/:_value', function (req, res, next) {
    var collection = req.params.collection;
    var _key = req.params._key;
    var _value = req.params._value;
    console.log(collection, _key, _value);
    var query = {};
    query[_key] = _value;
    var cursor = db.collection(collection).find(query);
    var data = [];
    cursor.each(function (err, doc) {
        if (doc == null) {
            res.json(data);
        } else {
            console.log("Logging doc:", doc);
            data.push(doc);
        }
    });
});


app.post('/upload/:collection', function (req, res) {
    console.log(req.params.collection);
    console.log(req.body);
    db.collection(req.params.collection).insert(req.body, function (err, operation) {
        res.json({result: operation.result});
    });
});
