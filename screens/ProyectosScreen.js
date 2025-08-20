import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image, Platform, TextInput, Modal, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FilterModal from '../components/FilterModal';

// Obtén las dimensiones de la pantalla para ajustar dinámicamente
const windowWidth = Dimensions.get('window').width;
const isSmallScreen = windowWidth < 768; // Punto de corte para la adaptación

// Datos de ejemplo para las imágenes de los cesionarios
const assigneeImages = {
    'Pedro Rojas': require('../assets/Pedro-Rojas.png'),
    'Melanie Duran': require('../assets/Melanie-Duran.png'),
    'Kevin Zapata': require('../assets/Kevin-Zapata.png'),
    'Patricia Irua': require('../assets/Patricia-Irua.png'),
    'Monica Argudo': require('../assets/Monica-Argudo.png'),
    'Maria Belen': require('../assets/Maria-Belen.png'),
};

// Componente para los iconos de la barra lateral
const NavIcon = ({ name, label, isSelected }) => (
    <TouchableOpacity style={[styles.navItem, isSelected && styles.navItemSelected]}>
        <Ionicons name={name} size={isSmallScreen ? 16 : 20} color={isSelected ? '#8B0000' : '#8B0000'} />
        <Text style={[styles.navItemText, isSelected && styles.navItemTextSelected]}>{label}</Text>
    </TouchableOpacity>
);

// Componente para las tarjetas de tareas del Kanban
const KanbanTaskCard = ({ task, onLongPress }) => (
    <TouchableOpacity
        style={styles.kanbanCard}
        onLongPress={() => onLongPress(task)}
    >
        <Text style={styles.kanbanTaskTitle}>{task.name}</Text>
        <Text style={styles.kanbanTaskId}>{`TS${task.id.toString().padStart(5, '0')}`}</Text>
        <View style={styles.kanbanCardFooter}>
            <Text style={styles.kanbanTaskValue}>{task.estimatedTime}</Text>
            <Image source={assigneeImages[task.assignee]} style={styles.userImageSmall} />
        </View>
    </TouchableOpacity>
);

// Componente para las tarjetas de tareas de la vista de lista
const TaskCard = ({ task, onHoverIn, onHoverOut }) => (
    <View style={styles.taskCard} onMouseEnter={() => onHoverIn(task)} onMouseLeave={onHoverOut}>
        <View style={styles.taskDetails}>
            <Text style={styles.taskLabel}>Nombre de la Tarea</Text>
            <Text style={styles.taskName}>{task.name}</Text>
        </View>
        <View style={styles.taskDetails}>
            <Text style={styles.taskLabel}>Tiempo Estimado</Text>
            <Text style={styles.taskValue}>{task.estimatedTime}</Text>
        </View>
        <View style={styles.taskDetails}>
            <Text style={styles.taskLabel}>Tiempo Pasado</Text>
            <Text style={styles.taskValue}>{task.timeSpent}</Text>
        </View>
        <View style={styles.taskDetails}>
            <Text style={styles.taskLabel}>Cesionario/a</Text>
            <Image source={assigneeImages[task.assignee]} style={styles.userImage} />
        </View>
        <View style={styles.taskDetails}>
            <Text style={styles.taskLabel}>Prioridad</Text>
            <View style={styles.priorityRow}>
                <Ionicons name={task.priority === 'Media' ? 'arrow-up' : 'arrow-down'} size={isSmallScreen ? 10 : 12} color={task.priority === 'Media' ? 'orange' : 'green'} />
                <Text style={[styles.taskValue, { color: task.priority === 'Media' ? 'orange' : 'green' }]}>{task.priority}</Text>
            </View>
        </View>
        <View style={styles.taskStatusContainer}>
            <Text style={[styles.taskStatus, { backgroundColor: task.statusColor, color: task.statusTextColor }]}>{task.status}</Text>
            <TouchableOpacity
                style={[
                    styles.taskSelectCircle,
                    {
                        backgroundColor: task.status === 'Hecho' ? '#8B0000' : '#E0E0E0',
                    },
                ]}>
                <Ionicons
                    name="checkmark"
                    size={isSmallScreen ? 14 : 16}
                    color={task.status === 'Hecho' ? 'white' : '#616161'}
                />
            </TouchableOpacity>
        </View>
    </View>
);

