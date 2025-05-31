import React, { createContext, useContext, useState, useEffect } from 'react'
import NetInfo from '@react-native-netinfo/netinfo'
import Toast from 'react-native-toast-message'

const NetworkContext = createContext()

export const NetworkProvider = ({ children }) => {
    const [isConnected, setIsConnected] = useState(true)
    const [connectionType, setConnectionType] = useState('unknown')

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            const wasConnected = isConnected
            setIsConnected(state.isConnected)
            setConnectionType(state.type)

            // Mostrar toast cuando cambie el estado de conexión
            if (wasConnected && !state.isConnected) {
                Toast.show({
                    type: 'error',
                    text1: 'Sin conexión',
                    text2: 'Verifica tu conexión a internet',
                })
            } else if (!wasConnected && state.isConnected) {
                Toast.show({
                    type: 'success',
                    text1: 'Conectado',
                    text2: 'Conexión restaurada',
                })
            }
        })

        return () => unsubscribe()
    }, [isConnected])

    return (
        <NetworkContext.Provider
            value={{
                isConnected,
                connectionType,
                isWifi: connectionType === 'wifi',
                isCellular: connectionType === 'cellular',
            }}
        >
            {children}
        </NetworkContext.Provider>
    )
}

export const useNetworkStatus = () => {
    const context = useContext(NetworkContext)
    if (!context) {
        throw new Error('useNetworkStatus must be used within NetworkProvider')
    }
    return context
}

