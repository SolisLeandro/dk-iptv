import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Linking,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import Constants from 'expo-constants'

import { useTheme } from '../../hooks/useTheme'

export default function AboutScreen({ navigation }) {
    const { colors } = useTheme()

    const appInfo = {
        version: '1.0.0',
        buildNumber: '1',
        author: 'Tu Nombre',
        description: 'Aplicación para streaming de canales IPTV con una interfaz moderna y funcionalidades avanzadas.',
    }

    const links = [
        {
            title: 'Código Fuente',
            icon: 'logo-github',
            url: 'https://github.com/tu-usuario/iptv-app',
        },
        {
            title: 'Reportar Error',
            icon: 'bug',
            url: 'https://github.com/tu-usuario/iptv-app/issues',
        },
        {
            title: 'Política de Privacidad',
            icon: 'shield-checkmark',
            url: 'https://tu-sitio.com/privacy',
        },
        {
            title: 'Términos de Uso',
            icon: 'document-text',
            url: 'https://tu-sitio.com/terms',
        },
    ]

    const handleLinkPress = async (url) => {
        try {
            const supported = await Linking.canOpenURL(url)
            if (supported) {
                await Linking.openURL(url)
            }
        } catch (error) {
            console.error('Error opening link:', error)
        }
    }

    const InfoRow = ({ label, value }) => (
        <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{label}</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{value}</Text>
        </View>
    )

    const LinkItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.linkItem, { backgroundColor: colors.surface }]}
            onPress={() => handleLinkPress(item.url)}
        >
            <Ionicons name={item.icon} size={24} color={colors.primary} />
            <Text style={[styles.linkText, { color: colors.text }]}>{item.title}</Text>
            <Ionicons name="open-outline" size={20} color={colors.textMuted} />
        </TouchableOpacity>
    )

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
                    <Text style={styles.headerTitle}>ℹ️ Acerca de</Text>
                </View>
            </LinearGradient>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* App Logo */}
                <View style={styles.logoSection}>
                    <View style={[styles.logoContainer, { backgroundColor: colors.surface }]}>
                        <Text style={styles.logoText}>📺</Text>
                    </View>
                    <Text style={[styles.appName, { color: colors.text }]}>IPTV Stream Master</Text>
                    <Text style={[styles.appTagline, { color: colors.textSecondary }]}>
                        {appInfo.description}
                    </Text>
                </View>

                {/* App Information */}
                <View style={[styles.section, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Información de la App</Text>
                    <InfoRow label="Versión" value={appInfo.version} />
                    <InfoRow label="Build" value={appInfo.buildNumber} />
                    <InfoRow label="Desarrollador" value={appInfo.author} />
                    <InfoRow label="Plataforma" value={Constants.platform?.ios ? 'iOS' : 'Android'} />
                </View>

                {/* Features */}
                <View style={[styles.section, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Características</Text>
                    <View style={styles.featuresList}>
                        {[
                            '📺 Más de 10,000 canales IPTV',
                            '🎨 Tema claro y oscuro',
                            '❤️ Sistema de favoritos',
                            '🔍 Búsqueda avanzada',
                            '📱 Diseño responsive',
                            '🎥 Reproductor integrado',
                        ].map((feature, index) => (
                            <Text key={index} style={[styles.featureItem, { color: colors.textSecondary }]}>
                                {feature}
                            </Text>
                        ))}
                    </View>
                </View>

                {/* Links */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Enlaces</Text>
                    {links.map((link, index) => (
                        <LinkItem key={index} item={link} />
                    ))}
                </View>

                {/* Credits */}
                <View style={[styles.section, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Agradecimientos</Text>
                    <Text style={[styles.creditsText, { color: colors.textSecondary }]}>
                        Datos de canales proporcionados por IPTV-org.
                        {'\n\n'}
                        Iconos por Ionicons.
                        {'\n\n'}
                        Desarrollado con React Native y Expo.
                    </Text>
                </View>

                {/* Copyright */}
                <View style={styles.footer}>
                    <Text style={[styles.copyright, { color: colors.textMuted }]}>
                        © 2024 IPTV Stream Master. Todos los derechos reservados.
                    </Text>
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
        paddingHorizontal: 20,
    },
    backButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    logoSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    logoText: {
        fontSize: 40,
    },
    appName: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 8,
        textAlign: 'center',
    },
    appTagline: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
    },
    section: {
        marginBottom: 24,
        padding: 16,
        borderRadius: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    infoLabel: {
        fontSize: 14,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '500',
    },
    featuresList: {
        gap: 8,
    },
    featureItem: {
        fontSize: 14,
        lineHeight: 20,
    },
    linkItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
    },
    linkText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 12,
    },
    creditsText: {
        fontSize: 14,
        lineHeight: 20,
    },
    footer: {
        alignItems: 'center',
        marginTop: 32,
        marginBottom: 32,
    },
    copyright: {
        fontSize: 12,
        textAlign: 'center',
    },
})