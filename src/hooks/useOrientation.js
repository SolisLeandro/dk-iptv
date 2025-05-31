import { useState, useEffect } from 'react'
import * as ScreenOrientation from 'expo-screen-orientation'

export const useOrientation = () => {
    const [orientation, setOrientation] = useState('portrait')

    useEffect(() => {
        const subscription = ScreenOrientation.addOrientationChangeListener(
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

        // Obtener orientación inicial
        ScreenOrientation.getOrientationAsync().then((orientationInfo) => {
            setOrientation(
                orientationInfo.orientation === ScreenOrientation.Orientation.PORTRAIT_UP ||
                    orientationInfo.orientation === ScreenOrientation.Orientation.PORTRAIT_DOWN
                    ? 'portrait'
                    : 'landscape'
            )
        })

        return () => {
            ScreenOrientation.removeOrientationChangeListener(subscription)
        }
    }, [])

    const lockPortrait = () => {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT)
    }

    const lockLandscape = () => {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE)
    }

    const unlockOrientation = () => {
        ScreenOrientation.unlockAsync()
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