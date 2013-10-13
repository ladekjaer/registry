var mongojs = require('mongojs');
var express = require('express');

var app = express();

var dbConString = 'mongodb://' + process.env.REGISTRY_AUTH + '@ds047958.mongolab.com:47958/registry';
var db = mongojs(dbConString, ['computers']);

app.get('/push', function(req, res) {
    var wanip = req.socket.address().address;
    var hostname = req.query.hostname;
    var clientInfo = {
        _id: hostname + '@' + wanip
        , creationTime: new Date()
        , wanip: wanip
        , lanip: req.query.ip
        , hostname: hostname 
    };
    db.computers.save(clientInfo, function(err) {
        if (err) return res.send(500, { message: err.message });
        delete clientInfo._id;
        res.send(clientInfo);
    });
});

app.get('/', function(req, res) {
    var wanip = req.socket.address().address;
    db.computers.find({wanip: wanip}, {_id:0}, function(err, result) {
        if (err) return res.send(500, { message: err.message });
        res.send(result);
    });
});

app.listen(8080);
