import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    FlatList,
    TouchableOpacity,
    Keyboard,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { useSelector, useDispatch } from 'react-redux'

import { useTheme } from '../../hooks/useTheme'
import { searchChannels, setSearchQuery } from '../../store/slices/channelsSlice'
import ChannelCard from '../../components/channel/ChannelCard'
import EmptyState from '../../components/common/EmptyState'

export default function SearchScreen({ navigation }) {
    const { colors } = useTheme()
    const dispatch = useDispatch()
    const { searchResults, searchQuery } = useSelector(state => state.channels)
    const [localQuery, setLocalQuery] = useState(searchQuery)
    const [isSearching, setIsSearching] = useState(false)

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (localQuery.trim().length > 2) {
                setIsSearching(true)
                dispatch(searchChannels(localQuery))
                    .finally(() => setIsSearching(false))
                dispatch(setSearchQuery(localQuery))
            } else if (localQuery.trim().length === 0) {
                dispatch(setSearchQuery(''))
            }
        }, 500)

        return () => clearTimeout(timeoutId)
    }, [localQuery, dispatch])

    const handleClearSearch = () => {
        setLocalQuery('')
        dispatch(setSearchQuery(''))
        Keyboard.dismiss()
    }

    const renderSearchResult = ({ item }) => (
        <ChannelCard
            channel={item}
            onPress={() => {
                navigation.navigate('Player', { channel: item })
            }}
            style={styles.resultCard}
        />
    )

    const renderEmptyState = () => {
        if (localQuery.trim().length === 0) {
            return (
                <EmptyState
                    icon="search-outline"
                    title="Buscar Canales"
                    message="Escribe el nombre de un canal, categoría o país para buscar."
                />
            )
        } else if (localQuery.trim().length <= 2) {
            return (
                <EmptyState
                    icon="text-outline"
                    title="Continúa escribiendo"
                    message="Escribe al menos 3 caracteres para buscar."
                />
            )
        } else if (searchResults.length === 0 && !isSearching) {
            return (
                <EmptyState
                    icon="search-circle-outline"
                    title="Sin resultados"
                    message={`No se encontraron canales para "${localQuery}"`}
                />
            )
        }
        return null
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
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Buscar</Text>
                </View>
            </LinearGradient>

            {/* Search Input */}
            <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
                <Ionicons name="search" size={20} color={colors.textMuted} />
                <TextInput
                    style={[styles.searchInput, { color: colors.text }]}
                    placeholder="Buscar canales, categorías, países..."
                    placeholderTextColor={colors.textMuted}
                    value={localQuery}
                    onChangeText={setLocalQuery}
                    autoFocus
                    returnKeyType="search"
                />
                {localQuery.length > 0 && (
                    <TouchableOpacity
                        style={styles.clearButton}
                        onPress={handleClearSearch}
                    >
                        <Ionicons name="close-circle" size={20} color={colors.textMuted} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Search Results */}
            {searchResults.length > 0 ? (
                <FlatList
                    data={searchResults}
                    renderItem={renderSearchResult}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                    contentContainerStyle={styles.resultsContent}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={
                        <Text style={[styles.resultsHeader, { color: colors.text }]}>
                            {searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''} encontrado{searchResults.length !== 1 ? 's' : ''}
                        </Text>
                    }
                />
            ) : (
                <View style={styles.emptyContainer}>
                    {renderEmptyState()}
                    {isSearching && (
                        <View style={styles.loadingContainer}>
                            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                                Buscando...
                            </Text>
                        </View>
                    )}
                </View>
            )}
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
        fontSize: 24,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 20,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        marginLeft: 12,
    },
    clearButton: {
        padding: 4,
    },
    resultsContent: {
        padding: 20,
    },
    resultsHeader: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 16,
    },
    row: {
        justifyContent: 'space-between',
    },
    resultCard: {
        width: '48%',
        marginBottom: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    loadingContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    loadingText: {
        fontSize: 16,
        fontWeight: '500',
    },
})