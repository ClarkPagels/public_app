import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import DetailsScreen from './src/screens/detailspage'
import HomeScreen from './src/screens/homescreen'
import PetsScreen from './src/screens/PetsScreen';
import TodosScreen from './src/screens/TodosScreen';

//import { Ionicons } from '@expo/vector-icons'; 
import AgendaScreen from "./src/screens/AppointmentsScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MyTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarLabelStyle: {
                    color: 'white',
                    fontSize: 12,
                    textAlign: 'center',
                    paddingTop: 0,
                    paddingBottom: 3
                },
                tabBarStyle: {
                    backgroundColor: 'black',
                    borderTopColor: 'white',
                    borderTopWidth: 0,
                    height: 40,
                    alignItems: 'center',
                    justifyContent: 'center',
                },
                tabBarActiveTintColor: 'white',
                tabBarInactiveTintColor: 'gray',
                tabBarIcon: () => null
            }}
        >
            <Tab.Screen name="HOME" component={DetailsScreen} />
            <Tab.Screen name="PETS" component={PetsScreen} />
            <Tab.Screen name="TO-DOs" component={TodosScreen} />
            <Tab.Screen name ="Appointments" component={AgendaScreen}></Tab.Screen>
       

            {/* <Tab.Screen name="Tracking" component={SettingsScreen} /> */}


        </Tab.Navigator>
    );
}

function App() {
    return (
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="Details" component={DetailsScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="Tabs" component={MyTabs} options={{ headerShown: false }} />
                </Stack.Navigator>
            </NavigationContainer>
    );
}

export default App;