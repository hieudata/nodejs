const mysql = require('mysql');
const config = require('./config.js');
const express = require('express');
const bodyParser = require('body-parser');

let connection = mysql.createConnection(config);

// express app
const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

// listen for requests
app.listen(3000);

// register view engine
app.set('view engine', 'ejs');
// app.set('views', 'myviews');
// connection.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
// });

let stmt = `INSERT INTO node_ejs(name,address)  VALUES ?  `;
let todos = [
   ['Insert multiple rows at a time', false],
   ['It should work perfectly', true]
];

// execute the insert statment
// let sql = `SELECT * FROM node`;
// connection.query(sql, (error, results, fields) => {
//    if (error) {
//       return console.error(error.message);
//    }
//    console.log(results);
// });

// connection.end();

app.get('/', (req, res) => {
   let sql = `SELECT * FROM node`;
   connection.query(sql, (error, results, fields) => {
      if (error) {
         return console.error(error.message);
      }
      let blogs = Object.values(JSON.parse(JSON.stringify(results)));
      res.render('index', { title: 'Home', blogs });
   });
});

app.get('/about', (req, res) => {
   res.render('about', { title: 'About' });
});

// Create
app.get('/create', (req, res) => {
   res.render('create', { title: 'Create a new blog' });
});

app.post('/save',function(req,res){

   let name = req.body.name;
   let address = req.body.address;
   connection.query("insert into node(name,address) values(?,?) ",[name,address],function(err,rows,fields){
      if(!!err)
      {
         console.log("error", +err);
      }
      else
      {
         res.redirect('/')
      }
   });
})

// Update
app.get('/update', (req, res) => {
   res.render('update', { title: 'Update a new blog' });
});

app.post('/:id',function(req,res){

   let id = req.query.id
   let name = req.body.name;
   let address = req.body.address;
   connection.query("UPDATE node SET name = ?, address = ?  WHERE id = ?",[name,address,id],function(err,rows,fields){
      if(!!err)
      {
         console.log("error", +err);
      }
      else
      {
         res.redirect('/')
      }
   });
})

// Delete
app.get('/delete', (req, res) => {

   let id = req.query.id;

   connection.query("delete from node where id=?", [id], function (err, rows, fields) {

      if (!!err) {
         console.log('Error', +err);
      } else {
         res.status(404).render('404', { title: '404' });
      }

   });
});

// 404 page
app.use((req, res) => {
   res.status(404).render('404', { title: '404' });
});

