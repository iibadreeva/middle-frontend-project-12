import { Link } from 'react-router-dom';
import { SignupForm } from '@/features/sign-up-by-username';
import appRoutes from '@/shared/config/routes';
import { AuthLayout } from '@/widgets/auth-layout';
import image from '../assets/avatar_sighup.jpg';

const SignupPage = () => (
  <AuthLayout
    imageSrc={image}
    imageAlt="Регистрация"
    footer={(
      <>
        <span>Уже есть аккаунт? </span>
        <Link to={appRoutes.login}>Войти</Link>
      </>
    )}
  >
    <SignupForm />
  </AuthLayout>
);

export default SignupPage;
