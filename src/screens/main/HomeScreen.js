import React, { useState, useRef, useEffect } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    RefreshControl,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { BlurView } from 'expo-blur'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'

import { useTheme } from '../../hooks/useTheme'
import { useChannels } from '../../hooks/useChannels'
import ChannelGrid from '../../components/channel/ChannelGrid'
import FeaturedChannels from '../../components/channel/FeaturedChannels'
import FilterDrawer from '../../components/filters/FilterDrawer'
import SearchBar from '../../components/channel/ChannelSearch'
import QuickActions from '../../components/common/QuickActions'
import StatsCards from '../../components/common/StatsCards'

const { width, height } = Dimensions.get('window')

export default function HomeScreen({ navigation }) {
    const { colors, isDark } = useTheme()
    const { channels, isLoading, refetch } = useChannels()

    const [showFilters, setShowFilters] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    const slideAnim = useRef(new Animated.Value(-width)).current
    const fadeAnim = useRef(new Animated.Value(0)).current
    const scaleAnim = useRef(new Animated.Value(1)).current

    useEffect(() => {
        // Animación de entrada
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 8,
                tension: 100,
                useNativeDriver: true,
            }),
        ]).start()
    }, [])

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
        // Implementar lógica de búsqueda
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header con Gradiente Épico */}
            <LinearGradient
                colors={colors.gradient}
                style={styles.header}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.headerTop}>
                    <View style={styles.logoContainer}>
                        <Text style={styles.logoEmoji}>📺</Text>
                        <Text style={styles.headerTitle}>Stream Master</Text>
                    </View>

                    <TouchableOpacity
                        onPress={toggleFilters}
                        style={[styles.filterButton, { backgroundColor: colors.overlay }]}
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

                {/* Stats Cards */}
                <StatsCards channels={channels} />
                {/* Canales Destacados */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        🔥 Canales Destacados
                    </Text>
                    <FeaturedChannels channels={channels?.slice(0, 10)} />
                </View>

                {/* Acciones Rápidas
                <QuickActions onFilterPress={toggleFilters} />
                 */}

                {/* Grid de Canales */}
                <View style={styles.channelsSection}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        🌍 Todos los Canales
                    </Text>
                    <ChannelGrid
                        channels={channels}
                        searchQuery={searchQuery}
                        onChannelPress={(channel) => navigation.navigate('Player', { channel })}
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

            {/* FAB para acciones rápidas */}
            <TouchableOpacity
                style={[styles.fab, { backgroundColor: colors.primary }]}
                onPress={() => navigation.navigate('Search')}
                activeOpacity={0.8}
            >
                <Ionicons name="search" size={24} color="#FFFFFF" />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        height: 160,
        paddingTop: 50,
    },
    headerBlur: {
        flex: 1,
        justifyContent: 'center',
    },
    headerContent: {
        paddingHorizontal: 20,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoEmoji: {
        fontSize: 28,
        marginRight: 8,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#FFFFFF',
        fontFamily: 'Inter-Bold',
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
        paddingTop: 16,
    },
    section: {
        marginBottom: 24,
        paddingHorizontal: 20,
    },
    channelsSection: {
        flex: 1,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 12,
        fontFamily: 'Inter-Bold',
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
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8
    }
})