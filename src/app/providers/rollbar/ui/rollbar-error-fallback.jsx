import { Button, ButtonGroup } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import appRoutes from '@/shared/config/routes'

const RollbarErrorFallback = () => {
  const { t } = useTranslation()

  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center py-5">
      <div className="alert alert-danger mb-0 w-100 shadow-sm" role="alert" style={{ maxWidth: '640px' }}>
        <h2 className="h4 mb-2">{t('rollbar.fallbackTitle')}</h2>
        <p className="mb-3">{t('rollbar.fallbackDescription')}</p>
        <ButtonGroup>
          <Button variant="danger" onClick={() => window.location.reload()}>
            {t('rollbar.reloadPage')}
          </Button>
          <Button variant="outline-danger" onClick={() => window.location.assign(appRoutes.home)}>
            {t('rollbar.goHome')}
          </Button>
        </ButtonGroup>
      </div>
    </div>
  )
}

export default RollbarErrorFallback
