let express = require("express");
let mongodb = require("mongodb");
let bodyparser = require('body-parser');
let morgan = require('morgan');

let app = express();

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


app.use(express.static('images'));
app.use(express.static('css'));

app.use(bodyparser.urlencoded({ extended: false }));
// app.use(morgan('common'));

app.listen(8080);

//Configure MongoDB
const MongoClient = mongodb.MongoClient;
// Connection URL
const url = "mongodb://localhost:27017/";

//reference to the database (i.e. collection)
let db;
//Connect to mongoDB server
MongoClient.connect(url, { useNewUrlParser: true },
    function (err, client) {
        if (err) {
            console.log("Err  ", err);
        } else {
            console.log("Connected successfully to server");
            db = client.db("tasks");
        }

    });


//get the home HTML
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/home.html');
});

app.get('/addnewtasks', function (req, res) {
    res.sendFile(__dirname + '/views/insertnewtasks.html');
});

//insert new tasks
app.post('/addnewtasks', function(req,res){
    let taskDetails = req.body;
    let newId= Math.round(Math.random()*1000)
    db.collection('tasks').insertOne({taskID: newId, taskName: taskDetails.tname, taskAssign: taskDetails.tuser, taskDate: taskDetails.tdate, taskStatus: taskDetails.tstat, taskDescription: taskDetails.tdesc});
    res.redirect('/getalltasks');
});

//get all tasks
app.get('/getalltasks', function (req, res) {
    db.collection('tasks').find({}).toArray(function (err, data) {
        res.render('listalltasks', { taskDb: data });
    });
});

//delete task by ID
app.get('/deletetask', function(req,res){
    res.sendFile(__dirname + '/views/deleteTask.html');
});

app.post('/deletetask', function(req,res){
    let taskDetails = req.body;
    let filter = {taskID: parseInt(taskDetails.taskid)}; //to put the taskID as a integer
    db.collection('tasks').deleteOne(filter);
    res.redirect('/getalltasks');
});

//delete all completed tasks
app.get('/deletealltask', function(req,res){
    let filter = {taskStatus: 'Completed'};
    db.collection('tasks').deleteMany(filter);
    res.redirect('/getalltasks');
});

//update status
app.get('/updatetask', function(req,res){
    res.sendFile(__dirname + '/views/updateTask.html')
});

app.post('/updatetask', function(req,res){
    let taskDetails = req.body;
    let filter = {taskID: parseInt(taskDetails.taskid)};
    let theUpdate = {$set: {taskStatus: taskDetails.newstat}};
    db.collection('tasks').updateOne(filter, theUpdate);
    res.redirect('/getalltasks');
});