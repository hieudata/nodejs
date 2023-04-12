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
app.get('/edit/:id', (req, res) => {
   let id = req.params.id;

   connection.query('SELECT * FROM node WHERE id = ' + id, function(err, rows, fields) {
      if(err) throw err

      // if user not found
      if (rows.length <= 0) {
         res.redirect('/')
      }
      // if book found
      else {
         // render to edit.ejs
         res.render('edit', {
            title: 'Edit Blog',
            id: rows[0].id,
            name: rows[0].name,
            address: rows[0].address
         });
      }
   })
});

app.post('/update/:id',function(req,res){

   let id = req.params.id
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
app.get('/delete/:id', (req, res) => {

   let id = req.params.id;

   connection.query("delete from node where id=?", [id], function (err, rows, fields) {

      if (!!err) {
         console.log('Error', +err);
      } else {
         res.redirect('/')
      }

   });
});

// 404 page
app.use((req, res) => {
   res.status(404).render('404', { title: '404' });
});

