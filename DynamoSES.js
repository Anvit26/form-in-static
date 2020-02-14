'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk'); 

const docClient = new AWS.DynamoDB.DocumentClient({region: 'ap-south-1'});

/*SES Part*/

var ses = new AWS.SES();

//var RECEIVER = RECEIVER;
var SENDER = 'dev1@electromech.info';

var response = {
 "isBase64Encoded": false,
 "headers": { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'example.com'},
 "statusCode": 200,
 "body": "{\"result\": \"Success.\"}"
 };

exports.handle = function(e, ctx, callback) {

    console.log(e);
    var params = {
        Item: {
            id: e.email,
            fullname: e.fullname,
            companyname: e.cname,
            designation : e.designation,
            email: e.email,
            phone: e.phone,
            usage: e.rating,
            experience: e.experience,
            UniId: uuid.v1(),
            submittedAt: new Date().getTime(),
        },
        TableName: 'WorkshopForm'
    };

    docClient.put(params, function(err, data){
        if(err){
            callback(err, null);
        }else{
            callback(null, data);
        }
    });
/*SES Part*/
//==============================================================================

//    exports.handle = function (e, context) {
    console.log('Received event:', e);
    sendEmail(e, function (err, data) {
        context.done(err, null);
    });
//};


function sendEmail (e, done) {
    var params = {
        Destination: {
            ToAddresses: [
               e.email
            ]
        },
        Message: {
            Body: {
                Text: {
                       Data: 'Thanks '+ e.fullname + ' For Registration' ,
                        Charset: 'UTF-8' 
                }
            },
            Subject: {
                Data: 'Registration Conformation ',
                Charset: 'UTF-8'
            }
        },
        Source: SENDER
    };
   // console.log('Mail sent to ' + e.email);
    ses.sendEmail(params, done);
}
//==============================================================================
};
/*SES Part*/
/*
var ses = new AWS.SES();

//var RECEIVER = RECEIVER;
var SENDER = 'dev1@electromech.info';

var response = {
 "isBase64Encoded": false,
 "headers": { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'example.com'},
 "statusCode": 200,
 "body": "{\"result\": \"Success.\"}"
 };

exports.handle = function (e, context) {
    console.log('Received event:', e);
    sendEmail(e, function (err, data) {
        context.done(err, null);
    });
};

function sendEmail (e, done) {
    var params = {
        Destination: {
            ToAddresses: [
               e.email
            ]
        },
        Message: {
            Body: {
                Text: {
                       Data: 'Thanks '+ e.fullname + ' For Registration' ,
                        Charset: 'UTF-8' 
                }
            },
            Subject: {
                Data: 'Registration Conformation ',
                Charset: 'UTF-8'
            }
        },
        Source: SENDER
    };
    console.log('Mail sent to ' + e.email);
    ses.sendEmail(params, done);
}*/
