// Require Express - a web server for Node.js
let express = require('express');
let bodyParser = require('body-parser');

// Require the mysql module that let's us
// speak with a mysql server
let mysql = require('mysql');

// Create a new connection
// using correct credentials
let db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'mysql',
  database: 'sellaphone'
});

// Connect to the database
db.connect();

// Create a new web server
let app = express();
app.use(bodyParser.json({limit: '50mb'}));

// Serve files from the www folder
app.use(express.static('www'));

// Create a route that will respond with all
// data from the user table in MySQL as JSON
app.get('/api/orders', function (req, res) {
  // make the query to the database
  db.query('SELECT * FROM orders', function (error, results) {
    // Send the error if there exists an error
    // otherwise the results of the query to the browser as JSON
    res.json(error || results);
  });
});

let wantedFields = ['first_name', 'phone', 'contract', 'data', 'boomy_bass_box', 'cloudy_insurance', 'recognize_face', 'order-placed', 'price', 'last_name', 'phone_number', 'email', 'street', 'zip', 'city'];

// receive data
app.post('/api/orders', function (req, res) {
  // pick wanted fields
  for(let field in req.body){
    if(!wantedFields.includes(field)){
      delete(req.body[field]);
    }
  }
  // make the query to the database
  db.query('INSERT INTO orders SET ?', req.body, function (error, results) {
    if(error){
      res.json(error);
      return;
    }
    db.query('SELECT * FROM orders WHERE id = (SELECT LAST_INSERT_ID())', function (error, results) {
      res.json(error || results);
    });
  });
});



// Start the web server at a port
// so it can listen to traffic from a browser
app.listen(3000, function () {
  console.log('Sellaphone API running on port 3000');
});







