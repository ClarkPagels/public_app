import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, Alert, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get("window").width;

const getGraphData = (todos) => {
    const dateCounts = {};

    todos.forEach(todo => {
        if (todo.completed && todo.completionDate) {
            const completionDate = new Date(todo.completionDate).toISOString().split('T')[0]; // Get date string in YYYY-MM-DD format
            if (!dateCounts[completionDate]) {
                dateCounts[completionDate] = 0;
            }
            dateCounts[completionDate]++;
        }
    });

    const sortedDates = Object.keys(dateCounts).sort();
    const dataCounts = sortedDates.map(date => dateCounts[date]);

    return {
        labels: sortedDates, // Use the sorted array of dates as labels
        datasets: [{
            data: dataCounts // Use the counts for each date
        }]
    };
};

const DetailsScreen = ({ navigation }) => {
    const [pets, setPets] = useState([]);
    const [todos, setTodos] = useState([]);
    const [selectedPet, setSelectedPet] = useState(null);
    const [graphData, setGraphData] = useState({ labels: [], datasets: [{ data: [] }] });

    useFocusEffect(
        React.useCallback(() => {
            const loadPetsAndTodos = async () => {
                try {
                    const storedPets = await AsyncStorage.getItem('pets');
                    const storedTodos = await AsyncStorage.getItem('todos');
                    if (storedPets !== null) {
                        setPets(JSON.parse(storedPets));
                    }
                    if (storedTodos !== null) {
                        const todosArray = JSON.parse(storedTodos);
                        setTodos(todosArray);
                    }
                } catch (e) {
                    Alert.alert('Error', 'Failed to load data.');
                }
            };
            loadPetsAndTodos();
        }, [])
    );

    const handleSelectPet = (pet) => {
        setSelectedPet(pet);
      
        setGraphData(getGraphData(todos));
          
    };

    const handleDeselectPet = () => {
        setSelectedPet(null);
    };

    const handleSignOut = () => {
        Alert.alert('Signed Out', 'You have been signed out.');
        navigation.navigate('Home');
    };

    if (pets.length === 0) {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('PETS')}>
                    <Text style={styles.buttonText}>Add Pets</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                    <Text style={styles.buttonText}>Sign Out</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {selectedPet ? (
                <>
                    <TouchableOpacity style={styles.backButton} onPress={handleDeselectPet}>
                        <Text style={styles.buttonText}>Back</Text>
                    </TouchableOpacity>
                    <View style={styles.detailContainer}>
                        <Image source={getImageForSpecies(selectedPet.species)} style={styles.detailImage} />
                        <Text style={styles.detailName}>{selectedPet.name}</Text>
                        <Text style={styles.detailInfo}>Gender: {selectedPet.gender}</Text>
                        <Text style={styles.detailInfo}>Age: {selectedPet.age} years</Text>
                        <Text style={styles.detailInfo}>Weight: {selectedPet.weight}</Text>
                        <Text style={styles.detailInfo}>Breed: {selectedPet.breed}</Text>
                        <LineChart
                            data={graphData}
                            width={screenWidth}
                            height={220}
                            chartConfig={{
                                backgroundColor: '#000',
                                backgroundGradientFrom: '#000',
                                backgroundGradientTo: '#000',
                                decimalPlaces: 0,
                                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                style: {
                                    borderRadius: 16,
                                },
                                propsForDots: {
                                    r: "6",
                                    strokeWidth: "2",
                                    stroke: "#ffa726"
                                }
                            }}
                            bezier
                            style={{
                                marginVertical: 8,
                                borderRadius: 16
                            }}
                        />
                    </View>
                </>
            ) : (
                <FlatList
                    data={pets}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.petContainer}
                            onPress={() => handleSelectPet(item)}
                        >
                            <Image source={getImageForSpecies(item.species)} style={styles.petImage} />
                            <Text style={styles.petName}>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={{ paddingTop: 35 }}
                />
            )}
            {/* <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                <Text style={styles.buttonText}>Sign Out</Text>
            </TouchableOpacity> */}
        </View>
    );
};

const getImageForSpecies = (species) => {
    switch (species.toLowerCase()) {
        case 'cat': return require('../assets/cat.jpeg');
        case 'dog': return require('../assets/dog.jpeg');
        case 'parrot': return require('../assets/parrot.jpeg');
        case 'hamster': return require('../assets/hamster.jpeg');
        case 'fish': return require('../assets/fish.jpeg');
        case 'turtle': return require('../assets/turtle.jpeg');
        case 'snake': return require('../assets/snake.jpeg');
        default: return require('../assets/paw.png');
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backButton: {
        alignSelf: 'flex-start',
        margin: 10,
        backgroundColor: '#444',
        padding: 10,
        borderRadius: 5,
    },
    petContainer: {
        alignItems: 'center',
        backgroundColor: '#333',
        borderRadius: 10,
        padding: 20,
        marginTop: 5,
        marginBottom: 10,
        width: '100%',
    },
    petImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 5,
    },
    petName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 8,
    },
    detailContainer: {
        alignItems: 'center',
        width: '100%',
        padding: 20,
        backgroundColor: '#222',
        borderRadius: 10,
    },
    detailImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 15,
    },
    detailName: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#fff',
    },
    detailInfo: {
        fontSize: 16,
        color: '#fff',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    signOutButton: {
        position: 'absolute',
        bottom: 20,
        backgroundColor: '#444',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 30,
        marginTop: 10,
        minWidth: 110,
        alignItems: 'center',
    },
});

export default DetailsScreen;