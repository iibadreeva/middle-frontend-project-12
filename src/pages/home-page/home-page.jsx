import { Link } from 'react-router-dom';

const HomePage = () => (
  <section className="page">
    <h1>Главная</h1>
    <p>
      <Link to="/login">Перейти к форме входа</Link>
    </p>
  </section>
);

export default HomePage;
