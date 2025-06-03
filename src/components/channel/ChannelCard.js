import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'

import { useTheme } from '../../hooks/useTheme'
import { useFavorites } from '../../hooks/useFavorites'
import { useFeatured } from '../../hooks/useFeatured'

export default function ChannelCard({
    channel,
    onPress,
    style,
}) {
    const { colors } = useTheme()
    const { isFavorite } = useFavorites()
    const { isFeatured } = useFeatured()

    const isChannelFavorite = isFavorite(channel.id)
    const isChannelFeatured = isFeatured(channel.id)

    const getCountryFlag = (countryCode) => {
        const flagMap = {
            'US': '🇺🇸', 'CA': '🇨🇦', 'MX': '🇲🇽', 'GB': '🇬🇧',
            'DE': '🇩🇪', 'FR': '🇫🇷', 'ES': '🇪🇸', 'IT': '🇮🇹',
            'BR': '🇧🇷', 'AR': '🇦🇷', 'CN': '🇨🇳', 'JP': '🇯🇵',
            'IN': '🇮🇳', 'AU': '🇦🇺', 'RU': '🇷🇺', 'KR': '🇰🇷',
            'CL': '🇨🇱', 'CO': '🇨🇴', 'PE': '🇵🇪', 'VE': '🇻🇪',
            'EC': '🇪🇨', 'UY': '🇺🇾', 'PY': '🇵🇾', 'BO': '🇧🇴',
            'CR': '🇨🇷', 'PA': '🇵🇦', 'GT': '🇬🇹', 'HN': '🇭🇳',
            'SV': '🇸🇻', 'NI': '🇳🇮', 'DO': '🇩🇴', 'CU': '🇨🇺',
            'PR': '🇵🇷',
        }
        return flagMap[countryCode] || '🌍'
    }

    const formatCategories = (categories) => {
        if (!categories || categories.length === 0) return 'General'
        return categories
            .slice(0, 2)
            .map(cat => cat.charAt(0).toUpperCase() + cat.slice(1))
            .join(', ')
    }

    const getBestQuality = () => {
        if (!channel.availableQualities || channel.availableQualities.length === 0) {
            return null
        }
        
        const qualityOrder = ['1080p', '720p', '480p', '360p', '240p']
        for (const quality of qualityOrder) {
            if (channel.availableQualities.includes(quality)) {
                return quality
            }
        }
        return channel.availableQualities[0]
    }

    const bestQuality = getBestQuality()

    // Valores por defecto si no hay datos de streams
    const streamCount = channel.streamCount || 0
    const hasHDStreams = channel.hasHDStreams || false

    return (
        <TouchableOpacity
            style={[styles.container, { backgroundColor: colors.surface }, style]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            {/* Logo */}
            <View style={styles.logoContainer}>
                <View style={[styles.logoPlaceholder, { backgroundColor: colors.border }]}>
                    {channel.logo ? (
                        <Image
                            source={{ uri: channel.logo }}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    ) : (
                        <Ionicons name="tv" size={24} color={colors.textMuted} />
                    )}
                </View>

                {/* Stream Quality Badge - Solo si hay datos */}
                {bestQuality && (
                    <View style={[styles.qualityBadge, { 
                        backgroundColor: hasHDStreams ? '#4CAF50' : '#FF9800' 
                    }]}>
                        <Text style={styles.qualityText}>{bestQuality}</Text>
                    </View>
                )}

                {/* Status Icons */}
                <View style={styles.statusIcons}>
                    {isChannelFeatured && (
                        <View style={[styles.statusIcon, { backgroundColor: '#FF6B35' }]}>
                            <Ionicons name="flame" size={12} color="#FFFFFF" />
                        </View>
                    )}
                    {isChannelFavorite && (
                        <View style={[styles.statusIcon, { backgroundColor: '#FF1744' }]}>
                            <Ionicons name="heart" size={12} color="#FFFFFF" />
                        </View>
                    )}
                </View>
            </View>

            {/* Content */}
            <View style={styles.content}>
                <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>
                    {channel.name}
                </Text>

                <View style={styles.metadata}>
                    <Text style={[styles.country, { color: colors.textSecondary }]}>
                        {getCountryFlag(channel.country)} {channel.country}
                    </Text>
                    <Text style={[styles.category, { color: colors.textSecondary }]}>
                        {formatCategories(channel.categories)}
                    </Text>
                </View>

                {/* Stream Info - Solo mostrar si hay datos */}
                <View style={styles.streamInfo}>
                    <View style={styles.streamIndicator}>
                        <Ionicons name="radio" size={12} color={colors.primary} />
                        <Text style={[styles.streamText, { color: colors.primary }]}>
                            {streamCount} stream{streamCount !== 1 ? 's' : ''}
                        </Text>
                    </View>
                    
                    {hasHDStreams && (
                        <View style={styles.hdIndicator}>
                            <Ionicons name="tv" size={12} color={colors.success} />
                            <Text style={[styles.hdText, { color: colors.success }]}>HD</Text>
                        </View>
                    )}
                </View>

                {/* Network */}
                {channel.network && (
                    <Text style={[styles.network, { color: colors.textMuted }]} numberOfLines={1}>
                        {channel.network}
                    </Text>
                )}
            </View>

            {/* Gradient Overlay */}
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.1)']}
                style={styles.gradient}
                pointerEvents="none"
            />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    logoContainer: {
        height: 120,
        position: 'relative',
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: '100%',
        height: '100%',
    },
    logoPlaceholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15
    },
    qualityBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    qualityText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '700',
    },
    statusIcons: {
        position: 'absolute',
        top: 8,
        right: 8,
        flexDirection: 'row',
        gap: 4,
    },
    statusIcon: {
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        padding: 12,
    },
    name: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 6,
        lineHeight: 18,
    },
    metadata: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    country: {
        fontSize: 12,
        fontWeight: '500',
    },
    category: {
        fontSize: 12,
        fontWeight: '400',
    },
    streamInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    streamIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    streamText: {
        fontSize: 11,
        fontWeight: '500',
    },
    hdIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    hdText: {
        fontSize: 11,
        fontWeight: '600',
    },
    network: {
        fontSize: 11,
        fontStyle: 'italic',
    },
    gradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 40,
    },
})