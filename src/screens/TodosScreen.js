import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TodosScreen = () => {
    const [description, setDescription] = useState('');
    const [when, setWhen] = useState('');
    const [importance, setImportance] = useState('Normal');
    const [todos, setTodos] = useState([]);
    const[name, setName] = useState(""); 
    const [modalVisible, setModalVisible] = useState(false);

    const addTodo = () => {
        if (description && when && name) {
            setTodos([...todos, { id: Date.now().toString(), description, when, name, importance, completed: false }]);
            setDescription('');
            setWhen('');
            setName(''); 
            setImportance('Normal');
            setModalVisible(false);
        } else {
            alert("Please fill in all fields");
        }
    };

    const toggleComplete = useCallback(id => {
        setTodos(todos.map(todo => {
            if (todo.id === id) {
                return { ...todo, completed: !todo.completed, completionDate: new Date().toISOString() };
            }
            return todo;
        }));
    }, [todos]);

    useEffect(() => {
        const saveTodos = async () => {
            try {
                await AsyncStorage.setItem('todos', JSON.stringify(todos));
            } catch (e) {
                alert('Failed to save todos');
            }
        };
        saveTodos();
    }, [todos]);

    useEffect(() => {
        const loadTodos = async () => {
            try {
                const storedTodos = await AsyncStorage.getItem('todos');
                if (storedTodos !== null) {
                    setTodos(JSON.parse(storedTodos));
                }
            } catch (e) {
                alert('Failed to load todos');
            }
        };
        loadTodos();
    }, []);

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.item} onPress={() => toggleComplete(item.id)}>
            <Text style={{ color: item.completed ? 'gray' : 'black', textDecorationLine: item.completed ? 'line-through' : 'none' }}>
                {item.description} - {item.when} - {item.importance}
            </Text>
            <Text style={styles.checkmark}>✓</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
                <Text style={styles.addButtonText}>Add New Task</Text>
            </TouchableOpacity>

            <FlatList
                data={todos}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                extraData={todos}
            />

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TextInput
                            style={styles.input}
                            value={description}
                            onChangeText={setDescription}
                            placeholder="Enter task description"
                            placeholderTextColor="#333"
                        />
                        <TextInput
                            style={styles.input}
                            value={when}
                            onChangeText={setWhen}
                            placeholder="Enter due date"
                            placeholderTextColor="#333"
                        />
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="Enter name of Pet"
                            placeholderTextColor="#333"
                        />
                        <TouchableOpacity style={styles.saveButton} onPress={addTodo}>
                            <Text style={styles.buttonText}>Add Task</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.saveButton, { backgroundColor: 'red' }]} onPress={() => setModalVisible(false)}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        marginVertical: 4,
        backgroundColor: '#DCDCDC',
        borderRadius: 5,
    },
    saveButton: {
        backgroundColor: 'white',
        padding: 10,
    },
    buttonText: {
        color: 'black',
        fontSize: 16,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    addButton: {
        backgroundColor: 'black',
        padding: 10,
        marginBottom: 10,
        alignItems: "center",
        margin: 10,
    },
    addButtonText: {
        color: 'white',
        fontSize: 16,
    },
    checkmark: {
        fontSize: 20,
        color: 'black',
    }
});

export default TodosScreen;