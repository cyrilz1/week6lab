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
let col1 = null;
let col2 = null;
//Connect to mongoDB server
MongoClient.connect(url, { useNewUrlParser: true },
    function (err, client) {
        if (err) {
            console.log("Err  ", err);
        } else {
            console.log("Connected successfully to server");
            db = client.db('carDb');
            col1= db.createCollection('car');
            col2 = db.createCollection('car')
        }

    });

app.get('/',(req,res)=>{
    console.log('Homepage Request')
});