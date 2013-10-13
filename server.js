var mongojs = require('mongojs');
var express = require('express');

var app = express();

var dbConString = 'mongodb://' + process.env.REGISTRY_AUTH + '@ds047958.mongolab.com:47958/registry';
var db = mongojs(dbConString, ['computers']);

var ensureForwardedFor = function(req) {
    return req.socket.forwardedFor = req.socket.forwardedFor
        || req.headers['x-forwarded-for']
        || req.socket.address().address;
};

app.get('/push', function(req, res) {
//    var wanip = req.headers['x-forwarded-for'] || req.socket.address().address;
    var wanip = ensureForwardedFor(req);
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
//    var wanip = req.headers['x-forwarded-for'] || req.socket.address().address;
    var wanip = ensureForwardedFor(req);
    db.computers.find({wanip: wanip}, {_id:0}, function(err, result) {
        if (err) return res.send(500, { message: err.message });
        res.send(result);
    });
});

app.listen(8002);
