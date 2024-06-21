import React, { useEffect, useState } from 'react';
import '../components/Order.css';
import { useNavigate } from 'react-router-dom';

const Order = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3001/products')
      .then(response => response.json())
      .then(data => {
        const cartProducts = data.filter(product => getCart().includes(product.id));
        setProducts(cartProducts);
        setTotal(cartProducts.reduce((sum, product) => sum + product.price, 0));
      })
      .catch(error => console.error('Error fetching products:', error));

    setCart(JSON.parse(localStorage.getItem('cart')) || []);
  }, []);

  const getCart = () => {
    return JSON.parse(localStorage.getItem('cart')) || [];
  };

  const placeOrder = (event) => {
    event.preventDefault();
    const fullname = event.target.fullname.value;
    const email = event.target.email.value;
    const address = event.target.address.value;

    if (!fullname || !email || !address) {
      alert('Пожалуйста, заполните все поля формы.');
      return;
    }

    // Здесь обычно происходит отправка заказа на сервер

    // Очищаем корзину после оформления заказа
    localStorage.removeItem('cart');
    alert('Ваш заказ успешно оформлен!');

    // Переход на главную страницу после оформления заказа
    navigate('/');
  };

  return (
    <div className="order-container">
      <h1>Оформление заказа</h1>
      <div className="order-card">
        <h2>Ваш заказ</h2>
        <div id="order-products" className="order-products">
          {products.length === 0 ? (
            <p>Корзина пуста.</p>
          ) : (
            products.map(product => (
              <div key={product.id} className="product-summary">
                <p>{product.name}</p>
                <p>Цена: {product.price} рублей</p>
              </div>
            ))
          )}
        </div>
        <div id="order-total" className="order-total">
          Общая сумма: {total} рублей
        </div>
      </div>
      <div className="order-form">
        <h2>Оформление заказа</h2>
        <form id="order-form" onSubmit={placeOrder}>
          <div className="form-group">
            <label htmlFor="fullname">ФИО</label>
            <input type="text" id="fullname" name="fullname" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Эл. почта</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className="form-group">
            <label htmlFor="address">Адрес проживания</label>
            <input id="address" name="address" rows="3" required></input>
          </div>
        </form>
      </div>
      <button type="submit" className="place-order-button">Заказать</button>
    </div>
  );
};

export default Order;
