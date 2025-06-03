import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import Toast from 'react-native-toast-message'
import * as SplashScreen from 'expo-splash-screen'
import * as Font from 'expo-font'

import { store, persistor } from './src/store'
import AppNavigator from './src/navigation/AppNavigator'
import { ThemeProvider } from './src/contexts/ThemeContext'
import ErrorBoundary from './src/components/common/ErrorBoundary'
import LoadingSpinner from './src/components/common/LoadingSpinner'
import InitialLoadingModal from './src/components/common/InitialLoadingModal'
import { useInitialLoad } from './src/hooks/useInitialLoad'

if (!__DEV__) {
  console.log = () => {}
  console.warn = () => {}
  console.error = () => {}
  console.info = () => {}
  console.debug = () => {}
}

// Keep splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync()

// Componente principal de la app que maneja la carga inicial
function AppContent() {
    const { isLoading, progress, error, retryLoad } = useInitialLoad()
    const [showInitialLoading, setShowInitialLoading] = useState(true)
    const [allowDataLoad, setAllowDataLoad] = useState(false) // NUEVO: controlar cuándo empezar a cargar datos

    // NUEVO: Delay para permitir que las animaciones se completen
    useEffect(() => {
        const timer = setTimeout(() => {
            console.log('🎯 Permitiendo carga de datos después del delay de animación')
            setAllowDataLoad(true)
        }, 1500) // 1.5 segundos de delay para animaciones

        return () => clearTimeout(timer)
    }, [])

    const handleLoadingComplete = () => {
        setShowInitialLoading(false)
    }

    const handleRetry = () => {
        setShowInitialLoading(true)
        setAllowDataLoad(true) // Permitir carga inmediata en retry
        retryLoad()
    }

    return (
        <>
            <AppNavigator />
            <InitialLoadingModal
                visible={(isLoading && allowDataLoad) || showInitialLoading}
                progress={allowDataLoad ? progress : 0} // Solo mostrar progreso cuando se permite cargar
                error={allowDataLoad ? error : null} // Solo mostrar errores cuando se permite cargar
                onComplete={handleLoadingComplete}
                onRetry={handleRetry}
                allowDataLoad={allowDataLoad} // NUEVO: pasar esta prop al modal
            />
        </>
    )
}

export default function App() {
    const [appIsReady, setAppIsReady] = useState(false)

    useEffect(() => {
        async function prepare() {
            try {
                console.log('🚀 Iniciando preparación de la app...')

                // Pre-load fonts (solo si existen los archivos)
                try {
                    await Font.loadAsync({
                        'Inter-Regular': require('./assets/fonts/Inter-Regular.otf'),
                        'Inter-Medium': require('./assets/fonts/Inter-Medium.otf'),
                        'Inter-SemiBold': require('./assets/fonts/Inter-SemiBold.otf'),
                        'Inter-Bold': require('./assets/fonts/Inter-Bold.otf'),
                    })
                    console.log("✅ Fuentes cargadas correctamente")
                } catch (fontError) {
                    console.warn("⚠️ Error cargando fuentes (continuando sin ellas):", fontError.message)
                }

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
                        <ThemeProvider>
                            <AppContent />
                            <StatusBar style="auto" />
                            <Toast />
                        </ThemeProvider>
                    </PersistGate>
                </Provider>
            </ErrorBoundary>
        </GestureHandlerRootView>
    )
}