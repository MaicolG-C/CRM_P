import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image, Platform, TextInput } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

// Componente para los iconos de la barra lateral
const NavIcon = ({ name, label, isSelected }) => (
    <TouchableOpacity style={[styles.navItem, isSelected && styles.navItemSelected]}>
        <Ionicons name={name} size={20} color={isSelected ? '#8B0000' : '#8B0000'} />
        <Text style={[styles.navItemText, isSelected && styles.navItemTextSelected]}>{label}</Text>
    </TouchableOpacity>
);

// Componente para las tarjetas de tareas del Kanban
const KanbanTaskCard = ({ task, onDragStart, onDragEnd }) => (
    <View
        style={[
            styles.kanbanCard,
            task.isDragging && styles.draggingCard
        ]}
        draggable
        onDragStart={(e) => onDragStart(e, task)}
        onDragEnd={onDragEnd}
    >
        <Text style={styles.kanbanTaskTitle}>{task.name}</Text>
        <Text style={styles.kanbanTaskId}>{`TS${task.id.toString().padStart(5, '0')}`}</Text>
        <View style={styles.kanbanCardFooter}>
            <Text style={styles.kanbanTaskValue}>{task.estimatedTime}</Text>
            <Image source={task.assigneeImage} style={styles.userImageSmall} />
        </View>
    </View>
);

