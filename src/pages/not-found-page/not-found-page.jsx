import { Link } from 'react-router-dom';
import notFoundIllustration from './404.svg';

const NotFoundPage = () => (
  <section className="text-center">
    <img alt="Страница не найдена" className="notFoundPage" src={notFoundIllustration} />

    <h1 className="h4 text-muted">Страница не найдена</h1>
    <p className="text-muted">
      Но вы можете перейти <Link to="/">На главную</Link>
    </p>
  </section>
);

export default NotFoundPage;
