import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, FlatList, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const PetsScreen = () => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [weight, setWeight] = useState('');
    const [gender, setGender] = useState('Girl');
    const [species, setSpecies] = useState('Cat');
    const [breed, setBreed] = useState('');
    const [pets, setPets] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const storedPets = await AsyncStorage.getItem('pets');
            if (storedPets !== null) {
                setPets(JSON.parse(storedPets));
            }
        } catch (e) {
            Alert.alert('Error', 'Failed to load pets.');
        }
    };

    const handleSave = async () => {
        if (name && age && weight && gender && species && breed) {
            const newPet = { id: Date.now(), name, age, weight, gender, species, breed };
            const updatedPets = [...pets, newPet];
            setPets(updatedPets);
            await AsyncStorage.setItem('pets', JSON.stringify(updatedPets));
            setName('');
            setAge('');
            setWeight('');
            setGender('');
            setSpecies('');
            setBreed('');
            setModalVisible(false);
            Alert.alert('Success', 'Pet saved successfully!');
        } else {
            Alert.alert('Error', 'Please fill in all fields.');
        }
    };

    const handleDelete = async (petId) => {
        const updatedPets = pets.filter(pet => pet.id !== petId);
        setPets(updatedPets);
        await AsyncStorage.setItem('pets', JSON.stringify(updatedPets));
        Alert.alert('Success', 'Pet deleted successfully!');
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={pets}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.petName}>{item.name}</Text>
                        <View style={styles.detailsRow}>
                            <Text style={styles.petDetail}>Species: {item.species} </Text>
                            <Text style={styles.petDetail}>Gender: {item.gender} </Text>
                            <Text style={styles.petDetail}>Age: {item.age} yrs</Text>
                        </View>
                        <View style={styles.detailsRow}>
                            <Text style={styles.petDetail}>Breed: {item.breed} </Text>
                            <Text style={styles.petDetail}>Weight: {item.weight} kg</Text>
                        </View>
                        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
                            <Text style={styles.buttonText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
            <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
                <Text style={styles.buttonText}>Add Pets</Text>
            </TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <ScrollView 
                    style={styles.modalView} 
                    contentContainerStyle={styles.modalContentContainer}
                >
                    <Text style={styles.label}>Name:</Text>
                    <TextInput style={styles.input} value={name} onChangeText={setName}
                               placeholder="Enter pet's name" placeholderTextColor="#333" />
                    
                    <Text style={styles.label}>Age:</Text>
                    <TextInput style={styles.input}
                               value={age} 
                               onChangeText={setAge} 
                               placeholder="Enter pet's age"
                               keyboardType="numeric"
                               placeholderTextColor="#333"  />
                    
                    <Text style={styles.label}>Weight:</Text>
                    <TextInput style={styles.input} value={weight} onChangeText={setWeight}
                               placeholder="Enter pet's weight in kilograms"
                               keyboardType="numeric"
                               placeholderTextColor="#333"  />
                    
                    <Text style={styles.label}>Sex:</Text>
                    <Picker
                        selectedValue={gender}
                        style={styles.picker}
                        onValueChange={(itemValue, itemIndex) => setGender(itemValue)}
                    >
                        <Picker.Item label="Girl" value="Girl" />
                        <Picker.Item label="Boy" value="Boy" />

                    </Picker>
                    
                    <Text style={styles.label}>Species:</Text>
                    <Picker
                        selectedValue={species}
                        style={styles.picker}
                        onValueChange={(itemValue, itemIndex) => setSpecies(itemValue)}
                    >
                        <Picker.Item label="Cat" value="Cat" />
                        <Picker.Item label="Dog" value="Dog" />
                        <Picker.Item label="Parrot" value="Parrot" />
                        <Picker.Item label="Hamster" value="Hamster" />
                        <Picker.Item label="Fish" value="Fish" />
                        <Picker.Item label="Turtle" value="Turtle" />
                        <Picker.Item label="Snake" value="Snake" />
                    </Picker>
                    
                    <Text style={styles.label}>Breed:</Text>
                    <TextInput style={styles.input}
                               value={breed} 
                               onChangeText={setBreed} 
                               placeholder="Enter pet's breed" 
                               placeholderTextColor="#333" />

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                            <Text style={styles.saveButtonText}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.backButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.buttonText}>Back</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </Modal>

        </View>
    );
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff', 
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc', 
        padding: 15, 
        marginVertical: 12, 
        borderRadius: 6, 
        backgroundColor: '#fff', 
        color: 'black', 
        fontSize: 16, 
        width: '100%', 
    },
    picker: {
        borderWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 4,
        paddingHorizontal: 8,
        marginVertical: 5,
        borderRadius: 3,
        width: '80%', 
        backgroundColor: '#fff',
        fontSize: 16,
        height: 120,
        justifyContent: 'center',
    },
    button: {
        backgroundColor: '#000', 
        padding: 12,
        borderRadius: 6,
        marginBottom: 12,
        alignSelf: 'center',
    },
    saveButton: {
        backgroundColor: '#000', 
        padding: 12,
        borderRadius: 6,
        marginTop: 12,
        marginLeft: 5, 
    },
    saveButtonText: {
        color: '#fff', 
        fontSize: 16,
        textAlign: 'center', 
    },
    backButton: {
        backgroundColor: '#000', 
        color: 'black',
        padding: 12,
        borderRadius: 6,
        marginTop: 12,
        marginLeft: 5, 
    },
    deleteButton: {
        backgroundColor: '#000',
        padding: 8,
        borderRadius: 4,
        justifyContent: 'center',
        marginLeft: 100,
    },
    buttonText: {
        color: '#fff', 
        fontSize: 16,
        textAlign: 'center',
    },
    /*
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '90%', 
        alignItems: 'stretch', 
    },
    modalContentContainer: {
        alignItems: 'center',  
        padding: 20,
    },
    
     */
    item: {
        padding: 10,
        marginVertical: 8,
        backgroundColor: '#f9f9f9',
    },
    description: {
        fontSize: 16,
        color: '#333',
    },
    infoContainer: {
        marginTop: 16,
        backgroundColor: '#000',
        padding: 10,
        borderRadius: 6,
    },
    infoText: {
        fontSize: 16,
        color: '#fff',
    },
    
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '90%', 
        height: '80%',
    },
    modalContentContainer: {
        alignItems: "center", 
    },
    petName: {
        fontSize: 20,  
        fontWeight: 'bold',  
        color: '#333',
    }
    
     
});

export default PetsScreen;
