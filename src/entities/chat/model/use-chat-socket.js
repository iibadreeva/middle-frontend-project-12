import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { logRollbarError, logRollbarWarning } from '@/shared/lib/rollbar.js'
import { connectChatSocket, disconnectChatSocket } from '../api/chat-socket.js'
import {
  channelAdded,
  channelRemoved,
  channelRenamed,
  messageReceived,
  refetchChatData,
  socketConnected,
  socketDisconnected,
  socketConnecting,
  socketErrored,
} from './slice.js'

const useChatSocket = ({ isAuthenticated, fetchStatus }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    if (!isAuthenticated || fetchStatus !== 'succeeded') {
      return undefined
    }

    const socket = connectChatSocket()

    if (!socket.connected) {
      dispatch(socketConnecting())
    }

    const handleNewMessage = (message) => {
      dispatch(messageReceived(message))
    }
    const handleNewChannel = (channel) => {
      dispatch(channelAdded(channel))
    }
    const handleRemoveChannel = (channel) => {
      dispatch(channelRemoved(channel))
    }
    const handleRenameChannel = (channel) => {
      dispatch(channelRenamed(channel))
    }
    // Первое подключение: данные уже загружены fetchInitialChatData.
    const handleConnect = () => {
      dispatch(socketConnected())
    }
    // После обрыва сокет не шлёт историю — подтягиваем REST.
    const handleReconnect = () => {
      dispatch(socketConnected())
      dispatch(refetchChatData())
    }
    const handleConnecting = () => {
      dispatch(socketConnecting())
    }
    const handleDisconnect = (reason) => {
      // Явный disconnect при logout/unmount — не считаем ошибкой.
      if (reason !== 'io client disconnect') {
        logRollbarWarning({
          message: 'Chat socket disconnected unexpectedly',
          extra: {
            feature: 'chat',
            operation: 'socketDisconnect',
            reason,
          },
        })
      }

      dispatch(socketDisconnected())
    }
    const handleConnectError = (error) => {
      logRollbarError({
        message: 'Chat socket connection failed',
        error,
        extra: {
          feature: 'chat',
          operation: 'socketConnectError',
        },
      })
      dispatch(socketErrored())
    }

    socket.on('newMessage', handleNewMessage)
    socket.on('newChannel', handleNewChannel)
    socket.on('removeChannel', handleRemoveChannel)
    socket.on('renameChannel', handleRenameChannel)
    socket.on('connect', handleConnect)
    socket.on('reconnect', handleReconnect)
    socket.on('disconnect', handleDisconnect)
    socket.on('connect_error', handleConnectError)
    socket.on('reconnect_attempt', handleConnecting)
    // Неудачная попытка reconnect — ещё не финал, UI остаётся в «переподключаемся».
    socket.on('reconnect_error', handleConnecting)
    socket.on('reconnect_failed', handleConnectError)

    if (socket.connected) {
      dispatch(socketConnected())
    }

    return () => {
      socket.off('newMessage', handleNewMessage)
      socket.off('newChannel', handleNewChannel)
      socket.off('removeChannel', handleRemoveChannel)
      socket.off('renameChannel', handleRenameChannel)
      socket.off('connect', handleConnect)
      socket.off('reconnect', handleReconnect)
      socket.off('disconnect', handleDisconnect)
      socket.off('connect_error', handleConnectError)
      socket.off('reconnect_attempt', handleConnecting)
      socket.off('reconnect_error', handleConnecting)
      socket.off('reconnect_failed', handleConnectError)
      disconnectChatSocket()
    }
  }, [dispatch, fetchStatus, isAuthenticated])
}

export default useChatSocket
