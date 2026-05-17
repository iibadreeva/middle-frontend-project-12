import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import appRoutes from '@/shared/config/routes'
import notFoundIllustration from '../assets/404.svg'

const NotFoundPage = () => {
  const { t } = useTranslation()

  return (
    <section className="text-center">
      <img alt={t('notFound.alt')} className="notFoundPage" src={notFoundIllustration} />

      <h1 className="h4 text-muted">{t('notFound.title')}</h1>
      <p className="text-muted">
        {`${t('notFound.descriptionPrefix')} `}
        <Link to={appRoutes.home}>{t('notFound.homeLink')}</Link>
      </p>
    </section>
  )
}

export default NotFoundPage
