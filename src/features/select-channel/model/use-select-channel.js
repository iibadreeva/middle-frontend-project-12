import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { setCurrentChannel } from '@/entities/chat'

const useSelectChannel = () => {
  const dispatch = useDispatch()

  return useCallback(
    channelId => {
      dispatch(setCurrentChannel(channelId))
    },
    [dispatch],
  )
}

export default useSelectChannel
