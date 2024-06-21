import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './styles/ProductInfo.css';

const ProductInfo = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/products')
      .then(response => response.json())
      .then(data => {
        const productData = data.find(product => product.id === id);
        setProduct(productData);
      })
      .catch(error => console.error('Error fetching product:', error));
  }, [id]);
  

  if (!product) {
    return <p>Продукт не найден</p>;
  }

  return (
    <div className="product-info-container">
      <h1>{product.name}</h1>
      <div className="product-details">
        <img src={product.img} alt={product.name} />
        <p>Тип мяса: {product.meat}</p>
        <p>Категория: {product.category}</p>
        <p>Цена: {product.price} рублей</p>
        <p>Вес: {product.weight}</p>
        <p>Описание: {product.description}</p>
      </div>
    </div>
  );
};

export default ProductInfo;
