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

    const FilterSection = ({ title, data, selectedValue, onSelect, keyField = 'code', nameField = 'name' }) => (
        <View style={styles.filterSection}>
            <Text style={[styles.filterTitle, { color: colors.text }]}>{title}</Text>
            
            {!data || data.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                        Sin datos disponibles
                    </Text>
                </View>
            ) : (
                <ScrollView style={styles.filterOptions} nestedScrollEnabled>
                    {data.slice(0, 30).map((item) => {
                        const key = item[keyField]
                        const name = item[nameField]
                        const isSelected = selectedValue === key

                        return (
                            <TouchableOpacity
                                key={key}
                                style={[
                                    styles.filterOption,
                                    {
                                        backgroundColor: isSelected ? colors.primary : colors.surface,
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
                    <Text style={styles.headerTitle}>🔍 Filtros</Text>
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
                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    {/* Clear Filters Button */}
                    {(selectedCountry || selectedCategory) && (
                        <TouchableOpacity
                            style={[styles.clearButton, { backgroundColor: colors.error + '20' }]}
                            onPress={clearFilters}
                        >
                            <Ionicons name="refresh" size={20} color={colors.error} />
                            <Text style={[styles.clearButtonText, { color: colors.error }]}>
                                Limpiar Filtros
                            </Text>
                        </TouchableOpacity>
                    )}

                    {/* Active Filters */}
                    {(selectedCountry || selectedCategory) && (
                        <View style={styles.activeFiltersSection}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>
                                Filtros Activos
                            </Text>
                            <View style={styles.activeFilters}>
                                {selectedCountry && (
                                    <TouchableOpacity
                                        style={[styles.activeFilter, { backgroundColor: colors.primary }]}
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
                                        style={[styles.activeFilter, { backgroundColor: colors.secondary }]}
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
                        title="🌍 Países"
                        data={countries}
                        selectedValue={selectedCountry}
                        onSelect={setCountry}
                        keyField="code"
                        nameField="name"
                    />

                    {/* Categories Filter */}
                    <FilterSection
                        title="📺 Categorías"
                        data={categories}
                        selectedValue={selectedCategory}
                        onSelect={setCategory}
                        keyField="id"
                        nameField="name"
                    />

                    {/* Info Section */}
                    <View style={[styles.infoSection, { backgroundColor: colors.surface }]}>
                        <Text style={[styles.infoText, { color: colors.textMuted }]}>
                            💡 Los filtros se aplican automáticamente. Puedes combinar múltiples filtros para refinar tu búsqueda.
                        </Text>
                    </View>
                </ScrollView>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        height: 100,
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
    },
    clearButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
    },
    clearButtonText: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    activeFiltersSection: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
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
        marginBottom: 24,
    },
    filterTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    filterOptions: {
        maxHeight: 200,
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