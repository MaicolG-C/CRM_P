import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, TouchableWithoutFeedback, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

// El componente FilterModal ahora acepta 'allAssignees' como prop
const FilterModal = ({ isVisible, onClose, onApplyFilters, initialFilters, allAssignees }) => {
    // Estado local para los filtros temporales
    const [tempFilters, setTempFilters] = useState(initialFilters);
    // Estado para la barra de búsqueda de cesionarios
    const [assigneeSearchQuery, setAssigneeSearchQuery] = useState('');
    // Estado para la lista de cesionarios filtrada. Se inicializa como un array vacío para evitar errores.
    const [filteredAssignees, setFilteredAssignees] = useState([]);

    // Sincroniza los filtros iniciales y los cesionarios cuando el modal se abre
    useEffect(() => {
        setTempFilters(initialFilters);
        setAssigneeSearchQuery('');
        // Usamos una verificación para asegurar que allAssignees es un array antes de usarlo.
        if (Array.isArray(allAssignees)) {
            setFilteredAssignees(allAssignees);
        } else {
            setFilteredAssignees([]);
        }
    }, [initialFilters, allAssignees]);

    // Filtra los cesionarios cada vez que cambia el texto de búsqueda
    useEffect(() => {
        if (assigneeSearchQuery && Array.isArray(allAssignees)) {
            const filtered = allAssignees.filter(assignee =>
                assignee.toLowerCase().includes(assigneeSearchQuery.toLowerCase())
            );
            setFilteredAssignees(filtered);
        } else if (Array.isArray(allAssignees)) {
            setFilteredAssignees(allAssignees);
        } else {
            setFilteredAssignees([]);
        }
    }, [assigneeSearchQuery, allAssignees]);

    const handleToggleFilter = (filterType, value) => {
        setTempFilters(prevFilters => {
            const newFilterArray = prevFilters[filterType].includes(value)
                ? prevFilters[filterType].filter(item => item !== value)
                : [...prevFilters[filterType], value];
            return { ...prevFilters, [filterType]: newFilterArray };
        });
    };

    const handleSliderChange = (min, max) => {
        setTempFilters(prevFilters => ({
            ...prevFilters,
            estimatedTime: { min, max },
        }));
    };

    const handleSaveFilters = () => {
        onApplyFilters(tempFilters);
    };

    const priorities = ['Alta', 'Media', 'Baja'];

    const renderFilterSection = (title, options, filterType) => (
        <View style={styles.filterSection}>
            <Text style={styles.sectionTitle}>{title}</Text>
            {/* Si el tipo de filtro es 'assignees', agregamos la barra de búsqueda */}
            {filterType === 'assignees' && (
                <TextInput
                    style={styles.searchBar}
                    placeholder="Buscar cesionarios..."
                    value={assigneeSearchQuery}
                    onChangeText={setAssigneeSearchQuery}
                />
            )}
            {/* Verificamos que las opciones sean un array antes de mapear para evitar el error. */}
            {Array.isArray(filterType === 'assignees' ? filteredAssignees : options) &&
                (filterType === 'assignees' ? filteredAssignees : options).map(option => {
                    const isSelected = tempFilters[filterType].includes(option);
                    return (
                        <TouchableOpacity
                            key={option}
                            style={styles.checkboxContainer}
                            onPress={() => handleToggleFilter(filterType, option)}
                        >
                            <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                                {isSelected && <Ionicons name="checkmark" size={16} color="#fff" />}
                            </View>
                            <Text style={styles.checkboxLabel}>{option}</Text>
                        </TouchableOpacity>
                    );
                })
            }
        </View>
    );

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <TouchableOpacity style={styles.modalOverlay} onPress={onClose} activeOpacity={1}>
                <TouchableWithoutFeedback>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Filtros</Text>
                            <TouchableOpacity onPress={onClose}>
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView>
                            {renderFilterSection('Prioridad', priorities, 'priorities')}
                            {renderFilterSection('Cesionario/a', allAssignees, 'assignees')}

                            {/* Sección de Tiempo Estimado */}
                            <View style={styles.filterSection}>
                                <Text style={styles.sectionTitle}>Tiempo Estimado (Días)</Text>
                                <View style={styles.sliderLabels}>
                                    <Text>{tempFilters.estimatedTime.min} días</Text>
                                    <Text>{tempFilters.estimatedTime.max === Infinity ? '∞' : `${tempFilters.estimatedTime.max} días`}</Text>
                                </View>
                                <Slider
                                    style={{ width: '100%' }}
                                    minimumValue={0}
                                    maximumValue={30}
                                    step={1}
                                    value={tempFilters.estimatedTime.max === Infinity ? 30 : tempFilters.estimatedTime.max}
                                    onSlidingComplete={(value) => handleSliderChange(0, value)}
                                    minimumTrackTintColor="#8B0000"
                                    maximumTrackTintColor="#ccc"
                                    thumbTintColor="#8B0000"
                                />
                            </View>
                        </ScrollView>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.saveButton} onPress={handleSaveFilters}>
                                <Text style={styles.saveButtonText}>Guardar Filtro</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: 300,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        elevation: 10,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    filterSection: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    searchBar: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    checkboxSelected: {
        backgroundColor: '#8B0000',
        borderColor: '#8B0000',
    },
    checkboxLabel: {
        fontSize: 14,
    },
    buttonContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    saveButton: {
        backgroundColor: '#8B0000',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    sliderLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
});

export default FilterModal;
