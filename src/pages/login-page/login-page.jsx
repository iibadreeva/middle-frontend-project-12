import { Link } from 'react-router-dom';
import AuthLayout from '../../features/auth/auth-layout.jsx';
import image from './login-image.jpg';
import LoginForm from './login-form';

const LoginPage = () => (
  <AuthLayout
    imageSrc={image}
    imageAlt="Войти"
    footer={(
      <>
        <span>Нет аккаунта? </span>
        <Link to="/signup">Регистрация</Link>
      </>
    )}
  >
    <LoginForm />
  </AuthLayout>
);

export default LoginPage;
