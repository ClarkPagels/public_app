import React from 'react';
import { Image, Text, View, StyleSheet, Button, TouchableOpacity } from 'react-native';

export default function HomeScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Image source={require('../assets/paw.png')} style={styles.logo} />
            <Text style={styles.title}>PETPAL</Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Tabs')}>
                <Text style={styles.buttonText}>Go to Main</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000', 
    },
    logo: {
        width: 150, 
        height: 150, 
        marginBottom: 20, 
    },
    title: {
        fontSize: 50,
        fontWeight: 'bold',
        color: '#fff', 
    },
    button: {
        backgroundColor: '#fff', 
        paddingHorizontal: 30,
        paddingVertical: 10, 
        borderRadius: 30, 
        marginTop: 10, 
        minWidth: 150, 
        alignItems: 'center', 
    },
    buttonText: {
        color: '#000', 
        fontSize: 16, 
        fontWeight: 'bold', 
    },
});
