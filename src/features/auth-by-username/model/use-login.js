import axios from 'axios'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { saveSession, setCredentials } from '@/entities/session'
import appRoutes from '@/shared/config/routes'
import { logRollbarError } from '@/shared/lib/rollbar.js'

const useLogin = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()

  const login = async values => {
    try {
      const response = await axios.post('/api/v1/login', values)
      const credentials = {
        token: response.data.token,
        username: response.data.username,
      }

      saveSession(credentials)
      dispatch(setCredentials(credentials))

      const nextPath = location.state && location.state.from
        ? location.state.from.pathname
        : appRoutes.home

      navigate(nextPath, { replace: true })
    } catch (error) {
      if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
        throw new Error(t('errors.loginInvalidCredentials'))
      }

      logRollbarError({
        message: 'Login request failed',
        error,
        extra: {
          feature: 'auth',
          operation: 'login',
          username: values.username,
        },
      })
      throw new Error(t('errors.loginFailed'))
    }
  }

  return login
}

export default useLogin
