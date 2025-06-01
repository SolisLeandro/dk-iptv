import React, { createContext, useContext, useState, useEffect } from 'react'
import NetInfo from '@react-native-community/netinfo'
import Toast from 'react-native-toast-message'

const NetworkContext = createContext()

export const NetworkProvider = ({ children }) => {
    const [isConnected, setIsConnected] = useState(true)
    const [connectionType, setConnectionType] = useState('unknown')

    useEffect(() => {
        console.log('🌐 Inicializando NetworkProvider...')
        
        let unsubscribe = null

        // Configurar listener de red
        const setupNetInfo = async () => {
            try {
                // Obtener estado inicial
                const state = await NetInfo.fetch()
                console.log('📶 Estado inicial de red:', state)
                setIsConnected(state.isConnected)
                setConnectionType(state.type)

                // Configurar listener
                unsubscribe = NetInfo.addEventListener(state => {
                    console.log('📶 Cambio de estado de red:', state)
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
            } catch (error) {
                console.error('❌ Error configurando NetInfo:', error)
                // Continuar con valores por defecto
                setIsConnected(true)
                setConnectionType('unknown')
            }
        }

        setupNetInfo()

        return () => {
            if (unsubscribe) {
                unsubscribe()
            }
        }
    }, [])

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

export default NetworkProvider