import React, { useState, useRef, useEffect } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Dimensions,
    RefreshControl,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as Haptics from 'expo-haptics'

import { useTheme } from '../../hooks/useTheme'
import { useChannels } from '../../hooks/useChannels'
import ChannelGrid from '../../components/channel/ChannelGrid'
import FilterDrawer from '../../components/filters/FilterDrawer'
import SearchBar from '../../components/channel/ChannelSearch'
import { useFilters } from '../../hooks/useFilters'

const { width } = Dimensions.get('window')

export default function ExploreScreen({ navigation }) {
    const { colors } = useTheme()
    const { hasActiveFilters, filteredCount, totalChannels, channels, isLoading, refetch } = useChannels()
    const { selectedCountry, selectedCategory } = useFilters()
    const insets = useSafeAreaInsets()

    const [showFilters, setShowFilters] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    const slideAnim = useRef(new Animated.Value(-width)).current

    const toggleFilters = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

        setShowFilters(!showFilters)
        Animated.spring(slideAnim, {
            toValue: showFilters ? -width : 0,
            friction: 8,
            tension: 100,
            useNativeDriver: true,
        }).start()
    }

    const onRefresh = async () => {
        setRefreshing(true)
        await refetch()
        setRefreshing(false)
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    }

    const handleSearch = (query) => {
        setSearchQuery(query)
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
                <View style={styles.headerTop}>
                    <Text style={styles.headerTitle}>🔍 Explorar</Text>
                    <TouchableOpacity
                        onPress={toggleFilters}
                        style={[styles.filterButton, { backgroundColor: colors.surface }]}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="options" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>

                {/* Búsqueda */}
                <SearchBar
                    value={searchQuery}
                    onChangeText={handleSearch}
                    placeholder="Buscar canales..."
                    style={styles.searchBar}
                />
            </LinearGradient>

            <View style={styles.content}>
                <View style={styles.channelsSection}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        🌍 {hasActiveFilters ? 'Canales Filtrados' : 'Todos los Canales'} ({filteredCount}/{totalChannels})
                    </Text>
                    {hasActiveFilters && (
                        <View style={styles.filterInfo}>
                            <Text style={[styles.filterInfoText, { color: colors.textSecondary }]}>
                                Filtros activos: {selectedCountry && '🌍'} {selectedCategory && '📺'}
                            </Text>
                        </View>
                    )}
                    <ChannelGrid
                        channels={channels}
                        searchQuery={searchQuery}
                        onChannelPress={(channel) => navigation.navigate('Player', { channel })}
                        loading={isLoading}
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
            </View>

            {/* Drawer de Filtros */}
            <Animated.View
                style={[
                    styles.filterDrawer,
                    {
                        transform: [{ translateX: slideAnim }],
                        backgroundColor: colors.surface,
                    },
                ]}
            >
                <FilterDrawer onClose={toggleFilters} />
            </Animated.View>

            {/* Overlay */}
            {showFilters && (
                <TouchableOpacity
                    style={styles.overlay}
                    onPress={toggleFilters}
                    activeOpacity={1}
                />
            )}
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
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 70
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    filterButton: {
        padding: 12,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
    filterDrawer: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: width * 0.85,
        zIndex: 1000,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 999,
    },
    filterInfo: {
        marginBottom: 12,
    },
    filterInfoText: {
        fontSize: 14,
        fontStyle: 'italic',
    },
})