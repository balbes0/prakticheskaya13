import React, { useEffect, useState } from 'react';
import '../components/ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/products')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  return (
    <div className="products-container">
      {products.map(product => (
        <div key={product.id} className="product-card">
          <img src={product.img} alt={product.name} />
          <h3>{product.name}</h3>
          <p>Тип мяса: {product.meat}</p>
          <p>Цена: {product.price} рублей</p>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
