// ContactForm.js
import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import './styles/ContactForm.css';

const ContactForm = () => {
  const form = useRef();

  const sendFeedback = (event) => {
    event.preventDefault();
    const user_name = event.target.user_name.value;
    const message = event.target.message.value;

    if (!user_name || !message) {
      alert('Пожалуйста, заполните все поля формы.');
      return;
    }

    emailjs.sendForm('service_r56fufz', 'template_q3dkksz', form.current, '3nR5TcDhXkrpHfHFH')
      .then(
        (result) => {
          console.log('SUCCESS!', result.text);
          alert('Сообщение успешно отправлено!');
        },
        (error) => {
          console.log('FAILED...', error.text);
          alert('Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте снова.');
        },
      );
  };

  return (
    <div className="contact-form-container">
      <h2>Обратная связь</h2>
      <form ref={form} onSubmit={sendFeedback}>
        <div className="form-group">
          <label htmlFor="user_name">Ваше имя</label>
          <input type="text" id="user_name" name="user_name" required />
        </div>
        <div className="form-group">
          <label htmlFor="message">Сообщение</label>
          <input id="message" name="message" rows="4" required></input>
        </div>
        <button type="submit" className="send-feedback-button">Отправить</button>
      </form>
    </div>
  );
};

export default ContactForm;
