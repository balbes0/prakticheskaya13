import React, { useEffect, useState } from 'react';
import '../components/styles/Cart.css';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3001/products')
      .then(response => response.json())
      .then(data => {
        const cartProducts = data.filter(product => getCart().includes(product.id));
        setProducts(cartProducts);
      })
      .catch(error => console.error('Error fetching products:', error));

    setCart(JSON.parse(localStorage.getItem('cart')) || []);
  }, []);

  const removeFromCart = (id) => {
    let updatedCart = cart.filter(item => item !== id);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setProducts(updatedCart.map(cartId => products.find(product => product.id === cartId)));
  };

  const getCart = () => {
    return JSON.parse(localStorage.getItem('cart')) || [];
  };

  const updateTotal = () => {
    return cart.reduce((sum, id) => {
      let product = products.find(p => p.id === id);
      return sum + (product ? product.price : 0);
    }, 0);
  };

  const placeOrder = () => {
    if (cart.length === 0) {
      alert('Ваша корзина пуста!');
      return;
    }
    else{
      navigate('/order');
    }
  };

  const goToProductInfo = (id) => {
    navigate(`/productinfo/${id}`);
  };

  return (
    <div>
      <h1>Корзина товаров</h1>
      <div className="products-container">
        {products.length === 0 ? (
          <p>Корзина пуста.</p>
        ) : (
          products.map(product => (
            <div key={product.id} className="product-card">
              <img src={product.img} alt={product.name} />
              <h3 onClick={() => goToProductInfo(product.id)}>{product.name}</h3>
              <p>Тип мяса: {product.meat}</p>
              <p>Цена: {product.price} рублей</p>
              <button className="remove-from-cart-button" onClick={() => removeFromCart(product.id)}>Убрать из корзины</button>
            </div>
          ))
        )}
      </div>
      <div className="total-price">
        Общая сумма: {updateTotal()} рублей
      </div>
      <button className="place-order" onClick={placeOrder}>Совершить заказ</button>
    </div>
  );
};

export default Cart;
