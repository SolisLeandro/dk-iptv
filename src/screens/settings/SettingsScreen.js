import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Switch,
    Alert,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'

import { useTheme } from '../hooks/useTheme'
import ThemeSelector from '../components/settings/ThemeSelector'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const SettingsOption = ({ icon, title, subtitle, onPress, rightElement }) => {
    const { colors } = useTheme()

    return (
        <TouchableOpacity
            style={[styles.option, { backgroundColor: colors.card }]}
            onPress={onPress}
            activeOpacity={0.7}
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
    const { colors, isDark } = useTheme()

    const handleAbout = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        navigation.navigate('About')
    }

    const handleClearCache = () => {
        Alert.alert(
            'Limpiar Caché',
            '¿Estás seguro de que quieres limpiar la caché? Esto eliminará todos los datos temporales.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Limpiar',
                    style: 'destructive',
                    onPress: () => {
                        // Implementar limpieza de caché
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
                    }
                },
            ]
        )
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <LinearGradient
                colors={colors.gradient}
                style={styles.header}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.headerContent}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>⚙️ Configuración</Text>
                    <View style={styles.placeholder} />
                </View>
            </LinearGradient>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Sección de Apariencia */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        🎨 Apariencia
                    </Text>

                    <Card style={styles.card}>
                        <ThemeSelector />
                    </Card>
                </View>

                {/* Sección de Reproductor */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        🎥 Reproductor
                    </Text>

                    <SettingsOption
                        icon="videocam"
                        title="Calidad por defecto"
                        subtitle="Auto (recomendado)"
                        onPress={() => navigation.navigate('QualitySettings')}
                    />

                    <SettingsOption
                        icon="phone-portrait"
                        title="Orientación automática"
                        subtitle="Rotar automáticamente en pantalla completa"
                        rightElement={<Switch value={true} />}
                    />

                    <SettingsOption
                        icon="volume-high"
                        title="Control de volumen"
                        subtitle="Usar botones de volumen del dispositivo"
                        rightElement={<Switch value={true} />}
                    />
                </View>

                {/* Sección de Red */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        🌐 Red y Datos
                    </Text>

                    <SettingsOption
                        icon="wifi"
                        title="Reproducir solo en WiFi"
                        subtitle="Ahorrar datos móviles"
                        rightElement={<Switch value={false} />}
                    />

                    <SettingsOption
                        icon="refresh"
                        title="Actualización automática"
                        subtitle="Actualizar lista de canales diariamente"
                        rightElement={<Switch value={true} />}
                    />

                    <SettingsOption
                        icon="trash"
                        title="Limpiar caché"
                        subtitle="Liberar espacio de almacenamiento"
                        onPress={handleClearCache}
                    />
                </View>

                {/* Sección de Privacidad */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        🔒 Privacidad
                    </Text>

                    <SettingsOption
                        icon="analytics"
                        title="Análisis de uso"
                        subtitle="Ayudar a mejorar la aplicación"
                        rightElement={<Switch value={false} />}
                    />

                    <SettingsOption
                        icon="eye-off"
                        title="Modo privado"
                        subtitle="No guardar historial de reproducción"
                        rightElement={<Switch value={false} />}
                    />
                </View>

                {/* Sección de Información */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        ℹ️ Información
                    </Text>

                    <SettingsOption
                        icon="information-circle"
                        title="Acerca de"
                        subtitle="Versión 1.0.0"
                        onPress={handleAbout}
                    />

                    <SettingsOption
                        icon="help-circle"
                        title="Ayuda y soporte"
                        subtitle="Obtener ayuda"
                        onPress={() => navigation.navigate('Help')}
                    />

                    <SettingsOption
                        icon="document-text"
                        title="Términos y privacidad"
                        subtitle="Políticas de la aplicación"
                        onPress={() => navigation.navigate('Privacy')}
                    />
                </View>

                {/* Botón de Reset */}
                <View style={[styles.section, styles.lastSection]}>
                    <Button
                        title="🔄 Restablecer configuración"
                        variant="outline"
                        onPress={() => {
                            Alert.alert(
                                'Restablecer configuración',
                                '¿Estás seguro de que quieres restablecer toda la configuración a los valores por defecto?',
                                [
                                    { text: 'Cancelar', style: 'cancel' },
                                    {
                                        text: 'Restablecer',
                                        style: 'destructive',
                                        onPress: () => {
                                            // Implementar reset
                                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
                                        }
                                    },
                                ]
                            )
                        }}
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
        height: 120,
        paddingTop: 50,
        justifyContent: 'center',
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    backButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
        fontFamily: 'Inter-Bold',
    },
    placeholder: {
        width: 40,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    section: {
        marginBottom: 32,
    },
    lastSection: {
        marginBottom: 60,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
        fontFamily: 'Inter-SemiBold',
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
        fontFamily: 'Inter-Medium',
    },
    optionSubtitle: {
        fontSize: 14,
        marginTop: 2,
        fontFamily: 'Inter-Regular',
    },
})