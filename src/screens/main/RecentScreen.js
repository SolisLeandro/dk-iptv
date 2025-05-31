import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { useSelector, useDispatch } from 'react-redux'

import { useTheme } from '../../hooks/useTheme'
import { clearRecent } from '../../store/slices/recentSlice'
import ChannelCard from '../../components/channel/ChannelCard'
import EmptyState from '../../components/common/EmptyState'

export default function RecentScreen({ navigation }) {
    const { colors } = useTheme()
    const dispatch = useDispatch()
    const recentChannels = useSelector(state => state.recent.channels)

    const handleClearRecent = () => {
        dispatch(clearRecent())
    }

    const formatWatchTime = (watchedAt) => {
        const date = new Date(watchedAt)
        const now = new Date()
        const diffMs = now - date
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
        const diffDays = Math.floor(diffHours / 24)

        if (diffDays > 0) {
            return `hace ${diffDays} día${diffDays > 1 ? 's' : ''}`
        } else if (diffHours > 0) {
            return `hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`
        } else {
            return 'hace un momento'
        }
    }

    const renderRecentItem = ({ item, index }) => (
        <View style={styles.recentItem}>
            <View style={styles.recentHeader}>
                <Text style={[styles.recentIndex, { color: colors.primary }]}>
                    #{index + 1}
                </Text>
                <Text style={[styles.recentTime, { color: colors.textSecondary }]}>
                    {formatWatchTime(item.watchedAt)}
                </Text>
            </View>
            <ChannelCard
                channel={item}
                onPress={() => navigation.navigate('Player', { channel: item })}
                style={styles.channelCard}
            />
        </View>
    )

    if (recentChannels.length === 0) {
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
                        <Text style={styles.headerTitle}>🕐 Recientes</Text>
                    </View>
                </LinearGradient>

                <EmptyState
                    icon="time-outline"
                    title="Sin historial"
                    message="Aún no has visto ningún canal. Tus canales recientes aparecerán aquí."
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
                    <Text style={styles.headerTitle}>🕐 Recientes</Text>
                    <TouchableOpacity
                        style={styles.clearButton}
                        onPress={handleClearRecent}
                    >
                        <Ionicons name="trash" size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            {/* Recent List */}
            <FlatList
                data={recentChannels}
                renderItem={renderRecentItem}
                keyExtractor={(item) => `${item.id}_${item.watchedAt}`}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}

const RecentScreenStyles = StyleSheet.create({
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
    listContent: {
        padding: 20,
    },
    recentItem: {
        marginBottom: 20,
    },
    recentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    recentIndex: {
        fontSize: 16,
        fontWeight: '700',
    },
    recentTime: {
        fontSize: 14,
        fontWeight: '500',
    },
    channelCard: {
        width: '100%',
    },
})
