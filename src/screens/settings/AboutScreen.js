import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Linking,
    Image,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import Constants from 'expo-constants'

import { useTheme } from '../../hooks/useTheme'

export default function AboutScreen({ navigation }) {
    const { colors } = useTheme()

    const appInfo = {
        appName: "DK iptv",
        version: Constants.expoConfig?.version || '1.0.0',
        buildNumber: '1',
        author: 'Leandro Solis',
    }

    const links = [
        {
            title: 'Código Fuente',
            icon: 'logo-github',
            url: 'https://github.com/SolisLeandro/dk-iptv',
        },
        {
            title: 'Reportar Error',
            icon: 'bug',
            url: 'https://github.com/SolisLeandro/dk-iptv/issues',
        },
        {
            title: 'Api IPTV',
            icon: 'tv',
            url: 'https://github.com/iptv-org/api',
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
                        <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>ℹ️ Acerca de</Text>
                </View>
            </LinearGradient>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* App Logo */}
                <View style={styles.logoSection}>
                    <View style={[styles.logoContainer, { backgroundColor: colors.surface }]}>
                        <View style={styles.logoContainer}>
                            <Image
                                source={require('../../../assets/images/DKiptvLogo.png')}
                                style={styles.logo}
                                resizeMode="contain"
                            />
                        </View>
                    </View>
                    <Text style={[styles.appName, { color: colors.text }]}>{appInfo.appName}</Text>
                </View>

                {/* App Information */}
                <View style={[styles.section, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Información de la App</Text>
                    <InfoRow label="Versión" value={appInfo.version} />
                    <InfoRow label="Desarrollador" value={appInfo.author} />
                    <InfoRow label="Plataforma" value={Constants.platform?.ios ? 'iOS' : 'Android'} />
                </View>

                {/* Links */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Enlaces</Text>
                    {links.map((link, index) => (
                        <LinkItem key={index} item={link} />
                    ))}
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 60
    },
    header: {
        minHeight: 100,
        paddingBottom: 16,
        justifyContent: 'center',
        justifyContent: 'flex-end',
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
        marginBottom: 15
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 100,
        padding: 5
    },
    logo: {
        width: 100,
        height: 100,
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
        marginBottom: 15,
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