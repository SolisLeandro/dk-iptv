import React, { useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Alert,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'

import { useTheme } from '../../hooks/useTheme'
import { useFavorites } from '../../hooks/useFavorites'
import ChannelCard from '../../components/channel/ChannelCard'
import EmptyState from '../../components/common/EmptyState'

export default function FavoritesScreen({ navigation }) {
    const { colors } = useTheme()
    const { favorites, toggleFavorite } = useFavorites()
    const [sortBy, setSortBy] = useState('name') // 'name', 'recent', 'category'

    const getSortedFavorites = () => {
        const sorted = [...favorites]

        switch (sortBy) {
            case 'name':
                return sorted.sort((a, b) => a.name.localeCompare(b.name))
            case 'recent':
                return sorted.sort((a, b) => new Date(b.addedAt || 0) - new Date(a.addedAt || 0))
            case 'category':
                return sorted.sort((a, b) => {
                    const catA = a.categories?.[0] || ''
                    const catB = b.categories?.[0] || ''
                    return catA.localeCompare(catB)
                })
            default:
                return sorted
        }
    }

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

    const renderFavoriteItem = ({ item }) => (
        <ChannelCard
            channel={item}
            onPress={() => navigation.navigate('Player', { channel: item })}
            onFavoritePress={() => toggleFavorite(item)}
            isFavorite={true}
            style={styles.favoriteCard}
        />
    )

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
                    style={styles.header}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <View style={styles.headerContent}>
                        <Text style={styles.headerTitle}>❤️ Favoritos</Text>
                    </View>
                </LinearGradient>

                <EmptyState
                    icon="heart-outline"
                    title="Sin favoritos"
                    message="Aún no tienes canales favoritos. Toca el corazón en cualquier canal para agregarlo aquí."
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
                style={styles.header}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>❤️ Favoritos</Text>
                    <TouchableOpacity
                        style={styles.clearButton}
                        onPress={handleClearFavorites}
                    >
                        <Ionicons name="trash" size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            {/* Sort Options */}
            <View style={styles.sortContainer}>
                <Text style={[styles.sortLabel, { color: colors.text }]}>
                    Ordenar por:
                </Text>
                <View style={styles.sortOptions}>
                    {renderSortOption('name', 'Nombre', 'text')}
                    {renderSortOption('recent', 'Reciente', 'time')}
                    {renderSortOption('category', 'Categoría', 'folder')}
                </View>
            </View>

            {/* Favorites List */}
            <FlatList
                data={getSortedFavorites()}
                renderItem={renderFavoriteItem}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />

            {/* Stats */}
            <View style={[styles.statsContainer, { backgroundColor: colors.surface }]}>
                <Text style={[styles.statsText, { color: colors.textSecondary }]}>
                    {favorites.length} canales favoritos
                </Text>
            </View>
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
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
    sortContainer: {
        padding: 20,
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
    listContent: {
        padding: 20,
    },
    row: {
        justifyContent: 'space-between',
    },
    favoriteCard: {
        width: '48%',
        marginBottom: 16,
    },
    statsContainer: {
        padding: 16,
        alignItems: 'center',
    },
    statsText: {
        fontSize: 14,
        fontWeight: '500',
    },
})