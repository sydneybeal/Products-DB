const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const aws = require('aws-sdk');
const ejs = require('ejs');
var bodyParser = require('body-parser');

const app = express();

var port = process.env.PORT || 8081;


const connection = mysql.createConnection({
  /* // Local MySQL Setup
  host: 'localhost',
  user: 'root',
  password: 'nbuser',
  database: 'react_sql'
  */
  // AWS Setup
  host     : process.env.RDS_HOSTNAME,
  user     : process.env.RDS_USERNAME,
  password : process.env.RDS_PASSWORD,
  port     : process.env.RDS_PORT,
  database : process.env.RDS_DB_NAME
});



connection.connect(err => {
  /*
  if(err) {
    return err;
  }
  */
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }

  console.log('Connected to database.');

});



// create the necessary table if necessary using SQL
const createProductTable = `CREATE TABLE IF NOT EXISTS products(
                        product_id int(11) not null auto_increment,
                        name varchar(45) default null,
                        price int(11) default null,
                        PRIMARY KEY(product_id)
                    )`;

connection.query(createProductTable, (err, results) => {
  if (err) {
    console.log(err.message);
  }
});

// set all products query
const SELECT_ALL_PRODUCTS_QUERY = `SELECT * FROM products`;

app.use(cors());

app.get('/', (req,res) => {
  res.send(`Go to /products to see products`);
});

app.get('/products', (req,res) => {
  //res.json(products);
  connection.query(SELECT_ALL_PRODUCTS_QUERY, (err, results) => {
    if(err) {
      return res.send(err);
    } else {
      return res.json( {
        data: results
      });
    }
  });
});

app.get('/products/add', (req, res) => {
  const { name, price } = req.query;
  //console.log(name, price);
  const INSERT_PRODUCTS_QUERY = `INSERT INTO products (name, price)
    VALUES ('${name}', '${price}')`;
  connection.query(INSERT_PRODUCTS_QUERY, (err, results) => {
    if(err) {
      return res.send(err);
    } else {
      return res.send('Successfully added product');
    }
  })
});

app.get('/products/remove', (req, res) => {
  const { product_id, name, price } = req.query;
  //console.log(name, price);
  const DELETE_PRODUCTS_QUERY = `DELETE FROM products
    WHERE product_id=${product_id}`;
  connection.query(DELETE_PRODUCTS_QUERY, (err, results) => {
    if(err) {
      return res.send(err);
    } else {
      return res.send('Successfully deleted product');
    }
  })
});

app.listen(8081, () => {
  console.log(`Products server listening on port 8081`)
});
