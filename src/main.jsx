import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider as ReduxProvider } from 'react-redux'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-toastify/dist/ReactToastify.css'
import '@/app/providers/i18n/config/i18n.js'
import { AppRouter, store } from '@/app'
import RollbarAppProvider from '@/app/providers/rollbar/ui/rollbar-provider.jsx'
import '@/app/styles/index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RollbarAppProvider>
      <ReduxProvider store={store}>
        <AppRouter />
      </ReduxProvider>
    </RollbarAppProvider>
  </StrictMode>,
)
