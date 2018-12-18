const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();

const SELECT_ALL_PRODUCTS_QUERY = 'SELECT * FROM products';

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'nbuser',
  database: 'react_sql'
});

connection.connect(err => {
  if(err) {
    return err;
  }
});

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

app.listen(4000, () => {
  console.log(`Products server listening on port 4000`)
});
