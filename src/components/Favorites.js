import React, { useEffect, useState } from 'react';
import '../components/styles/Favorites.css';
import { useNavigate } from 'react-router-dom';

const Favorites = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3001/products')
      .then(response => response.json())
      .then(data => {
        const favoriteProducts = data.filter(product => getFavorites().includes(product.id));
        setProducts(favoriteProducts);
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
    setProducts(updatedFavorites.map(favId => products.find(product => product.id === favId)));
  };

  const getFavorites = () => {
    return JSON.parse(localStorage.getItem('favorites')) || [];
  };

  const goToProductInfo = (id) => {
    navigate(`/productinfo/${id}`);
  };

  return (
    <div>
      <h1>Избранное</h1>
      <div className="products-container">
        {products.length === 0 ? (
          <p>Избранное пусто.</p>
        ) : (
          products.map(product => (
            <div key={product.id} className="product-card">
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
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Favorites;
