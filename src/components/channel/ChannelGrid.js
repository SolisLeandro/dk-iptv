import React, { useMemo, useCallback } from 'react'
import {
    View,
    FlatList,
    StyleSheet,
    Text,
} from 'react-native'

import { useTheme } from '../../hooks/useTheme'
import ChannelCard from './ChannelCard'
import LoadingSpinner from '../common/LoadingSpinner'
import EmptyState from '../common/EmptyState'

// Componente memoizado para cada item del canal
const MemoizedChannelCard = React.memo(({ channel, onPress, numColumns }) => (
    <ChannelCard
        channel={channel}
        onPress={() => onPress?.(channel)}
        style={[styles.channelCard, { width: `${100 / numColumns - 2}%` }]}
    />
), (prevProps, nextProps) => {
    // Comparación personalizada para evitar re-renders innecesarios
    return (
        prevProps.channel.id === nextProps.channel.id &&
        prevProps.numColumns === nextProps.numColumns &&
        prevProps.onPress === nextProps.onPress
    )
})

export default function ChannelGrid({
    channels = [],
    searchQuery = '',
    onChannelPress,
    loading = false,
    numColumns = 2,
    style,
    refreshControl,
}) {
    const { colors } = useTheme()

    // Memoizar el filtrado de canales
    const filteredChannels = useMemo(() => {
        if (!searchQuery || searchQuery.trim() === '') return channels

        const query = searchQuery.toLowerCase().trim()
        return channels.filter(channel => {
            return (
                channel.name.toLowerCase().includes(query) ||
                channel.country.toLowerCase().includes(query) ||
                channel.categories?.some(cat => cat.toLowerCase().includes(query)) ||
                channel.alt_names?.some(name => name.toLowerCase().includes(query)) ||
                channel.network?.toLowerCase().includes(query)
            )
        })
    }, [channels, searchQuery])

    // Memoizar la función de renderizado
    const renderChannelItem = useCallback(({ item }) => (
        <MemoizedChannelCard
            channel={item}
            onPress={onChannelPress}
            numColumns={numColumns}
        />
    ), [onChannelPress, numColumns])

    // Memoizar keyExtractor
    const keyExtractor = useCallback((item) => item.id, [])

    // Memoizar getItemLayout para mejor performance
    const getItemLayout = useCallback((data, index) => {
        const itemHeight = 200 // Altura estimada de cada card + margin
        return {
            length: itemHeight,
            offset: itemHeight * Math.floor(index / numColumns),
            index,
        }
    }, [numColumns])

    const renderEmpty = useCallback(() => {
        if (loading) {
            return <LoadingSpinner message="Cargando canales..." />
        }

        if (searchQuery && filteredChannels.length === 0) {
            return (
                <EmptyState
                    icon="search-outline"
                    title="Sin resultados"
                    message={`No se encontraron canales para "${searchQuery}"`}
                />
            )
        }

        if (channels.length === 0) {
            return (
                <EmptyState
                    icon="tv-outline"
                    title="Sin canales"
                    message="No hay canales disponibles en este momento"
                />
            )
        }

        return null
    }, [loading, searchQuery, filteredChannels.length, channels.length])

    if (loading || filteredChannels.length === 0) {
        return (
            <View style={[styles.container, style]}>
                {renderEmpty()}
            </View>
        )
    }

    return (
        <View style={[styles.container, style]}>
            {searchQuery && (
                <Text style={[styles.resultCount, { color: colors.textSecondary }]}>
                    {filteredChannels.length} resultado{filteredChannels.length !== 1 ? 's' : ''} encontrado{filteredChannels.length !== 1 ? 's' : ''}
                </Text>
            )}

            <FlatList
                data={filteredChannels}
                renderItem={renderChannelItem}
                keyExtractor={keyExtractor}
                numColumns={numColumns}
                columnWrapperStyle={numColumns > 1 ? styles.row : null}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                removeClippedSubviews={true}
                maxToRenderPerBatch={10}
                windowSize={10}
                initialNumToRender={6}
                updateCellsBatchingPeriod={50}
                getItemLayout={getItemLayout}
                refreshControl={refreshControl}
                // Optimizaciones adicionales
                disableVirtualization={false}
                legacyImplementation={false}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    resultCount: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 12,
        paddingHorizontal: 4,
    },
    listContent: {
        paddingBottom: 20,
    },
    row: {
        justifyContent: 'space-between',
        paddingHorizontal: 4,
    },
    channelCard: {
        marginBottom: 16,
    },
})