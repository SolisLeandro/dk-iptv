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
import NetworkProvider from './src/contexts/NetworkContext'
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
                // Pre-load fonts
                await Font.loadAsync({
                    'Inter-Regular': require('./assets/fonts/Inter-Regular.otf'),
                    'Inter-Medium': require('./assets/fonts/Inter-Medium.otf'),
                    'Inter-SemiBold': require('./assets/fonts/Inter-SemiBold.otf'),
                    'Inter-Bold': require('./assets/fonts/Inter-Bold.otf'),
                })
                console.log("Se cargaron las fonts")
            } catch (e) {
                console.warn(e)
            } finally {
                setAppIsReady(true)
            }
        }

        prepare()
    }, [])

    const onLayoutRootView = React.useCallback(async () => {
        if (appIsReady) {
            await SplashScreen.hideAsync()
        }
    }, [appIsReady])

    if (!appIsReady) {
        return null
    }

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

