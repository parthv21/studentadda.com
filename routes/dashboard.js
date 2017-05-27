var express = require('express');
var path = require('path');
var User = require('../models/userSchema');
var Image = require('../models/imageSchema');
var Event = require('../models/eventSchema');
var passport = require('passport');
var mongoose = require('mongoose');
var moment = require('moment');

var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    if (req.session.username)
        res.sendFile(path.join(__dirname, '../public', 'dashboard.html'));
    else
        res.redirect('/');
});

router.route('/user')
    .get(function (req, res) {
        var username = req.session.username;
        User.findOne({username: username}, function (err, user) {
            if (err) throw err;
            else {
                res.status(200).json(user);
            }
        });
    })
    .post(function (req, res) {
        var username = req.session.username;
        User.findOneAndUpdate({username:username}, {
            $set: {
                gender: req.body.gender,
                dob: new Date(req.body.dob),
                college: req.body.college,
                stream: req.body.stream,
                current: req.body.current,
                branch: req.body.branch
            }
        }, {upsert: true, new: true}, function (err, user) {
            if (err) throw err;
            else {
                res.status(200).json(user);
            }
        });
    });

router.post('/user/avatar',function(req,res){
    console.log("Avatar Body:",req.body);
    var username=req.session.username;
    User.update({username:username},{$set:{avatar:req.body.avatar}},function(err,response){
       if(err) throw err;
       else{
           console.log(response);
           res.status(200).send(response);
       }
    });
});

router.route('/user/events')
    .get(function (req, res) {
        var username = req.session.username;
        Event.findOne({username: username}, {events: 1, _id: 0}, function (err, event) {
            if (err) {
                throw err;
            } else {
                res.status(200).send(event.events);
            }
        });
    })
    .post(function (req, res) {
        var username = req.session.username;
        // console.log("Body:",req.body);
        Event.findOneAndUpdate({username: username}, {
            $push: {
                events: req.body
            }
        }, {new: true}, function (err, event) {
            if (err) {
                throw err;
            } else {
                res.status(200).send(event);
            }
        });
    })
    .put(function (req, res) {
        var username = req.session.username;
        Event.update({username:username,'events.id':req.body.id.toString()},{
            $set:{
                'events.$.allDay':req.body.allDay,
                'events.$.textColor':req.body.textColor,
                'events.$.color':req.body.color,
                'events.$.description':req.body.description,
                'events.$.start':req.body.start,
                'events.$.end':req.body.end,
                'events.$.dow':req.body.dow
            }
        },function(err,response){
            if(err) throw err;
            else{
                res.status(200).send(response);
            }
        });
    })
    .delete(function (req, res) {
        var username = req.session.username;
        Event.update({username: username},{$pull:{events:{id:req.body.id}}}, function (err, response) {
            if (err) throw err;
            else {
                console.log(response);
                res.status(200).send(response)
            }
        });
    });

router.route('user/notes')
    .get(function(req,res){

    })
    .post(function(req,res){

    });


router.get('/logout', function (req, res) {
    req.logout();
    req.session.destroy(function (err) {
        console.log(err);
    });
    res.status(200).json({
        status: true
    });
});

module.exports = router;
