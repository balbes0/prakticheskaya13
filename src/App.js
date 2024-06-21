import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ProductList from './components/ProductList';
import Catalog from './components/Catalog';
import Favorites from './components/Favorites';
import Cart from './components/Cart';
import Order from './components/Order';
import ProductInfo from './components/ProductInfo';
import './App.css'; // Импортируем стили

function App() {
  return (
    <Router>
      <div className="App"> {/* Добавляем класс App */}
        <header>
          <nav>
            <Link to="/">Главная</Link>
            <Link to="/catalog">Каталог</Link>
            <Link to="/favorites">Избранное</Link>
            <Link to="/cart">Корзина</Link>
            <Link to="/order">Заказ</Link>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={
              <div>
                <h1>Добро пожаловать в Магазин пельменей!</h1>
                <p>Наш магазин предлагает широкий ассортимент пельменей на любой вкус. У нас вы найдете традиционные сибирские пельмени, домашние пельмени, а также эксклюзивные пельмени с разнообразными начинками: от мяса до грибов и овощей. Вся продукция изготовлена из натуральных ингредиентов, чтобы вы могли насладиться вкусом настоящих пельменей.</p>
                <ProductList />
              </div>
            } />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/order" element={<Order />} />
            <Route path="/productinfo/:id" element={<ProductInfo />} />
          </Routes>
        </main>
        <footer>
          <p>© 2024 Магазин пельменей. Все права защищены.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
