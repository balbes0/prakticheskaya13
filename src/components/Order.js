import React, { useEffect, useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { motion, AnimatePresence } from 'framer-motion';
import ReCAPTCHA from 'react-google-recaptcha';
import '../components/styles/Order.css';
import { useNavigate } from 'react-router-dom';

const Order = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [captchaValue, setCaptchaValue] = useState(null);
  const [isOrdering, setIsOrdering] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // State для успешного заказа
  const navigate = useNavigate();
  const form = useRef();

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

  const onCaptchaChange = (value) => {
    setCaptchaValue(value);
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

    if (!captchaValue) {
      alert('Пожалуйста, подтвердите, что вы не робот.');
      return;
    }

    // Запускаем анимацию перед отправкой заказа
    setIsOrdering(true);

    // Формируем сообщение для отправки по почте
    const orderDetails = products.map(product => `${product.name}: ${product.price} рублей`).join('\n');
    const message = `
      ФИО: ${fullname}
      Email: ${email}
      Адрес: ${address}
      Заказ:
      ${orderDetails}
      Общая сумма: ${total} рублей
    `;

    // Отправка письма с использованием EmailJS
    const templateParams = {
      user_name: fullname,
      user_email: email,
      message: message
    };

    emailjs.send('service_qmxyzod', 'template_ump07zs', templateParams, '3nR5TcDhXkrpHfHFH')
      .then(
        (result) => {
          console.log('SUCCESS!', result.text);
          setIsSuccess(true); // Показываем галочку при успешном заказе

          // По окончании отправки заказа завершаем анимацию
          setIsOrdering(false);

          // Очищаем корзину после оформления заказа
          localStorage.removeItem('cart');

          // Переход на главную страницу через 2 секунды после успешного заказа
          setTimeout(() => {
            navigate('/');
          }, 2000);
        },
        (error) => {
          console.log('FAILED...', error.text);
          alert('Произошла ошибка при отправке заказа. Пожалуйста, попробуйте снова.');

          // По окончании отправки заказа завершаем анимацию
          setIsOrdering(false);
        },
      );
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
        <form ref={form} id="order-form" onSubmit={placeOrder}>
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
            <input id="address" name="address" required />
          </div>
          <motion.button
            type="submit"
            className="place-order-button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {isOrdering ? 'Отправка...' : 'Заказать'}
          </motion.button>
        </form>
      </div>
      <ReCAPTCHA
        sitekey="6Ld6Z_4pAAAAAKV02nAru6Ztq-XYPBB8SD_-RaBx"
        onChange={onCaptchaChange}
      />
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            className="success-checkmark"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.5 }}
          >
            ✓
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Order;
