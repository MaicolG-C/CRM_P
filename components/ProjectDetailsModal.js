import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Datos de ejemplo para las imágenes de los cesionarios
const assigneeImages = {
    'Pedro Rojas': require('../assets/Pedro-Rojas.png'),
    'Melanie Duran': require('../assets/Melanie-Duran.png'),
    'Kevin Zapata': require('../assets/Kevin-Zapata.png'),
    'Patricia Irua': require('../assets/Patricia-Irua.png'),
};

const ProjectDetailsModal = ({ isVisible, onClose, project }) => {
    if (!project) {
        return null;
    }

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <TouchableOpacity style={styles.modalOverlay} onPress={onClose} activeOpacity={1}>
                {/* Usamos TouchableWithoutFeedback para evitar que los toques dentro del modal lo cierren */}
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <Text style={styles.projectId}>Número de Proyecto</Text>
                        <TouchableOpacity style={styles.editIcon}>
                            <Ionicons name="create-outline" size={24} color="#616161" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.projectNumber}>{project.id}</Text>

                    <View style={styles.infoSection}>
                        <Text style={styles.sectionTitle}>Descripción</Text>
                        <Text style={styles.descriptionText}>{project.description}</Text>
                    </View>

                    <View style={styles.infoSection}>
                        <Text style={styles.sectionTitle}>Reportero</Text>
                        <View style={styles.personRow}>
                            <Image source={assigneeImages[project.reporter]} style={styles.personImage} />
                            <Text style={styles.personName}>{project.reporter}</Text>
                        </View>
                    </View>

                    <View style={styles.infoSection}>
                        <Text style={styles.sectionTitle}>Cesionarios/as</Text>
                        <View style={styles.assigneesRow}>
                            {project.assignees.slice(0, 3).map((assignee, index) => (
                                <Image key={index} source={assigneeImages[assignee]} style={styles.assigneeImage} />
                            ))}
                            {project.assignees.length > 3 && (
                                <View style={styles.moreAssignees}>
                                    <Text style={styles.moreAssigneesText}>+{project.assignees.length - 3}</Text>
                                </View>
                            )}
                        </View>
                    </View>

                    <View style={styles.infoSection}>
                        <Text style={styles.sectionTitle}>Prioridad</Text>
                        <Text style={[styles.priorityText, styles.priorityMedium]}>{project.priority}</Text>
                    </View>
                    
                    <View style={styles.infoSection}>
                        <Text style={styles.sectionTitle}>fecha Límite</Text>
                        <Text style={styles.dateText}>{project.dueDate}</Text>
                    </View>

                    <View style={styles.dateInfoContainer}>
                        <Ionicons name="calendar-outline" size={16} color="#616161" />
                        <Text style={styles.dateInfoText}>Creado {project.creationDate}</Text>
                    </View>

                    <View style={styles.linksContainer}>
                        <Ionicons name="link-outline" size={24} color="#8B0000" style={styles.linkIcon} />
                        <Ionicons name="link-outline" size={24} color="#8B0000" style={styles.linkIcon} />
                    </View>
                </View>
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
        width: 350,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        elevation: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    projectId: {
        fontSize: 14,
        color: '#616161',
    },
    editIcon: {
        padding: 5,
    },
    projectNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    infoSection: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 14,
        color: '#616161',
        marginBottom: 5,
    },
    descriptionText: {
        fontSize: 16,
        lineHeight: 22,
    },
    personRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    personImage: {
        width: 24,
        height: 24,
        borderRadius: 12,
        marginRight: 8,
    },
    personName: {
        fontSize: 16,
    },
    assigneesRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    assigneeImage: {
        width: 24,
        height: 24,
        borderRadius: 12,
        marginRight: -8,
        borderWidth: 1,
        borderColor: '#fff',
    },
    moreAssignees: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,
    },
    moreAssigneesText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#616161',
    },
    priorityText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    priorityMedium: {
        color: 'orange',
    },
    dateText: {
        fontSize: 16,
    },
    dateInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    dateInfoText: {
        marginLeft: 5,
        color: '#616161',
    },
    linksContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    linkIcon: {
        marginRight: 10,
    },
});

export default ProjectDetailsModal;