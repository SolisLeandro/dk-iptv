// src/components/channel/FeaturedChannels.js
import React from 'react'
import {
    View,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'

import { useTheme } from '../../hooks/useTheme'
import ChannelCard from './ChannelCard'

export default function FeaturedChannels({
    channels = [],
    onChannelPress,
    title = "Canales Destacados"
}) {
    const { colors } = useTheme()

    if (!channels || channels.length === 0) {
        return null
    }

    const renderFeaturedItem = (channel, index) => (
        <View key={channel.id} style={styles.featuredItem}>
            <TouchableOpacity
                style={[styles.featuredCard, { backgroundColor: colors.surface }]}
                onPress={() => onChannelPress?.(channel)}
                activeOpacity={0.8}
            >
                <LinearGradient
                    colors={[colors.primary + '20', colors.secondary + '20']}
                    style={styles.featuredGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <View style={styles.featuredRank}>
                        <Text style={[styles.rankNumber, { color: colors.primary }]}>
                            #{index + 1}
                        </Text>
                    </View>

                    <View style={styles.featuredInfo}>
                        <Text style={[styles.featuredName, { color: colors.text }]} numberOfLines={2}>
                            {channel.name}
                        </Text>
                        <Text style={[styles.featuredCountry, { color: colors.textSecondary }]}>
                            {channel.country} • {channel.categories?.[0] || 'General'}
                        </Text>
                    </View>

                    <View style={styles.featuredAction}>
                        <Ionicons name="play-circle" size={24} color={colors.primary} />
                    </View>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    )

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {channels.slice(0, 10).map(renderFeaturedItem)}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
    },
    scrollContent: {
        paddingHorizontal: 4,
    },
    featuredItem: {
        marginRight: 12,
    },
    featuredCard: {
        width: 280,
        height: 80,
        borderRadius: 12,
        overflow: 'hidden',
    },
    featuredGradient: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    featuredRank: {
        marginRight: 12,
    },
    rankNumber: {
        fontSize: 18,
        fontWeight: '700',
    },
    featuredInfo: {
        flex: 1,
    },
    featuredName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    featuredCountry: {
        fontSize: 12,
        fontWeight: '500',
    },
    featuredAction: {
        marginLeft: 12,
    },
})

