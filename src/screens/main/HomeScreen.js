import React, { useState, useRef, useEffect } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    RefreshControl,
    Platform,
    Image,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as Haptics from 'expo-haptics'

import { useTheme } from '../../hooks/useTheme'
import { useChannels } from '../../hooks/useChannels'
import { useFeatured } from '../../hooks/useFeatured'
import ChannelGrid from '../../components/channel/ChannelGrid'
import SearchBar from '../../components/channel/ChannelSearch'
import EmptyState from '../../components/common/EmptyState'

export default function HomeScreen({ navigation }) {
    const { colors } = useTheme()
    const { refetch } = useChannels()
    const { featured } = useFeatured()
    const insets = useSafeAreaInsets()

    const [refreshing, setRefreshing] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    const onRefresh = async () => {
        setRefreshing(true)
        await refetch()
        setRefreshing(false)
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    }

    const handleSearch = (query) => {
        setSearchQuery(query)
    }

    const filteredFeatured = featured.filter(channel => {
        if (!searchQuery) return true
        const query = searchQuery.toLowerCase()
        return (
            channel.name.toLowerCase().includes(query) ||
            channel.country.toLowerCase().includes(query) ||
            channel.categories?.some(cat => cat.toLowerCase().includes(query)) ||
            channel.alt_names?.some(name => name.toLowerCase().includes(query))
        )
    })

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <LinearGradient
                colors={colors.gradient}
                style={[styles.header, { paddingTop: insets.top }]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.headerTop}>
                    <View style={styles.logoContainer}>
                        <Image
                            source={require('../../../assets/images/DKiptvLogoTipo.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>
                </View>

                {/* Búsqueda */}
                <SearchBar
                    value={searchQuery}
                    onChangeText={handleSearch}
                    placeholder="Buscar en destacados..."
                    style={styles.searchBar}
                />
            </LinearGradient>

            <View style={styles.content}>
                {featured.length === 0 ? (
                    <EmptyState
                        icon="flame-outline"
                        title="Sin canales destacados"
                        message="Aún no tienes canales destacados. Ve a Explorar para agregar canales a esta sección."
                        actionText="Explorar Canales"
                        onAction={() => navigation.navigate('Explore')}
                    />
                ) : (
                    <View style={styles.channelsSection}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                            🔥 Canales Destacados ({filteredFeatured.length})
                        </Text>
                        <ChannelGrid
                            channels={filteredFeatured}
                            searchQuery=""
                            onChannelPress={(channel) => navigation.navigate('Player', { channel })}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={onRefresh}
                                    colors={[colors.primary]}
                                    tintColor={colors.primary}
                                />
                            }
                        />
                    </View>
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        minHeight: 140,
        paddingHorizontal: 20,
        paddingBottom: 8,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logo: {
        width: 130,
        height: 60,
    },
    logoEmoji: {
        fontSize: 28,
        marginRight: 8,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    searchBar: {
        marginTop: 8,
    },
    content: {
        flex: 1,
        paddingTop: 25
    },
    channelsSection: {
        paddingHorizontal: 20,
        flex: 1,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 12,
    },
})