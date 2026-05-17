import axios from 'axios'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { saveSession, setCredentials } from '@/entities/session'
import appRoutes from '@/shared/config/routes'
import { logRollbarError } from '@/shared/lib/rollbar.js'

const useSignup = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const signup = async ({ username, password }) => {
    try {
      const response = await axios.post('/api/v1/signup', { username, password })
      const credentials = {
        token: response.data.token,
        username: response.data.username,
      }

      saveSession(credentials)
      dispatch(setCredentials(credentials))
      navigate(appRoutes.home, { replace: true })
    }
    catch (error) {
      if (axios.isAxiosError(error) && error.response && error.response.status === 409) {
        throw new Error(t('errors.signupUserExists'))
      }

      logRollbarError({
        message: 'Signup request failed',
        error,
        extra: {
          feature: 'auth',
          operation: 'signup',
          username,
        },
      })
      throw new Error(t('errors.signupFailed'))
    }
  }

  return signup
}

export default useSignup
