import React, { useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    FlatList,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'

import { useTheme } from '../../hooks/useTheme'
import { useChannels } from '../../hooks/useChannels'
import { useFilters } from '../../hooks/useFilters'
import ChannelCard from '../../components/channel/ChannelCard'

export default function ExploreScreen({ navigation }) {
    const { colors } = useTheme()
    const { channels } = useChannels()
    const { countries, categories } = useFilters()
    const [selectedFilter, setSelectedFilter] = useState('all')

    const filterOptions = [
        { id: 'all', label: 'Todos', icon: 'grid' },
        { id: 'popular', label: 'Populares', icon: 'trending-up' },
        { id: 'new', label: 'Nuevos', icon: 'star' },
        { id: 'live', label: 'En Vivo', icon: 'radio' },
    ]

    const getFilteredChannels = () => {
        switch (selectedFilter) {
            case 'popular':
                return channels.filter(ch => ch.categories?.includes('general')).slice(0, 20)
            case 'new':
                return channels.filter(ch => {
                    const launched = new Date(ch.launched)
                    const now = new Date()
                    const diffTime = Math.abs(now - launched)
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                    return diffDays < 365 // Último año
                })
            case 'live':
                return channels.filter(ch => !ch.closed)
            default:
                return channels
        }
    }

    const renderChannelItem = ({ item }) => (
        <ChannelCard
            channel={item}
            onPress={() => navigation.navigate('Player', { channel: item })}
            style={styles.channelCard}
        />
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
                    <Text style={styles.headerTitle}>🔍 Explorar</Text>
                    <TouchableOpacity
                        style={styles.settingsButton}
                        onPress={() => navigation.navigate('Settings')}
                    >
                        <Ionicons name="settings" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Filtros */}
                <View style={styles.filtersSection}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        Filtrar por
                    </Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.filtersScroll}
                    >
                        {filterOptions.map((filter) => (
                            <TouchableOpacity
                                key={filter.id}
                                style={[
                                    styles.filterChip,
                                    {
                                        backgroundColor: selectedFilter === filter.id
                                            ? colors.primary
                                            : colors.surface,
                                    }
                                ]}
                                onPress={() => setSelectedFilter(filter.id)}
                            >
                                <Ionicons
                                    name={filter.icon}
                                    size={18}
                                    color={selectedFilter === filter.id ? '#FFFFFF' : colors.text}
                                    style={styles.filterIcon}
                                />
                                <Text
                                    style={[
                                        styles.filterText,
                                        {
                                            color: selectedFilter === filter.id
                                                ? '#FFFFFF'
                                                : colors.text
                                        }
                                    ]}
                                >
                                    {filter.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Categorías Populares */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        📺 Categorías Populares
                    </Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.categoriesScroll}
                    >
                        {categories.slice(0, 10).map((category) => (
                            <TouchableOpacity
                                key={category.id}
                                style={[styles.categoryCard, { backgroundColor: colors.surface }]}
                                onPress={() => {
                                    // Navegar a canales filtrados por categoría
                                    navigation.navigate('CategoryChannels', { category })
                                }}
                            >
                                <Text style={[styles.categoryName, { color: colors.text }]}>
                                    {category.name}
                                </Text>
                                <Text style={[styles.categoryCount, { color: colors.textSecondary }]}>
                                    {channels.filter(ch => ch.categories?.includes(category.id)).length} canales
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Lista de Canales */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        {filterOptions.find(f => f.id === selectedFilter)?.label} Canales
                    </Text>
                    <FlatList
                        data={getFilteredChannels()}
                        renderItem={renderChannelItem}
                        keyExtractor={(item) => item.id}
                        numColumns={2}
                        columnWrapperStyle={styles.row}
                        scrollEnabled={false}
                        showsVerticalScrollIndicator={false}
                    />
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    settingsButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    filtersSection: {
        marginBottom: 24,
    },
    filtersScroll: {
        marginBottom: 8,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 12,
    },
    filterIcon: {
        marginRight: 6,
    },
    filterText: {
        fontSize: 14,
        fontWeight: '500',
    },
    categoriesScroll: {
        marginBottom: 8,
    },
    categoryCard: {
        padding: 16,
        borderRadius: 12,
        marginRight: 12,
        width: 120,
    },
    categoryName: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    categoryCount: {
        fontSize: 12,
    },
    row: {
        justifyContent: 'space-between',
    },
    channelCard: {
        width: '48%',
        marginBottom: 16,
    },
})