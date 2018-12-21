import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

// initialize array of products
  state = {
    products: [],
    productToAdd: {
      name: 'sample',
      price: 20
    },
    productIdToRemove: 0
  }

// call fetch method after app loads
  componentDidMount() {
    this.getProducts()
  }

// fetch list of products from database (at localhost:4000)
  getProducts = _ => {
    fetch('http://productdb-env.us-east-2.elasticbeanstalk.com/products')
    //fetch('http://localhost:4000/products')
      // convert response to json
      .then(response => response.json())

      // change the state to update with getProducts
      .then(response => this.setState({ products: response.data }))

      //catch any errors
      .catch(err => console.error(err))
  }

  addProduct = _ => {
    const {productToAdd} = this.state;
    fetch(`http://productdb-env.us-east-2.elasticbeanstalk.com/products/add?name=${productToAdd.name}&price=${productToAdd.price}`)
    //fetch(`http://localhost:4000/products/add?name=${productToAdd.name}&price=${productToAdd.price}`)
      .then(this.getProducts)
      .catch(err => console.error(err))
  }

  deleteClicked = (e) => {
    const id = e.target.id
    console.log('Incoming id ' + id)
    this.setState({ productIdToRemove: id})
    //this.deleteProduct()
    fetch(`http://productdb-env.us-east-2.elasticbeanstalk.com/products/remove?product_id=${id}`)
    //fetch(`http://localhost:4000/products/remove?product_id=${id}`)
      .then(this.getProducts)
      .catch(err => console.error(err))
  }

// create html element for each product
  renderProduct = ({product_id, name, price}) =>
    <tr key={product_id}><td>{name}</td><td>${price}.00</td>
    <td><button id={product_id} onClick={this.deleteClicked}>X</button></td></tr>

// render the list of products
  render() {
    const { products, productToAdd } = this.state;
    return (
      <div className="App">
        <table align='center' border="1" cellPadding="20px">
          <thead>
            <tr>
              <th> Name of Product </th>
              <th> Price </th>
              <th> Delete </th>
            </tr>
          </thead>
          <tbody>
            {products.map(this.renderProduct)}
          </tbody>
        </table>

        <div>
          <input
            value = {productToAdd.name}
            onChange={e => this.setState({productToAdd: { ...productToAdd, name: e.target.value}})}
          />
          <input
            value = {productToAdd.price}
            onChange={e => this.setState({productToAdd: { ...productToAdd, price: e.target.value}})}
          />
          <button onClick={this.addProduct}>Add product</button>
        </div>
      </div>
    );
  }
}

export default App;
