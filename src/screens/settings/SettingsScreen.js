import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as Haptics from 'expo-haptics'
import { useState } from 'react'
import Toast from 'react-native-toast-message'

import { useTheme } from '../../hooks/useTheme'
import { useInitialLoad } from '../../hooks/useInitialLoad'
import ThemeSelector from '../../components/settings/ThemeSelector'
import Card from '../../components/ui/Card'
import Constants from 'expo-constants'

const SettingsOption = ({ icon, title, subtitle, onPress, rightElement, disabled = false }) => {
    const { colors } = useTheme()

    return (
        <TouchableOpacity
            style={[
                styles.option, 
                { 
                    backgroundColor: colors.surface,
                    opacity: disabled ? 0.6 : 1
                }
            ]}
            onPress={onPress}
            activeOpacity={0.7}
            disabled={disabled}
        >
            <View style={styles.optionLeft}>
                <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                    <Ionicons name={icon} size={24} color={colors.primary} />
                </View>
                <View style={styles.optionText}>
                    <Text style={[styles.optionTitle, { color: colors.text }]}>{title}</Text>
                    {subtitle && (
                        <Text style={[styles.optionSubtitle, { color: colors.textSecondary }]}>
                            {subtitle}
                        </Text>
                    )}
                </View>
            </View>
            {rightElement || (
                <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            )}
        </TouchableOpacity>
    )
}

export default function SettingsScreen({ navigation }) {
    const { colors } = useTheme()
    const insets = useSafeAreaInsets()
    const { forceReload } = useInitialLoad()
    const [isReloading, setIsReloading] = useState(false)

    const handleAbout = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        navigation.navigate('About')
    }

    const handleReloadData = () => {
        Alert.alert(
            'Recargar Datos',
            'Esto descargará los canales y filtros más recientes desde el servidor.\n\n¿Continuar?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel'
                },
                {
                    text: 'Recargar',
                    onPress: async () => {
                        try {
                            setIsReloading(true)
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
                            
                            Toast.show({
                                type: 'info',
                                text1: 'Recargando datos...',
                                text2: 'Descargando desde el servidor',
                                position: 'bottom',
                            })
                            
                            console.log('🔄 Usuario solicitó recargar datos')
                            await forceReload()
                            
                            Toast.show({
                                type: 'success',
                                text1: 'Datos actualizados',
                                text2: 'Canales y filtros recargados exitosamente',
                                position: 'bottom',
                            })
                        } catch (error) {
                            console.error('Error reloading data:', error)
                            Toast.show({
                                type: 'error',
                                text1: 'Error',
                                text2: 'No se pudo recargar los datos',
                                position: 'bottom',
                            })
                        } finally {
                            setIsReloading(false)
                        }
                    }
                }
            ]
        )
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <LinearGradient
                colors={colors.gradient}
                style={[styles.header, { paddingTop: insets.top }]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.headerContent}>
                    <View style={styles.headerTitleContainer}>
                        <Ionicons name="settings" size={24} color="#FFFFFF" style={styles.headerIcon} />
                        <Text style={styles.headerTitle}>Configuración</Text>
                    </View>
                </View>
            </LinearGradient>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Sección de Apariencia */}
                <View style={styles.section}>
                    <Card style={styles.card}>
                        <ThemeSelector />
                    </Card>
                </View>

                {/* Sección de Datos */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        Gestión de Datos
                    </Text>
                    
                    <SettingsOption
                        icon="refresh"
                        title="Recargar Datos"
                        subtitle="Descargar canales y filtros actualizados del servidor"
                        onPress={handleReloadData}
                        disabled={isReloading}
                        rightElement={
                            isReloading ? (
                                <Ionicons name="hourglass" size={20} color={colors.textMuted} />
                            ) : null
                        }
                    />
                </View>

                {/* Sección de Información */}
                <View style={[styles.section, styles.lastSection]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        Información
                    </Text>
                    
                    <SettingsOption
                        icon="information-circle"
                        title="Acerca de"
                        subtitle={"Versión: " + (Constants.expoConfig?.version || '1.0.0')}
                        onPress={handleAbout}
                    />
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        minHeight: 100,
        paddingHorizontal: 20,
        paddingBottom: 16,
        justifyContent: 'flex-end',
    },
    headerContent: {
        alignItems: 'center',
    },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerIcon: {
        marginRight: 8,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    section: {
        marginBottom: 32,
    },
    lastSection: {
        marginBottom: 100, // Espacio extra para el tab bar
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    card: {
        padding: 16,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    optionText: {
        flex: 1,
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: '500',
    },
    optionSubtitle: {
        fontSize: 14,
        marginTop: 2,
    },
})