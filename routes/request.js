var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/equipment_management_system');

var Request = require('../app/models/request');
var User = require('../app/models/user');
var Equipment = require('../app/models/equipment');

router.get('/api/request', function (req, res, next) {
    Request.find()
        .sort({
            'timestamp': -1
        })
        .populate('user')
        .populate('equipment')
        .exec(function (err, requests) {
            if (err)
                res.send(err);
            res.json(requests);
        });
});

router.post('/api/request', function (req, res, next) {

    var request = new Request();

    request.user = req.body.user_name;
    request.equipment = req.body.equipment_name;
    request.quantity = req.body.quantity;
    request.remarks = req.body.remarks;
    request.url = req.body.url;
    request.timestamp = ISODate(d.toISOString + 'T00+09:00');;
    request.status = 1;

    request.save(function (err) {
        if (err)
            res.send(err);
        res.json({
            message: 'New Request created!'
        });
    });
});

module.exports = router;
