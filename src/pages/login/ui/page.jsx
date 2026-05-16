import { Link } from 'react-router-dom';
import { LoginForm } from '@/features/auth-by-username';
import appRoutes from '@/shared/config/routes';
import { AuthLayout } from '@/widgets/auth-layout';
import image from '../assets/login-image.jpg';

const LoginPage = () => (
  <AuthLayout
    imageSrc={image}
    imageAlt="Войти"
    footer={(
      <>
        <span>Нет аккаунта? </span>
        <Link to={appRoutes.signup}>Регистрация</Link>
      </>
    )}
  >
    <LoginForm />
  </AuthLayout>
);

export default LoginPage;
