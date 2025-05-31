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

export default function ChannelCard({
    channel,
    onPress,
    onFavoritePress,
    style,
    showFavorite = true,
}) {
    const { colors } = useTheme()
    const { isFavorite, toggleFavorite } = useFavorites()
    const isChannelFavorite = isFavorite(channel.id)

    const handleFavoritePress = () => {
        toggleFavorite(channel)
        onFavoritePress?.(channel)
    }

    const getCountryFlag = (countryCode) => {
        // Mapeo básico de códigos de país a emojis de banderas
        const flagMap = {
            'US': '🇺🇸', 'CA': '🇨🇦', 'MX': '🇲🇽', 'GB': '🇬🇧',
            'DE': '🇩🇪', 'FR': '🇫🇷', 'ES': '🇪🇸', 'IT': '🇮🇹',
            'BR': '🇧🇷', 'AR': '🇦🇷', 'CN': '🇨🇳', 'JP': '🇯🇵',
            'IN': '🇮🇳', 'AU': '🇦🇺', 'RU': '🇷🇺', 'KR': '🇰🇷',
        }
        return flagMap[countryCode] || '🌍'
    }

    const formatCategories = (categories) => {
        if (!categories || categories.length === 0) return 'General'
        return categories.slice(0, 2).join(', ')
    }

    return (
        <TouchableOpacity
            style={[styles.container, { backgroundColor: colors.surface }, style]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            {/* Logo */}
            <View style={styles.logoContainer}>
                {channel.logo ? (
                    <Image
                        source={{ uri: channel.logo }}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                ) : (
                    <View style={[styles.logoPlaceholder, { backgroundColor: colors.border }]}>
                        <Ionicons name="tv" size={24} color={colors.textMuted} />
                    </View>
                )}

                {/* Live Indicator */}
                {!channel.closed && (
                    <View style={styles.liveIndicator}>
                        <View style={styles.liveDot} />
                        <Text style={styles.liveText}>LIVE</Text>
                    </View>
                )}
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

                {/* Network */}
                {channel.network && (
                    <Text style={[styles.network, { color: colors.textMuted }]} numberOfLines={1}>
                        {channel.network}
                    </Text>
                )}
            </View>

            {/* Favorite Button */}
            {showFavorite && (
                <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={handleFavoritePress}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Ionicons
                        name={isChannelFavorite ? "heart" : "heart-outline"}
                        size={20}
                        color={isChannelFavorite ? "#FF6B35" : colors.textMuted}
                    />
                </TouchableOpacity>
            )}

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
    },
    liveIndicator: {
        position: 'absolute',
        top: 8,
        left: 8,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FF4444',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    liveDot: {
        width: 6,
        height: 6,
        backgroundColor: '#FFFFFF',
        borderRadius: 3,
        marginRight: 4,
    },
    liveText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '700',
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
        marginBottom: 4,
    },
    country: {
        fontSize: 12,
        fontWeight: '500',
    },
    category: {
        fontSize: 12,
        fontWeight: '400',
    },
    network: {
        fontSize: 11,
        fontStyle: 'italic',
    },
    favoriteButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 16,
        padding: 6,
    },
    gradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 40,
    },
})

