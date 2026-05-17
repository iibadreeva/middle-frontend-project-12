import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import {
  selectChannels,
  selectCurrentChannel,
  selectCurrentChannelId,
  selectCurrentMessages,
  selectFetchStatus,
  selectHasUnauthorizedChatError,
  selectLoadError,
  useChatBootstrap,
  useChatSocket,
} from '@/entities/chat'
import { selectIsAuthenticated } from '@/entities/session'
import { useLogout } from '@/features/logout'

const useChat = () => {
  const logout = useLogout()
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const channels = useSelector(selectChannels)
  const currentChannel = useSelector(selectCurrentChannel)
  const currentChannelId = useSelector(selectCurrentChannelId)
  const currentMessages = useSelector(selectCurrentMessages)
  const fetchStatus = useSelector(selectFetchStatus)
  const hasUnauthorizedChatError = useSelector(selectHasUnauthorizedChatError)
  const loadError = useSelector(selectLoadError)

  useChatBootstrap({ isAuthenticated, fetchStatus })
  useChatSocket({ isAuthenticated, fetchStatus })

  useEffect(() => {
    if (hasUnauthorizedChatError) {
      logout()
    }
  }, [hasUnauthorizedChatError, logout])

  return {
    channels,
    currentChannel,
    currentChannelId,
    currentMessages,
    fetchStatus,
    loadError,
  }
}

export default useChat
