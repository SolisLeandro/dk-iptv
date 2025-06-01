import { useState, useEffect } from 'react'
import * as ScreenOrientation from 'expo-screen-orientation'

export const useOrientation = () => {
    const [orientation, setOrientation] = useState('portrait')

    useEffect(() => {
        let subscription = null

        const setupOrientation = async () => {
            try {
                // Obtener orientación inicial
                const orientationInfo = await ScreenOrientation.getOrientationAsync()
                setOrientation(
                    orientationInfo === ScreenOrientation.Orientation.PORTRAIT_UP ||
                    orientationInfo === ScreenOrientation.Orientation.PORTRAIT_DOWN
                        ? 'portrait'
                        : 'landscape'
                )

                // Configurar listener
                subscription = ScreenOrientation.addOrientationChangeListener(
                    (event) => {
                        const { orientationInfo } = event
                        setOrientation(
                            orientationInfo.orientation === ScreenOrientation.Orientation.PORTRAIT_UP ||
                            orientationInfo.orientation === ScreenOrientation.Orientation.PORTRAIT_DOWN
                                ? 'portrait'
                                : 'landscape'
                        )
                    }
                )
            } catch (error) {
                console.warn('Error setting up orientation listener:', error)
                // Continuar con valor por defecto
                setOrientation('portrait')
            }
        }

        setupOrientation()

        return () => {
            if (subscription) {
                ScreenOrientation.removeOrientationChangeListener(subscription)
            }
        }
    }, [])

    const lockPortrait = async () => {
        try {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT)
        } catch (error) {
            console.warn('Error locking to portrait:', error)
        }
    }

    const lockLandscape = async () => {
        try {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE)
        } catch (error) {
            console.warn('Error locking to landscape:', error)
        }
    }

    const unlockOrientation = async () => {
        try {
            await ScreenOrientation.unlockAsync()
        } catch (error) {
            console.warn('Error unlocking orientation:', error)
        }
    }

    return {
        orientation,
        isPortrait: orientation === 'portrait',
        isLandscape: orientation === 'landscape',
        lockPortrait,
        lockLandscape,
        unlockOrientation,
    }
}