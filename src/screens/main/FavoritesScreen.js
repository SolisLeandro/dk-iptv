import React, { useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useTheme } from '../../hooks/useTheme'
import { useFavorites } from '../../hooks/useFavorites'
import ChannelGrid from '../../components/channel/ChannelGrid'
import SearchBar from '../../components/channel/ChannelSearch'
import EmptyState from '../../components/common/EmptyState'

export default function FavoritesScreen({ navigation }) {
    const { colors } = useTheme()
    const { favorites, toggleFavorite } = useFavorites()
    const insets = useSafeAreaInsets()
    const [sortBy, setSortBy] = useState('recent') // recent por defecto
    const [searchQuery, setSearchQuery] = useState('')

    const getSortedFavorites = () => {
        const sorted = [...favorites]

        switch (sortBy) {
            case 'name':
                return sorted.sort((a, b) => a.name.localeCompare(b.name))
            case 'recent':
                return sorted.sort((a, b) => new Date(b.addedAt || 0) - new Date(a.addedAt || 0))
            default:
                return sorted
        }
    }

    const filteredFavorites = getSortedFavorites().filter(channel => {
        if (!searchQuery) return true
        const query = searchQuery.toLowerCase()
        return (
            channel.name.toLowerCase().includes(query) ||
            channel.country.toLowerCase().includes(query) ||
            channel.categories?.some(cat => cat.toLowerCase().includes(query)) ||
            channel.alt_names?.some(name => name.toLowerCase().includes(query))
        )
    })

    const handleClearFavorites = () => {
        Alert.alert(
            'Limpiar Favoritos',
            '¿Estás seguro de que quieres eliminar todos los canales favoritos?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: () => {
                        // dispatch(clearFavorites())
                    }
                },
            ]
        )
    }

    const handleSearch = (query) => {
        setSearchQuery(query)
    }

    const renderSortOption = (option, label, icon) => (
        <TouchableOpacity
            style={[
                styles.sortOption,
                {
                    backgroundColor: sortBy === option ? colors.primary : colors.surface,
                }
            ]}
            onPress={() => setSortBy(option)}
        >
            <Ionicons
                name={icon}
                size={16}
                color={sortBy === option ? '#FFFFFF' : colors.text}
            />
            <Text
                style={[
                    styles.sortText,
                    { color: sortBy === option ? '#FFFFFF' : colors.text }
                ]}
            >
                {label}
            </Text>
        </TouchableOpacity>
    )

    if (favorites.length === 0) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                {/* Header */}
                <LinearGradient
                    colors={colors.gradient}
                    style={[styles.header, { paddingTop: insets.top + 10 }]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <View style={styles.headerContent}>
                        <View style={styles.headerTitleContainer}>
                            <Ionicons name="heart" size={24} color="#FFFFFF" style={styles.headerIcon} />
                            <Text style={styles.headerTitle}>Favoritos</Text>
                        </View>
                    </View>
                </LinearGradient>

                <EmptyState
                    icon="heart-outline"
                    title="Sin favoritos"
                    message="Aún no tienes canales favoritos. Ve al reproductor para agregar canales a esta sección."
                    actionText="Explorar Canales"
                    onAction={() => navigation.navigate('Explore')}
                />
            </View>
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
                        <Ionicons name="heart" size={24} color="#FFFFFF" style={styles.headerIcon} />
                        <Text style={styles.headerTitle}>Favoritos</Text>
                    </View>
                </View>

                {/* Búsqueda */}
                <SearchBar
                    value={searchQuery}
                    onChangeText={handleSearch}
                    placeholder="Buscar en favoritos..."
                    style={styles.searchBar}
                />
            </LinearGradient>

            <View style={styles.content}>
                {/* Sort Options */}
                <View style={styles.sortContainer}>
                    <Text style={[styles.sortLabel, { color: colors.text }]}>
                        Ordenar por:
                    </Text>
                    <View style={styles.sortOptions}>
                        {renderSortOption('recent', 'Reciente', 'time')}
                        {renderSortOption('name', 'Nombre', 'text')}
                    </View>
                </View>

                {/* Favorites Grid */}
                <View style={styles.channelsSection}>
                    <View style={styles.titleContainer}>
                        <Ionicons name="heart" size={20} color={colors.primary} style={styles.sectionIcon} />
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                            Canales Favoritos ({filteredFavorites.length})
                        </Text>
                    </View>
                    <ChannelGrid
                        channels={filteredFavorites}
                        searchQuery=""
                        onChannelPress={(channel) => navigation.navigate('Player', { channel })}
                    />
                </View>
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
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 70
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
    clearButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    searchBar: {
        marginTop: 8,
    },
    content: {
        flex: 1,
        paddingTop: 25,
        paddingBottom: 90
    },
    sortContainer: {
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    sortLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    sortOptions: {
        flexDirection: 'row',
        gap: 8,
    },
    sortOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        gap: 4,
    },
    sortText: {
        fontSize: 14,
        fontWeight: '500',
    },
    channelsSection: {
        paddingHorizontal: 20,
        flex: 1,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionIcon: {
        marginRight: 8,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
    },
})