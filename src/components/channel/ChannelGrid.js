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

export default function ChannelGrid({
    channels = [],
    searchQuery = '',
    onChannelPress,
    loading = false,
    numColumns = 2,
    style,
}) {
    const { colors } = useTheme()

    const filteredChannels = channels.filter(channel => {
        if (!searchQuery) return true

        const query = searchQuery.toLowerCase()
        return (
            channel.name.toLowerCase().includes(query) ||
            channel.country.toLowerCase().includes(query) ||
            channel.categories?.some(cat => cat.toLowerCase().includes(query)) ||
            channel.alt_names?.some(name => name.toLowerCase().includes(query))
        )
    })

    const renderChannelItem = ({ item }) => (
        <ChannelCard
            channel={item}
            onPress={() => onChannelPress?.(item)}
            style={[styles.channelCard, { width: `${100 / numColumns - 2}%` }]}
        />
    )

    const renderEmpty = () => {
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
    }

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
                keyExtractor={(item) => item.id}
                numColumns={numColumns}
                columnWrapperStyle={numColumns > 1 ? styles.row : null}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                removeClippedSubviews={true}
                maxToRenderPerBatch={10}
                windowSize={10}
                initialNumToRender={6}
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

