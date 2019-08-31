//1st  Get a reference to MOngoDB module
let mongodb = require('mongodb');

//2nd from ref get the client
let mongoDBClient = mongodb.MongoClient;

//3 from the client to the db
let db;
let col;
let url = 'mongodb://localhost:27017';
mongoDBClient.connect(url, { useNewUrlParser: true },
    function (err, client) {
            console.log("Connected successfully to server");
            db = client.db("week5lec2");
            col = db.collection('users');
            col.insertOne({name: 'TIM', age: 23})
    });



let express = require("express");
let app = express();
let bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:false}));
app.listen(8080);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/indexlec.html');
});

app.post('/newdocument',function(req,res){
    let nrDoc = {name: req.body.fullName, age: parseInt(req.body.uage)};

    col.insertOne(nrDoc);
    res.redirect('/');
});

app.get('/getAll', function(req,res){
    let query = {};
    col.find(query).toArray(function(err,data){
        res.send(data);
    });
});

app.get('/getAllN', function(req,res){
    let query = {};
    let sort = {age:1};
    col.find(query).sort(sort).limit(5).toArray(function(err,data){
        res.send(data);
    });
});


app.get('/getAllage', function(req,res){
    let query = {age: {$lte: 20}};
    col.find(query).toArray(function(err,data){
        res.send(data);
    });
});


app.get('/deleteName/:getName',function(req,res){
    let dname = req.params.getName;
    let filter = {name: dname};
    col.deleteOne(filter);
    res.redirect('/getAll');
});



app.get('/addAge/:newAge',function(req,res){
   let theNewAge = parseInt(req.params.newAge);
   let query = {};
   let theUpdate = {$mul:{age: 2}};
   col.updateMany(query, theUpdate,{upsert: true}, function(err,obj){
       col.find({}).toArray(function(err,data){
           res.send(data);
       });
   })
});

//From the db get the collection
//using the collection, perform insert, delete, update, find CRUD operations

//Workshop
db.collection('flights').find({airline: "VA"}).toArray(function(err,data){});
db.collection('flights').findOne({ from : "SA", to : "SYD"}).toArray(function(err,data){});

query = {from: "SYD", to: "NT"};
let theUpdate = {$mul:{cost: 2}};
db.collection('flights').updateMany(query,theUpdate, {upsert: true}, function(err,data){});

let query = {cost: {$lt:300}};
db.collection('flights').deleteMany(query).toArray(function(err,data){});


let mongodb = require('mongodb');
let mongoClient = mongodb.MongoClient;
let express = require('express');
let app = express();
let bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:false}));
app.listen(8080);

let url = 'mongodb://42.128.78.49:55312';

let db;
let col;
mongoDBClient.connect(url, { useNewUrlParser: true },
    function (err, client) {
        db = client.db("travel");
        col = db.collection('flights');
    });

app.get('/', function(req,res){
    res.sendFile(__dirname + '/views/week5lec.html');
});

app.post('/newdocuments',function(req,res){
   let newDoc = {from: req.body.from, to: req.body.to, airline: req.body.airline};
   col.insertOne(newDoc);
   res.redirect('/');
});