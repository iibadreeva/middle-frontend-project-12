import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectSession } from '@/entities/session'
import { configureRollbarPerson } from '@/shared/lib/rollbar.js'

const RollbarSessionSync = () => {
  const session = useSelector(selectSession)

  useEffect(() => {
    configureRollbarPerson(session)
  }, [session])

  return null
}

export default RollbarSessionSync
