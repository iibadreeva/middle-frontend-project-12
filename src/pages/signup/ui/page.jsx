import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SignupForm } from '@/features/sign-up-by-username'
import appRoutes from '@/shared/config/routes'
import { AuthLayout } from '@/widgets/auth-layout'
import image from '../assets/avatar_sighup.jpg'

const SignupPage = () => {
  const { t } = useTranslation()

  return (
    <AuthLayout
      imageSrc={image}
      imageAlt={t('auth.signupImageAlt')}
      footer={(
        <>
          <span>{`${t('auth.hasAccount')} `}</span>
          <Link to={appRoutes.login}>{t('auth.loginLink')}</Link>
        </>
      )}
    >
      <SignupForm />
    </AuthLayout>
  )
}

export default SignupPage