// Componente Modal para el menú de cambio de estado
const StatusMenu = ({ visible, onClose, onSelectStatus }) => {
    const statuses = ['Hacer', 'En Proceso', 'En Revisión', 'Hecho', 'Reserva'];

    const handleMenuPress = (e) => {
        if (Platform.OS === 'web') {
            e.stopPropagation();
        }
    };

    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <TouchableWithoutFeedback>
                    <View
                        style={styles.menuContainer}
                        onStartShouldSetResponder={() => true}
                        onTouchEnd={handleMenuPress}
                    >
                        <Text style={styles.menuTitle}>Cambiar estado a:</Text>
                        {statuses.map(status => (
                            <TouchableOpacity
                                key={status}
                                style={styles.menuItem}
                                onPress={() => {
                                    onSelectStatus(status);
                                    onClose();
                                }}
                            >
                                <Text style={styles.menuItemText}>{status}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableWithoutFeedback>
            </TouchableOpacity>
        </Modal>
    );
};

// Componente principal de la pantalla de proyectos
const ProyectosScreen = () => {
    const initialTasks = [
        { id: 1, name: 'Investigación', estimatedTime: '2d 4h', timeSpent: '1d 2h', priority: 'Media', status: 'Hecho', statusColor: '#c8e6c9', statusTextColor: '#1b5e20', assignee: 'Pedro Rojas' },
        { id: 2, name: 'Mapa Mental', estimatedTime: '1d 2h', timeSpent: '4h 25m', priority: 'Media', status: 'En Proceso', statusColor: '#e3f2fd', statusTextColor: '#0d47a1', assignee: 'Monica Argudo' },
        { id: 3, name: 'Bocetos de UX', estimatedTime: '4d', timeSpent: '2d 2h 20m', priority: 'Baja', status: 'En Proceso', statusColor: '#e3f2fd', statusTextColor: '#0d47a1', assignee: 'Melanie Duran' },
        { id: 4, name: 'Registro', estimatedTime: '2d', timeSpent: '3h 15m', priority: 'Baja', status: 'Hacer', statusColor: '#cfd8dc', statusTextColor: '#263238', assignee: 'Patricia Irua' },
        { id: 5, name: 'Registro', estimatedTime: '1d 4h', timeSpent: '0h', priority: 'Media', status: 'En Revisión', statusColor: '#fce4ec', statusTextColor: '#880e4f', assignee: 'Maria Belen' },
        { id: 6, name: 'Registro de Tarea', estimatedTime: '4d', timeSpent: '2d 2h 20m', priority: 'Baja', status: 'En Proceso', statusColor: '#e3f2fd', statusTextColor: '#0d47a1', assignee: 'Kevin Zapata' },
        { id: 7, name: 'Animación para los botones', estimatedTime: '6h', timeSpent: '0h', priority: 'Media', status: 'Reserva', statusColor: '#bdbdbd', statusTextColor: '#424242', assignee: 'Pedro Rojas' },
        { id: 8, name: 'Precargador', estimatedTime: '2d', timeSpent: '0h', priority: 'Baja', status: 'Reserva', statusColor: '#bdbdbd', statusTextColor: '#424242', assignee: 'Patricia Irua' },
    ];

    const initialProjects = [
        {
            id: 'PN0001245',
            name: 'App de Admisiones',
            description: 'Aplicación para gestionar el proceso de admisiones, desde el registro de aspirantes hasta la selección final, de forma rápida, segura y centralizada',
            reporter: 'Pedro Rojas',
            assignees: ['Pedro Rojas', 'Melanie Duran', 'Kevin Zapata', 'Patricia Irua'],
            priority: 'Media',
            dueDate: 'Ago 30, 2025',
            creationDate: 'Feb 28, 2025',
        },
        { id: 'PN0001246', name: 'Servicio de Mall...', description: 'Descripción de un proyecto de servicio', reporter: 'Melanie Duran', assignees: ['Melanie Duran', 'Kevin Zapata'], priority: 'Baja', dueDate: 'Sep 15, 2025', creationDate: 'Mar 10, 2025' },
        { id: 'PN0001247', name: 'Sitio Web del ITQ', description: 'Creación de un sitio web institucional', reporter: 'Kevin Zapata', assignees: ['Kevin Zapata', 'Patricia Irua'], priority: 'Alta', dueDate: 'Oct 01, 2025', creationDate: 'Abr 05, 2025' },
        { id: 'PN0001248', name: 'App de Planeación', description: 'Aplicación para planificar tareas y eventos', reporter: 'Patricia Irua', assignees: ['Patricia Irua', 'Pedro Rojas'], priority: 'Media', dueDate: 'Nov 12, 2025', creationDate: 'May 20, 2025' },
        { id: 'PN0001249', name: 'Rastreador de tiempo-', description: 'Desarrollo de una herramienta de seguimiento de tiempo', reporter: 'Pedro Rojas', assignees: ['Pedro Rojas', 'Melanie Duran'], priority: 'Media', dueDate: 'Ene 01, 2026', creationDate: 'Jun 25, 2025' },
        { id: 'PN0001250', name: 'Proyectos Internos', description: 'Gestión de proyectos internos de la empresa', reporter: 'Kevin Zapata', assignees: ['Kevin Zapata'], priority: 'Baja', dueDate: 'Feb 14, 2026', creationDate: 'Jul 18, 2025' },
    ];

    const [tasks, setTasks] = useState([]);
    const [viewMode, setViewMode] = useState('kanban');
    const [hoveredTask, setHoveredTask] = useState(null);
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
    const allAssignees = [...new Set(initialTasks.map(task => task.assignee))];

    const [selectedProject, setSelectedProject] = useState(null);
    const [projects, setProjects] = useState(initialProjects);

    const initialFilters = {
        workGroups: [],
        priorities: [],
        assignees: [],
        estimatedTime: { min: 0, max: Infinity },
    };

    const [appliedFilters, setAppliedFilters] = useState(initialFilters);

    useEffect(() => {
        const loadTasks = async () => {
            let storedTasks;
            if (Platform.OS === 'web') {
                storedTasks = localStorage.getItem('tasks');
            } else {
                storedTasks = await AsyncStorage.getItem('tasks');
            }
            if (storedTasks) {
                setTasks(JSON.parse(storedTasks));
            } else {
                setTasks(initialTasks);
            }
        };
        loadTasks();
    }, []);

    useEffect(() => {
        if (tasks.length > 0) {
            if (Platform.OS === 'web') {
                localStorage.setItem('tasks', JSON.stringify(tasks));
            } else {
                AsyncStorage.setItem('tasks', JSON.stringify(tasks)).catch(error => {
                    console.error('Error saving tasks to AsyncStorage:', error);
                });
            }
        }
    }, [tasks]);

    const statusStyles = {
        'Hacer': { color: '#cfd8dc', textColor: '#263238' },
        'En Proceso': { color: '#e3f2fd', textColor: '#0d47a1' },
        'En Revisión': { color: '#fce4ec', textColor: '#880e4f' },
        'Hecho': { color: '#c8e6c9', textColor: '#1b5e20' },
        'Reserva': { color: '#bdbdbd', textColor: '#424242' }
    };

    const handleStatusChange = (newStatus) => {
        if (!selectedTask) return;
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === selectedTask.id
                    ? {
                        ...task,
                        status: newStatus,
                        statusColor: statusStyles[newStatus].color,
                        statusTextColor: statusStyles[newStatus].textColor,
                    }
                    : task
            )
        );
        setIsMenuVisible(false);
        setSelectedTask(null);
    };

    const handleLongPress = (task) => {
        setSelectedTask(task);
        setIsMenuVisible(true);
    };

    const handleApplyFilters = (filters) => {
        setAppliedFilters(filters);
        setIsFilterModalVisible(false);
    };

    const handleResetFilters = () => {
        setAppliedFilters(initialFilters);
    };

    const areFiltersApplied = () => {
        return (
            appliedFilters.workGroups.length > 0 ||
            appliedFilters.priorities.length > 0 ||
            appliedFilters.assignees.length > 0 ||
            appliedFilters.estimatedTime.min !== initialFilters.estimatedTime.min ||
            appliedFilters.estimatedTime.max !== initialFilters.estimatedTime.max
        );
    };

    const convertTimeToHours = (timeString) => {
        if (!timeString) return 0;
        const parts = timeString.match(/(\d+)\s*d/);
        const days = parts ? parseInt(parts[1], 10) : 0;
        return days * 24;
    };

    const filteredTasks = tasks.filter(task => {
        const { workGroups = [], priorities = [], estimatedTime, assignees = [] } = appliedFilters;

        const noFiltersApplied =
            workGroups.length === 0 &&
            priorities.length === 0 &&
            assignees.length === 0 &&
            estimatedTime.min === 0 &&
            estimatedTime.max === Infinity;

        if (noFiltersApplied) {
            return true;
        }

        const taskEstimatedHours = convertTimeToHours(task.estimatedTime);

        const matchesWorkGroup = workGroups.length > 0 ? workGroups.includes(task.workGroup) : true;
        const matchesPriority = priorities.length > 0 ? priorities.includes(task.priority) : true;
        const matchesAssignee = assignees.length > 0 ? assignees.includes(task.assignee) : true;

        const matchesEstimatedTime =
            taskEstimatedHours >= estimatedTime.min &&
            taskEstimatedHours <= estimatedTime.max;

        return matchesWorkGroup && matchesPriority && matchesAssignee && matchesEstimatedTime;
    });

    const getFilteredTasksByStatus = (status) => {
        return filteredTasks.filter(task => task.status === status);
    };

    const getTaskDurationInDays = (estimatedTime) => {
        const timeParts = estimatedTime.match(/(\d+)\s*d/);
        return timeParts ? parseInt(timeParts[1], 10) : 1;
    };

    const handleViewDetails = (project) => {
        setSelectedProject(project);
    };

    const renderProjectDetails = () => (
        <View style={styles.detailsContainer}>
            <View style={styles.detailsHeader}>
                <TouchableOpacity onPress={() => setSelectedProject(null)} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#8B0000" />
                    <Text style={styles.backButtonText}>Volver</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.editIcon}>
                    <Ionicons name="create-outline" size={24} color="#616161" />
                </TouchableOpacity>
            </View>
            <Text style={styles.projectIdText}>Número de Proyecto</Text>
            <Text style={styles.projectNumberText}>{selectedProject.id}</Text>

            <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>Descripción</Text>
                <Text style={styles.descriptionText}>{selectedProject.description}</Text>
            </View>

            <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>Reportero</Text>
                <View style={styles.personRow}>
                    <Image source={assigneeImages[selectedProject.reporter]} style={styles.personImage} />
                    <Text style={styles.personName}>{selectedProject.reporter}</Text>
                </View>
            </View>

            <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>Cesionarios/as</Text>
                <View style={styles.assigneesRow}>
                    {selectedProject.assignees.slice(0, 3).map((assignee, index) => (
                        <Image key={index} source={assigneeImages[assignee]} style={styles.assigneeImage} />
                    ))}
                    {selectedProject.assignees.length > 3 && (
                        <View style={styles.moreAssignees}>
                            <Text style={styles.moreAssigneesText}>+{selectedProject.assignees.length - 3}</Text>
                        </View>
                    )}
                </View>
            </View>

            <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>Prioridad</Text>
                <Text style={[styles.priorityText, styles.priorityMedium]}>{selectedProject.priority}</Text>
            </View>

            <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>fecha Límite</Text>
                <Text style={styles.dateText}>{selectedProject.dueDate}</Text>
            </View>

            <View style={styles.dateInfoContainer}>
                <Ionicons name="calendar-outline" size={16} color="#616161" />
                <Text style={styles.dateInfoText}>Creado {selectedProject.creationDate}</Text>
            </View>

            <View style={styles.linksContainer}>
                <Ionicons name="link-outline" size={24} color="#8B0000" style={styles.linkIcon} />
                <Ionicons name="link-outline" size={24} color="#8B0000" style={styles.linkIcon} />
            </View>
        </View>
    );

    const renderKanbanColumns = () => {
        const statuses = ['Hacer', 'En Proceso', 'En Revisión', 'Hecho'];
        return (
            <View style={styles.kanbanActiveTasksContainer}>
                <Text style={styles.kanbanSectionTitle}>Tareas Activas</Text>
                <View style={[styles.kanbanActiveTasksColumns, isSmallScreen && styles.kanbanColumnsVertical]}>
                    {statuses.map(status => (
                        <View key={status} style={styles.kanbanColumn}>
                            <Text style={styles.kanbanColumnHeader}>{status}</Text>
                            <ScrollView style={styles.kanbanList}>
                                {getFilteredTasksByStatus(status).map(task => (
                                    <KanbanTaskCard
                                        key={task.id}
                                        task={task}
                                        onLongPress={handleLongPress}
                                    />
                                ))}
                            </ScrollView>
                        </View>
                    ))}
                </View>
            </View>
        );
    };

    const renderReserveSection = () => (
        <View style={styles.kanbanReserveContainer}>
            <Text style={styles.kanbanSectionTitle}>Reserva</Text>
            <View style={[styles.kanbanReserveCardsContainer, isSmallScreen && styles.kanbanReserveCardsVertical]}>
                {getFilteredTasksByStatus('Reserva').map(task => (
                    <KanbanTaskCard
                        key={task.id}
                        task={task}
                        onLongPress={handleLongPress}
                    />
                ))}
            </View>
        </View>
    );

    const calendarDays = 30;
    const daysArray = [...Array(calendarDays).keys()];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.wrapper}>
                <View style={styles.leftSection}>
                    <View style={styles.logoContainer}>
                        <Image source={require('../assets/Logo.png')} style={styles.logo} />
                    </View>
                    <View style={styles.navMenu}>
                        <NavIcon name="grid" label="Dashboard" />
                        <NavIcon name="folder" label="Proyectos" isSelected={true} />
                        <NavIcon name="calendar" label="Calendario" />
                        <NavIcon name="airplane" label="Leads" />
                        <NavIcon name="people" label="Empleados" />
                        <NavIcon name="chatbubbles" label="Mensajes" />
                        <NavIcon name="information-circle" label="Info Portal" />
                    </View>
                    <View style={styles.supportContainer}>
                        <Image source={require('../assets/Soporte.png')} style={styles.supportImage} />
                        <TouchableOpacity style={styles.supportButton}>
                            <Text style={styles.supportButtonText}>Soporte</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.logoutButton}>
                        <Ionicons name="log-out" size={20} color="#8B0000" />
                        <Text style={styles.logoutText}>Cerrar Sesión</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.rightSection}>
                    <View style={styles.header}>
                        <View style={[styles.searchBar, isSmallScreen && { width: 'auto', flex: 1 }]}>
                            <Ionicons name="search" size={20} color="#ccc" />
                            <TextInput style={styles.searchInput} placeholder="Buscar" />
                        </View>
                        <View style={styles.headerIcons}>
                            <Ionicons name="notifications-outline" size={24} color="#8B0000" style={styles.iconButton} />
                            <TouchableOpacity style={styles.userProfile}>
                                <Image source={assigneeImages['Pedro Rojas']} style={styles.profileImage} />
                                <Text style={styles.userName}>Pedro Rojas</Text>
                                <Ionicons name="chevron-down" size={16} color="#333" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.addButton}>
                                <Ionicons name="add" size={20} color="#fff" />
                                <Text style={styles.addButtonText}>Añadir Proyecto</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.contentArea}>
                        <View style={[styles.projectHeader, isSmallScreen && styles.projectHeaderVertical]}>
                            <Text style={[styles.mainTitle, isSmallScreen && { fontSize: 20 }]}>Proyectos</Text>
                            <View style={[styles.filterGroup, isSmallScreen && styles.filterGroupVertical]}>
                                <TouchableOpacity style={styles.filterButton}>
                                    <Text style={styles.filterText}>Proyectos Actuales</Text>
                                    <Ionicons name="chevron-down" size={16} color="#8B0000" />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.filterButton}>
                                    <Text style={styles.filterText}>tareas</Text>
                                    <Ionicons name="chevron-down" size={16} color="#8B0000" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={[styles.taskContentWrapper, isSmallScreen && styles.taskContentWrapperVertical]}>
                            <View style={[styles.projectsSidebar, isSmallScreen && styles.projectsSidebarSmall]}>
                                <ScrollView>
                                    {projects.map(project => (
                                        <TouchableOpacity
                                            key={project.id}
                                            style={[styles.projectItem, selectedProject && selectedProject.id === project.id && styles.projectItemSelected]}
                                            onPress={() => handleViewDetails(project)}
                                        >
                                            <Text style={styles.projectId}>{project.id}</Text>
                                            <Text style={[styles.projectName, isSmallScreen && { fontSize: 14 }]}>{project.name}</Text>
                                            <Text style={styles.viewDetails}>Ver Detalles</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>

                            {selectedProject ? (
                                renderProjectDetails()
                            ) : (
                                <View style={styles.tasksContainer}>
                                    <View style={styles.tasksHeader}>
                                        <Text style={[styles.tasksTitle, isSmallScreen && { fontSize: 16 }]}>tareas</Text>
                                        <View style={styles.tasksHeaderIcons}>
                                            <TouchableOpacity onPress={() => setViewMode('list')} style={viewMode === 'list' && styles.viewButtonActive}>
                                                <Feather name="list" size={isSmallScreen ? 16 : 20} color={viewMode === 'list' ? '#8B0000' : '#333'} style={styles.taskIcon} />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => setViewMode('kanban')} style={viewMode === 'kanban' && styles.viewButtonActive}>
                                                <Feather name="columns" size={isSmallScreen ? 16 : 20} color={viewMode === 'kanban' ? '#8B0000' : '#333'} style={styles.taskIcon} />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => setViewMode('calendar')} style={viewMode === 'calendar' && styles.viewButtonActive}>
                                                <Feather name="calendar" size={isSmallScreen ? 16 : 20} color={viewMode === 'calendar' ? '#8B0000' : '#333'} style={styles.taskIcon} />
                                            </TouchableOpacity>
                                            {areFiltersApplied() && (
                                                <TouchableOpacity onPress={handleResetFilters}>
                                                    <Feather name="refresh-ccw" size={isSmallScreen ? 16 : 20} color="#8B0000" style={styles.taskIcon} />
                                                </TouchableOpacity>
                                            )}
                                            <TouchableOpacity onPress={() => setIsFilterModalVisible(true)}>
                                                <Feather name="filter" size={isSmallScreen ? 16 : 20} color="#8B0000" style={styles.taskIcon} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    {viewMode === 'list' && (
                                        <ScrollView style={styles.taskList}>
                                            <View style={styles.taskSectionTitleContainer}>
                                                <Text style={styles.taskSectionTitle}>Tareas Activas</Text>
                                            </View>
                                            {filteredTasks.filter(t => t.status !== 'Reserva').map(task => (
                                                <TaskCard key={task.id} task={task} onHoverIn={setHoveredTask} onHoverOut={() => setHoveredTask(null)} />
                                            ))}
                                            <View style={styles.taskSectionTitleContainer}>
                                                <Text style={styles.taskSectionTitle}>Reserva</Text>
                                            </View>
                                            {filteredTasks.filter(t => t.status === 'Reserva').map(task => (
                                                <TaskCard key={task.id} task={task} onHoverIn={setHoveredTask} onHoverOut={() => setHoveredTask(null)} />
                                            ))}
                                        </ScrollView>
                                    )}

                                    {viewMode === 'kanban' && (
                                        <ScrollView contentContainerStyle={styles.kanbanScrollView}>
                                            {renderKanbanColumns()}
                                            {renderReserveSection()}
                                        </ScrollView>
                                    )}

                                    {viewMode === 'calendar' && (
                                        <ScrollView horizontal style={styles.calendarContainer}>
                                            <View style={styles.calendarGrid}>
                                                <View style={styles.calendarHeaderRow}>
                                                    <Text style={styles.calendarHeaderCell}>Tarea</Text>
                                                    <View style={styles.calendarDaysRow}>
                                                        {daysArray.map(i => (
                                                            <Text key={i} style={styles.calendarDayCell}>{i + 1}</Text>
                                                        ))}
                                                    </View>
                                                </View>
                                                {filteredTasks.map(task => (
                                                    <View key={task.id} style={styles.calendarTaskRow}>
                                                        <Text style={styles.calendarTaskCell}>{task.name}</Text>
                                                        <View style={styles.calendarDaysRow}>
                                                            <View style={[styles.calendarTaskBar, { width: getTaskDurationInDays(task.estimatedTime) * 30 }]}></View>
                                                        </View>
                                                    </View>
                                                ))}
                                            </View>
                                        </ScrollView>
                                    )}
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            </View>

            {Platform.OS === 'web' && hoveredTask && (
                <View style={styles.tooltip}>
                    <Text style={styles.tooltipTitle}>Cesionario/a</Text>
                    <View style={styles.tooltipRow}>
                        <Image source={assigneeImages[hoveredTask.assignee]} style={styles.tooltipImage} />
                        <Text style={styles.tooltipText}>{hoveredTask.assignee}</Text>
                    </View>
                </View>
            )}

            <StatusMenu
                visible={isMenuVisible}
                onClose={() => setIsMenuVisible(false)}
                onSelectStatus={handleStatusChange}
            />
            <FilterModal
                isVisible={isFilterModalVisible}
                onClose={() => setIsFilterModalVisible(false)}
                onApplyFilters={handleApplyFilters}
                initialFilters={appliedFilters}
                allAssignees={allAssignees}
            />
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    wrapper: {
        flex: 1,
        flexDirection: 'row',
    },
    leftSection: {
        width: 250,
        backgroundColor: '#fff',
        paddingVertical: 20,
        paddingHorizontal: 15,
        alignItems: 'center',
        borderRightWidth: 1,
        borderRightColor: '#eee',
    },
    logoContainer: {
        marginBottom: 30,
        alignSelf: 'flex-start',
        paddingLeft: 10,
    },
    logo: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    navMenu: {
        width: '100%',
        marginBottom: 30,
    },
    navItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginBottom: 5,
    },
    navItemSelected: {
        backgroundColor: '#f5f5f5',
    },
    navItemText: {
        marginLeft: 10,
        fontSize: 14,
        fontWeight: '500',
        color: '#8B0000',
    },
    navItemTextSelected: {
        fontWeight: 'bold',
    },
    supportContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    supportImage: {
        width: 120,
        height: 120,
        resizeMode: 'contain',
    },
    supportButton: {
        backgroundColor: '#8B0000',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginTop: 10,
    },
    supportButtonText: {
        color: '#fff',
        fontSize: 12,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#8B0000',
    },
    logoutText: {
        marginLeft: 10,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#8B0000',
    },
    rightSection: {
        flex: 1,
        paddingHorizontal: 30,
        paddingTop: 20,
        backgroundColor: '#f9f9f9',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        width: 300,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    searchInput: {
        marginLeft: 10,
        flex: 1,
    },
    headerIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        marginRight: 20,
    },
    userProfile: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
    },
    profileImage: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 8,
    },
    userName: {
        fontSize: 14,
        fontWeight: 'bold',
        marginRight: 5,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#8B0000',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
    },
    addButtonText: {
        color: '#fff',
        marginLeft: 5,
    },
    contentArea: {
        flex: 1,
    },
    projectHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    mainTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    filterGroup: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#8B0000',
        marginLeft: 10,
    },
    filterText: {
        color: '#8B0000',
        marginRight: 5,
    },
    taskContentWrapper: {
        flex: 1,
        flexDirection: 'row',
    },
    projectsSidebar: {
        width: 250,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        marginRight: 20,
    },
    projectItem: {
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    projectItemSelected: {
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
    },
    projectId: {
        fontSize: 12,
        color: '#999',
    },
    projectName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 5,
    },
    viewDetails: {
        color: '#8B0000',
        marginTop: 5,
        fontSize: 12,
    },
    tasksContainer: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
    },
    tasksHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    tasksTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    tasksHeaderIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    taskIcon: {
        marginLeft: 15,
    },
    viewButtonActive: {
        backgroundColor: '#fbe9e7',
        padding: 5,
        borderRadius: 5,
    },
    // Estilos para la vista de lista de tareas
    taskList: {
        flex: 1,
    },
    taskCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#eee',
        // Estilos de sombra para web
        ...(Platform.OS === 'web' && {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 3,
        }),
    },
    taskDetails: {
        flex: 1,
        marginRight: 10,
    },
    taskLabel: {
        fontSize: 12,
        color: '#999',
    },
    taskName: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    taskValue: {
        fontSize: 14,
    },
    userImage: {
        width: 24,
        height: 24,
        borderRadius: 12,
    },
    userImageSmall: {
        width: 20,
        height: 20,
        borderRadius: 10,
    },
    priorityRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    taskStatusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    taskStatus: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 20,
        fontSize: 12,
        marginRight: 10,
    },
    taskSelectCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tooltip: {
        position: 'absolute',
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 1000,
        right: 300,
        top: 200,
    },
    tooltipTitle: {
        fontSize: 12,
        color: '#666',
        marginBottom: 5,
    },
    tooltipRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    tooltipImage: {
        width: 20,
        height: 20,
        borderRadius: 10,
        marginRight: 5,
    },
    tooltipText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        width: 150,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    menuTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    menuItem: {
        paddingVertical: 8,
    },
    menuItemText: {
        fontSize: 14,
    },
    kanbanScrollView: {
        flexDirection: 'column',
        paddingVertical: 10,
        paddingHorizontal: 5,
    },
    kanbanActiveTasksContainer: {
        width: '100%',
        marginBottom: 20, // Agregado para separar las secciones
    },
    kanbanReserveContainer: {
        width: '100%',
    },
    kanbanSectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    kanbanActiveTasksColumns: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
    },
    kanbanColumn: {
        flex: 1,
        marginHorizontal: 5,
    },
    kanbanColumnHeader: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    kanbanList: {
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        padding: 10,
        minHeight: 200,
    },
    kanbanCard: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        ...(Platform.OS === 'web' && {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 3,
        }),
    },
    kanbanTaskTitle: {
        fontWeight: 'bold',
    },
    kanbanTaskId: {
        fontSize: 12,
        color: '#999',
    },
    kanbanCardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 5,
    },
    kanbanTaskValue: {
        fontSize: 12,
    },
    kanbanReserveCardsContainer: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        padding: 10,
        minHeight: 200,
    },
    calendarContainer: {
        flex: 1,
    },
    calendarGrid: {
        flexDirection: 'column',
    },
    calendarHeaderRow: {
        flexDirection: 'row',
    },
    calendarHeaderCell: {
        width: 150,
        padding: 10,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    calendarDaysRow: {
        flexDirection: 'row',
    },
    calendarDayCell: {
        width: 30,
        textAlign: 'center',
        padding: 5,
    },
    calendarTaskRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    calendarTaskCell: {
        width: 150,
        padding: 10,
        borderWidth: 1,
        borderColor: '#eee',
        backgroundColor: '#fff',
    },
    calendarTaskBar: {
        height: 20,
        backgroundColor: '#8B0000',
        borderRadius: 5,
        marginVertical: 5,
        marginLeft: 10,
    },
    // Estilos de la vista de detalles del proyecto
    detailsContainer: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
    },
    detailsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButtonText: {
        marginLeft: 5,
        color: '#8B0000',
    },
    editIcon: {
        padding: 5,
    },
    projectIdText: {
        fontSize: 14,
        color: '#616161',
    },
    projectNumberText: {
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

export default ProyectosScreen;