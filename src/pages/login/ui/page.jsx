import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LoginForm } from '@/features/auth-by-username'
import appRoutes from '@/shared/config/routes'
import { AuthLayout } from '@/widgets/auth-layout'
import image from '../assets/login-image.jpg'

const LoginPage = () => {
  const { t } = useTranslation()

  return (
    <AuthLayout
      imageSrc={image}
      imageAlt={t('auth.loginImageAlt')}
      footer={(
        <>
          <span>{`${t('auth.noAccount')} `}</span>
          <Link to={appRoutes.signup}>{t('auth.signupLink')}</Link>
        </>
      )}
    >
      <LoginForm />
    </AuthLayout>
  )
}

export default LoginPage
