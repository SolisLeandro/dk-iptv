import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import Toast from 'react-native-toast-message'
import * as SplashScreen from 'expo-splash-screen'
import * as Font from 'expo-font'

import { store, persistor } from './src/store'
import AppNavigator from './src/navigation/AppNavigator'
import { ThemeProvider } from './src/contexts/ThemeContext'
import ErrorBoundary from './src/components/common/ErrorBoundary'
import { NetworkProvider } from './src/contexts/NetworkContext'
import LoadingSpinner from './src/components/common/LoadingSpinner'

// Keep splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync()

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            cacheTime: 10 * 60 * 1000, // 10 minutes
            retry: 3,
            retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
        },
        mutations: {
            retry: 2,
        },
    },
})

export default function App() {
    const [appIsReady, setAppIsReady] = useState(false)

    useEffect(() => {
        async function prepare() {
            try {
                console.log('🚀 Iniciando preparación de la app...')
                
                // Pre-load fonts (solo si existen los archivos)
                try {
                    await Font.loadAsync({
                        'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf'),
                        'Inter-Medium': require('./assets/fonts/Inter-Medium.ttf'),
                        'Inter-SemiBold': require('./assets/fonts/Inter-SemiBold.ttf'),
                        'Inter-Bold': require('./assets/fonts/Inter-Bold.ttf'),
                    })
                    console.log("✅ Fuentes cargadas correctamente")
                } catch (fontError) {
                    console.warn("⚠️ Error cargando fuentes (continuando sin ellas):", fontError.message)
                }
                
                // Delay artificial para ver que funciona
                await new Promise(resolve => setTimeout(resolve, 1000))
                
                console.log("✅ App preparada correctamente")
            } catch (e) {
                console.error('❌ Error preparando la app:', e)
            } finally {
                setAppIsReady(true)
            }
        }

        prepare()
    }, [])

    const onLayoutRootView = React.useCallback(async () => {
        if (appIsReady) {
            console.log("🎉 Ocultando splash screen...")
            await SplashScreen.hideAsync()
        }
    }, [appIsReady])

    if (!appIsReady) {
        console.log("⏳ App aún no está lista...")
        return null
    }

    console.log("🚀 Renderizando app principal...")

    return (
        <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
            <ErrorBoundary>
                <Provider store={store}>
                    <PersistGate
                        loading={<LoadingSpinner message="Iniciando aplicación..." />}
                        persistor={persistor}
                    >
                        <QueryClientProvider client={queryClient}>
                            <ThemeProvider>
                                <NetworkProvider>
                                    <AppNavigator />
                                    <StatusBar style="auto" />
                                    <Toast />
                                </NetworkProvider>
                            </ThemeProvider>
                        </QueryClientProvider>
                    </PersistGate>
                </Provider>
            </ErrorBoundary>
        </GestureHandlerRootView>
    )
}