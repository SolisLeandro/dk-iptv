import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'

import { useTheme } from '../../hooks/useTheme'
import { useFilters } from '../../hooks/useFilters'
import LoadingSpinner from '../common/LoadingSpinner'

export default function FilterDrawer({ onClose }) {
    const { colors } = useTheme()
    const {
        countries,
        categories,
        selectedCountry,
        selectedCategory,
        setCountry,
        setCategory,
        clearFilters,
        isLoading
    } = useFilters()

    const FilterSection = ({ title, data, selectedValue, onSelect, keyField = 'code', nameField = 'name', icon }) => (
        <View style={[styles.filterSection, { backgroundColor: colors.background }]}>
            <View style={styles.filterTitleContainer}>
                <Ionicons name={icon} size={18} color={colors.primary} style={styles.filterIcon} />
                <Text style={[styles.filterTitle, { color: colors.text }]}>{title}</Text>
            </View>

            {!data || data.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                        Sin datos disponibles
                    </Text>
                </View>
            ) : (
                <ScrollView style={styles.filterOptions}>
                    {data.map((item) => {
                        const key = item[keyField]
                        const name = item[nameField]
                        const isSelected = selectedValue === key

                        return (
                            <TouchableOpacity
                                key={key}
                                style={[
                                    styles.filterOption,
                                    {
                                        backgroundColor: isSelected ? colors.border : colors.surface,
                                    }
                                ]}
                                onPress={() => onSelect(isSelected ? null : key)}
                            >
                                <Text
                                    style={[
                                        styles.filterOptionText,
                                        { color: isSelected ? '#FFFFFF' : colors.text }
                                    ]}
                                >
                                    {name}
                                </Text>
                                {isSelected && (
                                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                                )}
                            </TouchableOpacity>
                        )
                    })}
                </ScrollView>
            )}
        </View>
    )

    return (
        <View style={[styles.container, { backgroundColor: colors.surface }]}>
            {/* Header */}
            <LinearGradient
                colors={colors.gradient}
                style={styles.header}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.headerContent}>
                    <View style={styles.headerTitleContainer}>
                        <Ionicons name="filter" size={20} color="#FFFFFF" style={styles.headerIcon} />
                        <Text style={styles.headerTitle}>Filtros</Text>
                    </View>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Ionicons name="close" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <LoadingSpinner message="Cargando filtros..." />
                </View>
            ) : (
                <View style={styles.content}>
                    {/* Clear Filters Button */}
                    {(selectedCountry || selectedCategory) && (
                        <TouchableOpacity
                            style={[styles.clearButton, { backgroundColor: colors.border }]}
                            onPress={clearFilters}
                        >
                            <Ionicons name="refresh" size={20} color="#FFFFFF" />
                            <Text style={[styles.clearButtonText, { color: "#FFFFFF" }]}>
                                Limpiar Filtros
                            </Text>
                        </TouchableOpacity>
                    )}

                    {/* Active Filters */}
                    {(selectedCountry || selectedCategory) && (
                        <View>
                            <View style={styles.activeTitleContainer}>
                                <Ionicons name="checkmark-circle" size={18} color={colors.primary} style={styles.activeIcon} />
                                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                                    Filtros Activos
                                </Text>
                            </View>
                            <View style={styles.activeFilters}>
                                {selectedCountry && (
                                    <TouchableOpacity
                                        style={[styles.activeFilter, { backgroundColor: colors.border }]}
                                        onPress={() => setCountry(null)}
                                    >
                                        <Text style={styles.activeFilterText}>
                                            {countries.find(c => c.code === selectedCountry)?.name || selectedCountry}
                                        </Text>
                                        <Ionicons name="close" size={16} color="#FFFFFF" />
                                    </TouchableOpacity>
                                )}
                                {selectedCategory && (
                                    <TouchableOpacity
                                        style={[styles.activeFilter, { backgroundColor: colors.border }]}
                                        onPress={() => setCategory(null)}
                                    >
                                        <Text style={styles.activeFilterText}>
                                            {categories.find(c => c.id === selectedCategory)?.name || selectedCategory}
                                        </Text>
                                        <Ionicons name="close" size={16} color="#FFFFFF" />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    )}

                    {/* Countries Filter */}
                    <FilterSection
                        title="Países"
                        icon="globe"
                        data={countries}
                        selectedValue={selectedCountry}
                        onSelect={setCountry}
                        keyField="code"
                        nameField="name"
                    />

                    {/* Categories Filter */}
                    <FilterSection
                        title="Categorías"
                        icon="grid"
                        data={categories}
                        selectedValue={selectedCategory}
                        onSelect={setCategory}
                        keyField="id"
                        nameField="name"
                    />
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
        paddingTop: 30,
        justifyContent: 'center',
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20
    },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerIcon: {
        marginRight: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    closeButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        padding: 20,
        paddingBottom: 120,
        gap: 20
    },
    clearButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 8,
    },
    clearButtonText: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    activeTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    activeIcon: {
        marginRight: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    activeFilters: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    activeFilter: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        gap: 4,
    },
    activeFilterText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '500',
    },
    filterSection: {
        flex: 1,
        padding: 15,
        borderRadius: 8
    },
    filterTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    filterIcon: {
        marginRight: 8,
    },
    filterTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    filterOptions: {
        paddingHorizontal: 10
    },
    filterOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
    },
    filterOptionText: {
        fontSize: 14,
        fontWeight: '500',
        flex: 1,
    },
    emptyState: {
        padding: 20,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 14,
        fontStyle: 'italic',
    },
    infoSection: {
        padding: 16,
        borderRadius: 8,
        marginTop: 20,
    },
    infoText: {
        fontSize: 12,
        lineHeight: 18,
        textAlign: 'center',
    },
})