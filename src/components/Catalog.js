import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './styles/Catalog.css';

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { handleSubmit, register } = useForm();
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3001/products')
      .then(response => response.json())
      .then(data => {
        setProducts(data);
        setFilteredProducts(data); // Начальное отображение всех продуктов
      })
      .catch(error => console.error('Error fetching products:', error));

    setCart(JSON.parse(localStorage.getItem('cart')) || []);
    setFavorites(JSON.parse(localStorage.getItem('favorites')) || []);
  }, []);

  const toggleCart = (id) => {
    let updatedCart = cart.includes(id) ? cart.filter(item => item !== id) : [...cart, id];
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const toggleFavorite = (id) => {
    let updatedFavorites = favorites.includes(id) ? favorites.filter(item => item !== id) : [...favorites, id];
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const goToProductInfo = (id) => {
    navigate(`/productinfo/${id}`);
  };

  const onSubmit = (data) => {
    // Фильтрация по названию продукта
    let filtered = products.filter(product => product.name.toLowerCase().includes(data.search.toLowerCase()));

    // Фильтрация по типу мяса
    if (data.meatType !== 'all') {
      filtered = filtered.filter(product => product.meat.toLowerCase() === data.meatType.toLowerCase());
    }

    // Фильтрация по категории
    if (data.category !== 'all') {
      filtered = filtered.filter(product => product.category.toLowerCase() === data.category.toLowerCase());
    }

    setFilteredProducts(filtered);
  };

  return (
    <div>
      <h1>Каталог товаров</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="text" placeholder="Поиск по названию" {...register('search')} />
        <select {...register('meatType')}>
          <option value="all">Все типы мяса</option>
          <option value="говядина">Говядина</option>
          <option value="свинина">Свинина</option>
          <option value="курица">Курица</option>
          {/* Добавьте другие типы мяса по мере необходимости */}
        </select>
        <select {...register('category')}>
          <option value="all">Все категории</option>
          <option value="а">Категория А</option>
          <option value="б">Категория Б</option>
          <option value="в">Категория В</option>
          {/* Добавьте другие категории по мере необходимости */}
        </select>
        <button type="submit">Применить фильтры</button>
      </form>

      <div className="products-container">
        {filteredProducts.map(product => (
          <motion.div
            key={product.id}
            className="product-card"
            whileHover={{ scale: 1.05, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}
            whileTap={{ scale: 0.95 }}
          >
            <img src={product.img} alt={product.name} />
            <h3 onClick={() => goToProductInfo(product.id)}>{product.name}</h3>
            <p>Тип мяса: {product.meat}</p>
            <p>Цена: {product.price} рублей</p>
            <div className="action-buttons">
              <button className={`action-button addToCart ${cart.includes(product.id) ? 'active' : ''}`} onClick={() => toggleCart(product.id)}>
                {cart.includes(product.id) ? 'Убрать из корзины' : 'Добавить в корзину'}
              </button>
              <button className={`action-button addToFavorites ${favorites.includes(product.id) ? 'active' : ''}`} onClick={() => toggleFavorite(product.id)}>
                {favorites.includes(product.id) ? 'Убрать из избранного' : 'Добавить в избранное'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Catalog;
