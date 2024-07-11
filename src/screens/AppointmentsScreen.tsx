import React, { Component } from 'react';
import { Alert, StyleSheet, Text, View, TouchableOpacity, Button, TextInput } from 'react-native';
import { Agenda, DateData, AgendaEntry, AgendaSchedule } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import testIDs from '../../testIDs';

const today = new Date();
const day = today.getDate();
const month = today.getMonth() + 1;
const year = today.getFullYear();

interface State {
    items?: AgendaSchedule;
    newItemName: string;
    selectedDate: string;
}

export default class AgendaScreen extends Component<{}, State> {
    state: State = {
        items: {},
        newItemName: '',
        selectedDate: `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`
    };

    componentDidMount() {
        this.loadItemsFromStorage();
    }

    async loadItemsFromStorage() {
        try {
            const items = await AsyncStorage.getItem('agendaItems');
            if (items) {
                this.setState({ items: JSON.parse(items) });
            }
        } catch (error) {
            console.error("Failed to load items from local storage", error);
        }
    }

    async saveItemsToStorage(items: AgendaSchedule) {
        try {
            await AsyncStorage.setItem('agendaItems', JSON.stringify(items));
        } catch (error) {
            console.error("Failed to save items to local storage", error);
        }
    }

    handleAddItem = () => {
        const { newItemName, selectedDate, items } = this.state;
        if (!newItemName.trim()) return;

        const newItem = {
            name: newItemName,
            height: Math.max(50, Math.floor(Math.random() * 150)),
            day: selectedDate
        };

        const updatedItems = { ...items };
        if (!updatedItems[selectedDate]) {
            updatedItems[selectedDate] = [];
        }
        updatedItems[selectedDate].push(newItem);

        this.setState({ items: updatedItems, newItemName: '' }, () => {
            this.saveItemsToStorage(updatedItems);
        });
    };

    handleDeleteItem = (selectedDate, index) => {
        const updatedItems = { ...this.state.items };
        if (updatedItems[selectedDate]) {
            updatedItems[selectedDate].splice(index, 1);
            if (updatedItems[selectedDate].length === 0) {
                delete updatedItems[selectedDate];
            }
            this.setState({ items: updatedItems }, () => {
                this.saveItemsToStorage(updatedItems);
            });
        }
    };

    onDayPress = (day: DateData) => {
        this.setState({ selectedDate: day.dateString });
    };

    render() {
        const { newItemName, selectedDate } = this.state;

        return (
            <View style={styles.container}>
                <Agenda
                    testID={testIDs.agenda.CONTAINER}
                    items={this.state.items}
                    loadItemsForMonth={this.loadItems}
                    selected={selectedDate}
                    onDayPress={this.onDayPress}
                    renderItem={this.renderItem}
                    renderEmptyDate={this.renderEmptyDate}
                    rowHasChanged={this.rowHasChanged}
                    showClosingKnob={true}
                />
                <View style={styles.addItemContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="New item"
                        placeholderTextColor="#333"
                        value={newItemName}
                        onChangeText={(text) => this.setState({ newItemName: text })}
                    />
                    <Button title="Add Item" onPress={this.handleAddItem} color="white" />
                </View>
            </View>
        );
    }

    loadItems = (day: DateData) => {
        const items = this.state.items || {};

        setTimeout(() => {
            for (let i = -15; i < 85; i++) {
                const time = day.timestamp + i * 24 * 60 * 60 * 1000;
                const strTime = this.timeToString(time);

                if (!items[strTime]) {
                    items[strTime] = [];
                }
            }

            const newItems: AgendaSchedule = {};
            Object.keys(items).forEach(key => {
                newItems[key] = items[key];
            });
            this.setState({
                items: newItems
            });
        }, 1000);
    };

    renderItem = (reservation: AgendaEntry, isFirst: boolean) => {
        const fontSize = isFirst ? 16 : 14;
        const color = isFirst ? 'white' : 'lightgrey';
        const index = this.state.items[this.state.selectedDate].indexOf(reservation);

        return (
            <TouchableOpacity
                testID={testIDs.agenda.ITEM}
                style={[styles.item, { height: reservation.height }]}
                onPress={() => Alert.alert(reservation.name)}
            >
                <Text style={{ fontSize, color }}>{reservation.name}</Text>
                <Button title="Delete" color="red" onPress={() => this.handleDeleteItem(this.state.selectedDate, index)} />
            </TouchableOpacity>
        );
    };

    renderEmptyDate = () => {
        return (
            <View style={styles.emptyDate}>
                <Text style={{ color: 'white' }}>This is empty date!</Text>
            </View>
        );
    };

    rowHasChanged = (r1: AgendaEntry, r2: AgendaEntry) => {
        return r1.name !== r2.name;
    };

    timeToString(time: number) {
        const date = new Date(time);
        return date.toISOString().split('T')[0];
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    item: {
        backgroundColor: 'black',
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    emptyDate: {
        height: 15,
        flex: 1,
        paddingTop: 30
    },
    addItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#ccc',
    },
    input: {
        flex: 1,
        padding: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        marginRight: 10,
        borderRadius: 5,
        color: 'white'
    }
});