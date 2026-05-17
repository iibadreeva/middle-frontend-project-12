import { ErrorBoundary, Provider as RollbarProvider } from '@rollbar/react'
import { isRollbarEnabled, rollbar } from '@/shared/lib/rollbar.js'
import RollbarErrorFallback from './rollbar-error-fallback.jsx'

const RollbarAppProvider = ({ children }) => {
  if (!isRollbarEnabled) {
    return children
  }

  return (
    <RollbarProvider instance={rollbar}>
      <ErrorBoundary fallbackUI={RollbarErrorFallback}>{children}</ErrorBoundary>
    </RollbarProvider>
  )
}

export default RollbarAppProvider
