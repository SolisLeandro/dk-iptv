import { useState, useEffect } from 'react'
import NetInfo from '@react-native-netinfo/netinfo'

export const useNetworkStatus = () => {
    const [isConnected, setIsConnected] = useState(true)
    const [connectionType, setConnectionType] = useState('unknown')

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected)
            setConnectionType(state.type)
        })

        return () => unsubscribe()
    }, [])

    return {
        isConnected,
        connectionType,
        isWifi: connectionType === 'wifi',
        isCellular: connectionType === 'cellular',
    }
}