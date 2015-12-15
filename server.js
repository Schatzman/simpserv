var http = require('http'),
    express = require('express'),
    app = express();

var port = process.env.PORT || 5000,
    server = app.listen(port, function () {
    var port = server.address().port;
    console.log('MEAN RPG app listening at http://localhost:%s', port);
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
app.use('/static', express.static(__dirname + '/bower_components'));
app.use('/static/public', express.static(__dirname + '/public'));