const ProyectosScreen = () => {
    const [viewMode, setViewMode] = useState('kanban');
    const [hoveredTask, setHoveredTask] = useState(null);
    const [draggedTask, setDraggedTask] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [activeColumns, setActiveColumns] = useState({
        'Hacer': true,
        'En Proceso': true,
        'En Revisión': true,
        'Hecho': true,
        'Reserva': true
    });

    // Estado inicial de las tareas
    const [tasks, setTasks] = useState([
        { id: 1, name: 'Investigación', estimatedTime: '2d 4h', timeSpent: '1d 2h', priority: 'Media', status: 'Hecho', statusColor: '#c8e6c9', statusTextColor: '#1b5e20', assignee: 'Pedro Rojas', assigneeImage: require('../assets/Pedro-Rojas.png') },
        { id: 2, name: 'Mapa Mental', estimatedTime: '1d 2h', timeSpent: '4h 25m', priority: 'Media', status: 'En Proceso', statusColor: '#e3f2fd', statusTextColor: '#0d47a1', assignee: 'Monica Argudo', assigneeImage: require('../assets/Monica-Argudo.png') },
        { id: 3, name: 'Bocetos de UX', estimatedTime: '4d', timeSpent: '2d 2h 20m', priority: 'Baja', status: 'En Proceso', statusColor: '#e3f2fd', statusTextColor: '#0d47a1', assignee: 'Melanie Duran', assigneeImage: require('../assets/Melanie-Duran.png') },
        { id: 4, name: ' Registro', estimatedTime: '2d', timeSpent: '3h 15m', priority: 'Baja', status: 'Hacer', statusColor: '#cfd8dc', statusTextColor: '#263238', assignee: 'Patricia Irua', assigneeImage: require('../assets/Patricia-Irua.png') },
        { id: 5, name: ' Registro', estimatedTime: '1d 4h', timeSpent: '0h', priority: 'Media', status: 'En Revisión', statusColor: '#fce4ec', statusTextColor: '#880e4f', assignee: 'Maria Belen', assigneeImage: require('../assets/Maria-Belen.png') },
        { id: 6, name: 'Registro de Tarea', estimatedTime: '4d', timeSpent: '2d 2h 20m', priority: 'Baja', status: 'En Proceso', statusColor: '#e3f2fd', statusTextColor: '#0d47a1', assignee: 'Kevin Zapata', assigneeImage: require('../assets/Kevin-Zapata.png') },
        { id: 7, name: 'Animación para los botones', estimatedTime: '6h', timeSpent: '0h', priority: 'Media', status: 'Reserva', statusColor: '#bdbdbd', statusTextColor: '#424242', assignee: 'Pedro Rojas', assigneeImage: require('../assets/Pedro-Rojas.png') },
        { id: 8, name: 'Precargador', estimatedTime: '2d', timeSpent: '0h', priority: 'Baja', status: 'Reserva', statusColor: '#bdbdbd', statusTextColor: '#424242', assignee: 'Patricia Irua', assigneeImage: require('../assets/Patricia-Irua.png') },
    ]);

    // Mapeo de estilos por estado
    const statusStyles = {
        'Hacer': { color: '#cfd8dc', textColor: '#263238' },
        'En Proceso': { color: '#e3f2fd', textColor: '#0d47a1' },
        'En Revisión': { color: '#fce4ec', textColor: '#880e4f' },
        'Hecho': { color: '#c8e6c9', textColor: '#1b5e20' },
        'Reserva': { color: '#bdbdbd', textColor: '#424242' }
    };

    // Maneja el inicio del arrastre
    const handleDragStart = (e, task) => {
        e.dataTransfer.setData('taskId', task.id.toString());
        setDraggedTask(task);
        setIsDragging(true);
        
        // Actualiza la tarea para marcarla como "arrastrando"
        setTasks(prevTasks => 
            prevTasks.map(t => 
                t.id === task.id ? { ...t, isDragging: true } : t
            )
        );
        
        // Efecto visual opcional
        if (e.target.style) {
            e.target.style.opacity = '0.5';
        }
    };

    // Maneja el soltar la tarea
    const handleDrop = (e, newStatus) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('taskId');
        
        if (!taskId) return;

        // Actualiza la tarea con el nuevo estado
        setTasks(prevTasks => 
            prevTasks.map(task => 
                task.id === parseInt(taskId)
                    ? {
                        ...task,
                        status: newStatus,
                        statusColor: statusStyles[newStatus].color,
                        statusTextColor: statusStyles[newStatus].textColor,
                        isDragging: false
                    }
                    : task
            )
        );
        
        // Restablece los estados
        setIsDragging(false);
        setDraggedTask(null);
        
        // Restablece el estilo de la columna
        if (e.currentTarget.style) {
            e.currentTarget.style.backgroundColor = '';
        }
    };

    // Permite soltar la tarea
    const allowDrop = (e) => {
        e.preventDefault();
        
        // Efecto visual al pasar sobre una columna
        if (isDragging && e.currentTarget.style) {
            e.currentTarget.style.backgroundColor = '#f5f5f5';
        }
    };

    // Restablece los estilos al salir de una columna
    const handleDragLeave = (e) => {
        if (e.currentTarget.style) {
            e.currentTarget.style.backgroundColor = '';
        }
    };

    // Restablece la opacidad al finalizar el arrastre
    const handleDragEnd = (e) => {
        setIsDragging(false);
        setDraggedTask(null);
        
        // Restablece el estado de arrastre para todas las tareas
        setTasks(prevTasks => 
            prevTasks.map(task => ({ ...task, isDragging: false }))
        );
        
        if (e.target.style) {
            e.target.style.opacity = '1';
        }
    };

    // Filtra tareas por estado
    const getFilteredTasksByStatus = (status) => {
        return tasks.filter(task => task.status === status && activeColumns[status]);
    };

    // Renderiza las columnas del Kanban
    const renderKanbanColumns = () => {
        const statuses = ['Hacer', 'En Proceso', 'En Revisión', 'Hecho'];
        
        return (
            <View style={styles.kanbanActiveTasksContainer}>
                <Text style={styles.kanbanSectionTitle}>Tareas Activas</Text>
                <View style={styles.kanbanActiveTasksColumns}>
                    {statuses.map(status => (
                        activeColumns[status] && (
                            <View
                                key={status}
                                style={styles.kanbanColumn}
                                onDragOver={allowDrop}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, status)}
                            >
                                <Text style={styles.kanbanColumnHeader}>{status}</Text>
                                <ScrollView style={styles.kanbanList}>
                                    {getFilteredTasksByStatus(status).map(task => (
                                        <KanbanTaskCard
                                            key={task.id}
                                            task={task}
                                            onDragStart={handleDragStart}
                                            onDragEnd={handleDragEnd}
                                        />
                                    ))}
                                </ScrollView>
                            </View>
                        )
                    ))}
                </View>
            </View>
        );
    };

    // Renderiza la sección de reserva
    const renderReserveSection = () => (
        activeColumns['Reserva'] && (
            <View 
                style={styles.kanbanReserveContainer}
                onDragOver={allowDrop}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, 'Reserva')}
            >
                <Text style={styles.kanbanSectionTitle}>Reserva</Text>
                <View style={styles.kanbanReserveCardsContainer}>
                    {getFilteredTasksByStatus('Reserva').map(task => (
                        <KanbanTaskCard
                            key={task.id}
                            task={task}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                        />
                    ))}
                </View>
            </View>
        )
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.wrapper}>
                <View style={styles.leftSection}>
                    <View style={styles.logoContainer}>
                        <Image source={require('../assets/Logo.png')} style={styles.logo} />
                    </View>
                    <View style={styles.navMenu}>
                        <NavIcon name="grid" label="Dashboard" isSelected={true} />
                        <NavIcon name="folder" label="Proyectos" />
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
                        <View style={styles.searchBar}>
                            <Ionicons name="search" size={20} color="#ccc" />
                            <TextInput style={styles.searchInput} placeholder="Buscar" />
                        </View>
                        <View style={styles.headerIcons}>
                            <Ionicons name="notifications-outline" size={24} color="#8B0000" style={styles.iconButton} />
                            <TouchableOpacity style={styles.userProfile}>
                                <Image source={require('../assets/Pedro-Rojas.png')} style={styles.profileImage} />
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
                        <View style={styles.projectHeader}>
                            <Text style={styles.mainTitle}>Proyectos</Text>
                            <View style={styles.filterGroup}>
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

                        <View style={styles.taskContentWrapper}>
                            <View style={styles.projectsSidebar}>
                                <ScrollView>
                                    <View style={styles.projectItem}>
                                        <Text style={styles.projectId}>PN0001245</Text>
                                        <Text style={styles.projectName}>App de Admisiones</Text>
                                        <TouchableOpacity>
                                            <Text style={styles.viewDetails}>Ver Detalles</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.projectItem}>
                                        <Text style={styles.projectId}>PN0001245</Text>
                                        <Text style={styles.projectName}>Servicio de... Mall...</Text>
                                    </View>
                                    <View style={styles.projectItem}>
                                        <Text style={styles.projectId}>PN0001245</Text>
                                        <Text style={styles.projectName}>Sitio Web del ITQ</Text>
                                    </View>
                                    <View style={styles.projectItem}>
                                        <Text style={styles.projectId}>PN0001245</Text>
                                        <Text style={styles.projectName}>App de Planeación</Text>
                                    </View>
                                    <View style={styles.projectItem}>
                                        <Text style={styles.projectId}>PN0001245</Text>
                                        <Text style={styles.projectName}>Rastreador de tiempo...</Text>
                                    </View>
                                    <View style={styles.projectItem}>
                                        <Text style={styles.projectId}>PN0001245</Text>
                                        <Text style={styles.projectName}>Proyectos Internos</Text>
                                    </View>
                                </ScrollView>
                            </View>

                            <View style={styles.tasksContainer}>
                                <View style={styles.tasksHeader}>
                                    <Text style={styles.tasksTitle}>tareas</Text>
                                    <View style={styles.tasksHeaderIcons}>
                                        <TouchableOpacity onPress={() => setViewMode('list')} style={viewMode === 'list' && styles.viewButtonActive}>
                                            <Feather name="list" size={20} color={viewMode === 'list' ? '#8B0000' : '#333'} style={styles.taskIcon} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => setViewMode('kanban')} style={viewMode === 'kanban' && styles.viewButtonActive}>
                                            <Feather name="columns" size={20} color={viewMode === 'kanban' ? '#8B0000' : '#333'} style={styles.taskIcon} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => setViewMode('calendar')} style={viewMode === 'calendar' && styles.viewButtonActive}>
                                            <Feather name="calendar" size={20} color={viewMode === 'calendar' ? '#8B0000' : '#333'} style={styles.taskIcon} />
                                        </TouchableOpacity>
                                        <Feather name="filter" size={20} color="#8B0000" style={styles.taskIcon} />
                                    </View>
                                </View>

                                {viewMode === 'list' && (
                                    <ScrollView style={styles.taskList}>
                                        <View style={styles.taskSectionTitleContainer}>
                                            <Text style={styles.taskSectionTitle}>Tareas Activas</Text>
                                        </View>
                                        {tasks.filter(t => t.status !== 'Reserva').map(task => (
                                            <TaskCard key={task.id} task={task} onHoverIn={setHoveredTask} onHoverOut={() => setHoveredTask(null)} />
                                        ))}
                                        <View style={styles.taskSectionTitleContainer}>
                                            <Text style={styles.taskSectionTitle}>Reserva</Text>
                                        </View>
                                        {tasks.filter(t => t.status === 'Reserva').map(task => (
                                            <TaskCard key={task.id} task={task} onHoverIn={setHoveredTask} onHoverOut={() => setHoveredTask(null)} />
                                        ))}
                                    </ScrollView>
                                )}

                                {viewMode === 'kanban' && (
                                    <ScrollView contentContainerStyle={styles.kanbanScrollView}>
                                        {/* Contenedor de "Tareas Activas" */}
                                        <View style={styles.kanbanActiveTasksContainer}>
                                            <Text style={styles.kanbanSectionTitle}>Tareas Activas</Text>
                                            <View style={styles.kanbanActiveTasksColumns}>
                                                {['Hacer', 'En Proceso', 'En Revisión', 'Hecho'].map(status => (
                                                    <View
                                                        key={status}
                                                        style={styles.kanbanColumn}
                                                        onDragOver={allowDrop}
                                                        onDrop={(e) => handleDrop(e, status)}
                                                    >
                                                        <Text style={styles.kanbanColumnHeader}>{status}</Text>
                                                        <ScrollView style={styles.kanbanList}>
                                                            {getFilteredTasksByStatus(status).map(task => (
                                                                <View
                                                                    key={task.id}
                                                                    style={styles.kanbanCard}
                                                                    draggable
                                                                    onDragStart={(e) => handleDragStart(e, task.id)}
                                                                >
                                                                    <Text style={styles.kanbanTaskTitle}>{task.name}</Text>
                                                                    <Text style={styles.kanbanTaskId}>{`TS${task.id.toString().padStart(5, '0')}`}</Text>
                                                                    <View style={styles.kanbanCardFooter}>
                                                                        <Text style={styles.kanbanTaskValue}>{task.estimatedTime}</Text>
                                                                        <Image source={task.assigneeImage} style={styles.userImageSmall} />
                                                                    </View>
                                                                </View>
                                                            ))}
                                                        </ScrollView>
                                                    </View>
                                                ))}
                                            </View>
                                        </View>

                                        {/* Contenedor de "Reserva" - Ahora debajo de las columnas principales */}
                                        <View style={styles.kanbanReserveContainer}>
                                            <Text style={styles.kanbanSectionTitle}>Reserva</Text>
                                            <View style={styles.kanbanReserveCardsContainer}>
                                                {getFilteredTasksByStatus('Reserva').map(task => (
                                                    <View
                                                        key={task.id}
                                                        style={styles.kanbanReserveCard}
                                                        draggable
                                                        onDragStart={(e) => handleDragStart(e, task.id)}
                                                    >
                                                        <Text style={styles.kanbanTaskTitle}>{task.name}</Text>
                                                        <Text style={styles.kanbanTaskId}>{`TS${task.id.toString().padStart(5, '0')}`}</Text>
                                                        <View style={styles.kanbanReserveCardFooter}>
                                                            <Text style={styles.kanbanTaskValue}>{task.estimatedTime}</Text>
                                                            <Image source={task.assigneeImage} style={styles.userImageSmall} />
                                                        </View>
                                                    </View>
                                                ))}
                                            </View>
                                        </View>
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
                                            {tasks.map(task => (
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
                        </View>
                    </View>
                </View>
            </View>

            {/* Tooltip flotante para el encargado */}
            {Platform.OS === 'web' && hoveredTask && (
                <View style={styles.tooltip}>
                    <Text style={styles.tooltipTitle}>Cesionario/a</Text>
                    <View style={styles.tooltipRow}>
                        <Image source={hoveredTask.assigneeImage} style={styles.tooltipImage} />
                        <Text style={styles.tooltipText}>{hoveredTask.assignee}</Text>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    wrapper: { flexDirection: Platform.OS === 'web' ? 'row' : 'column', width: '100%', height: Platform.OS === 'web' ? '100vh' : '100%', backgroundColor: '#f5f7fa' },
    leftSection: { flexDirection: 'column', maxWidth: 250, backgroundColor: '#fff', alignItems: 'center', paddingVertical: 20, shadowColor: '#000', shadowOffset: { width: 2, height: 0 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 5 },
    rightSection: { flex: 1, flexDirection: 'column', paddingHorizontal: 30, paddingTop: 30, backgroundColor: '#f5f7fa' },
    logoContainer: { marginBottom: 40 },
    logo: { width: 100, height: 60 },
    navMenu: { width: '100%' },
    navItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingLeft: 30, borderLeftWidth: 3, borderLeftColor: 'transparent' },
    navItemSelected: { backgroundColor: '#fce4ec', borderLeftColor: '#8B0000' },
    navItemText: { marginLeft: 15, fontSize: 16, color: '#333', fontWeight: '600' },
    navItemTextSelected: { color: '#8B0000', fontWeight: 'bold' },
    supportContainer: { alignItems: 'center', marginTop: 'auto', marginBottom: 20, padding: 10, backgroundColor: '#fff', borderRadius: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
    supportImage: { width: 80, height: 80, marginBottom: 10 },
    supportButton: { backgroundColor: '#8B0000', borderRadius: 8, paddingHorizontal: 20, paddingVertical: 10 },
    supportButtonText: { color: '#fff', fontWeight: 'bold' },
    logoutButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, paddingLeft: 30 },
    logoutText: { marginLeft: 15, fontSize: 16, color: '#8B0000' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#eef2f5', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 8, flex: 1, marginRight: 20, maxWidth: 400 },
    searchInput: { flex: 1, marginLeft: 10, fontSize: 16, color: '#333' },
    headerIcons: { flexDirection: 'row', alignItems: 'center', gap: 15 },
    iconButton: { padding: 5, borderRadius: 20 },
    userProfile: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    profileImage: { width: 32, height: 32, borderRadius: 16 },
    userName: { fontSize: 16, fontWeight: 'bold' },
    addButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#8B0000', borderRadius: 8, paddingHorizontal: 15, paddingVertical: 10 },
    addButtonText: { color: '#fff', marginLeft: 5, fontWeight: 'bold' },
    contentArea: { flex: 1, backgroundColor: '#fff', borderRadius: 10, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 5 },
    mainTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    projectHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    filterGroup: { flexDirection: 'row', gap: 15 },
    filterButton: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
    filterText: { marginRight: 5, color: '#8B0000', fontWeight: '600' },
    taskContentWrapper: { flexDirection: Platform.OS === 'web' ? 'row' : 'column', flex: 1, gap: 20 },
    projectsSidebar: { maxWidth: 200, minWidth: 180, backgroundColor: '#f8f9fa', borderRadius: 10, padding: 15 },
    projectItem: { marginBottom: 15, padding: 10, borderRadius: 8, backgroundColor: '#fff', borderLeftWidth: 3, borderLeftColor: 'transparent' },
    projectId: { fontSize: 12, color: '#888' },
    projectName: { fontWeight: 'bold', fontSize: 16, color: '#333' },
    viewDetails: { color: '#8B0000', fontWeight: 'bold', marginTop: 5 },
    tasksContainer: { flex: 1 },
    tasksHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    tasksTitle: { fontSize: 22, fontWeight: 'bold' },
    tasksHeaderIcons: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    taskIcon: { padding: 5 },
    viewButtonActive: {
        backgroundColor: '#fce4ec',
        borderRadius: 5,
        padding: 5,
    },
    taskList: { flex: 1 },
    taskSectionTitleContainer: { backgroundColor: '#f0f4f7', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8, marginBottom: 10 },
    taskSectionTitle: { fontWeight: 'bold', fontSize: 16, color: '#555', alignItems: 'center' },
    taskCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 10, padding: 15, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2, alignItems: 'center', justifyContent: 'space-between' },
    taskDetails: { flexDirection: 'column', marginRight: 20 },
    taskLabel: { fontSize: 12, color: '#888', marginBottom: 4 },
    taskName: { fontWeight: 'bold', fontSize: 14, color: '#333' },
    taskValue: { fontSize: 14, color: '#333' },
    userImage: { width: 32, height: 32, borderRadius: 16 },
    priorityRow: { flexDirection: 'row', alignItems: 'center' },
    taskStatusContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    taskStatus: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, fontWeight: 'bold', fontSize: 12 },
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
        borderRadius: 8,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 8,
        zIndex: 100,
        top: '50%',
        left: '50%',
        transform: [{ translateX: -100 }, { translateY: -50 }],
    },
    tooltipTitle: { fontWeight: 'bold', marginBottom: 10 },
    tooltipRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    tooltipImage: { width: 40, height: 40, borderRadius: 20 },
    tooltipText: { fontSize: 16 },

    // Estilos para la vista de Kanban
    kanbanScrollView: {
        flexGrow: 1,
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: '#fff', // Fondo del área de tareas en blanco
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    kanbanActiveTasksContainer: {
        flex: 1,
        flexDirection: 'column',
        marginRight: 20,
    },
    kanbanActiveTasksColumns: {
        flexDirection: 'row',
        flex: 1, // Permite que las columnas ocupen el espacio disponible
    },
    kanbanColumn: {
        minWidth: 260,
        flex: 1, // Para que las columnas se distribuyan uniformemente
        padding: 15,
        marginRight: 15, // Espacio entre columnas
        backgroundColor: '#fff', // Fondo de la columna en blanco
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E6E8EA',
    },
    kanbanColumnHeader: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 15,
        color: '#555',
    },
    kanbanList: {
        flex: 1,
    },
    kanbanCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    kanbanTaskTitle: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#333',
        marginBottom: 4,
    },
    kanbanTaskId: {
        fontSize: 12,
        color: '#888',
        marginBottom: 8,
    },
    kanbanCardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    kanbanTaskValue: {
        fontSize: 14,
        color: '#333',
    },
    userImageSmall: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#ccc',
    },

    // Estilos para la vista de Calendario
    calendarContainer: { flex: 1 },
    calendarGrid: { flexDirection: 'column' },
    calendarHeaderRow: { flexDirection: 'row' },
    calendarHeaderCell: { width: 150, padding: 10, borderRightWidth: 1, borderColor: '#ccc' },
    calendarDaysRow: { flexDirection: 'row' },
    calendarDayCell: { width: 30, textAlign: 'center', paddingVertical: 10, borderRightWidth: 1, borderColor: '#ccc' },
    calendarTaskRow: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#eee' },
    calendarTaskCell: { width: 150, padding: 10, borderRightWidth: 1, borderColor: '#ccc' },
    calendarTaskBar: { height: 15, backgroundColor: '#8B0000', borderRadius: 5, marginHorizontal: 2 },

// Estilos para la vista de Kanban
kanbanScrollView: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
},
kanbanActiveTasksContainer: {
    marginBottom: 20,
},
kanbanActiveTasksColumns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
},
kanbanColumn: {
    width: '23%', // Para 4 columnas con un pequeño espacio entre ellas
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E6E8EA',
},
kanbanColumnHeader: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 15,
    color: '#555',
},
kanbanList: {
    minHeight: 100,
},
kanbanCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
},
kanbanTaskTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
},
kanbanTaskId: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
},
kanbanCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
},
kanbanTaskValue: {
    fontSize: 14,
    color: '#333',
},
userImageSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ccc',
},

// Estilos para la sección de Reserva
kanbanReserveContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E6E8EA',
},
kanbanSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
},
kanbanReserveCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
},
kanbanReserveCard: {
    width: '23%',
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
},
kanbanReserveCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
},
});

export default ProyectosScreen;