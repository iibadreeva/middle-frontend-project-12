import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchInitialChatData } from './slice.js'

const useChatBootstrap = ({ isAuthenticated, fetchStatus }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    if (isAuthenticated && fetchStatus === 'idle') {
      dispatch(fetchInitialChatData())
    }
  }, [dispatch, fetchStatus, isAuthenticated])
}

export default useChatBootstrap
