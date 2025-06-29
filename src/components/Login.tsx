import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Modal } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Fontisto } from "@expo/vector-icons";
import { Image } from "react-native";

const QrCode = require('../assets/qr-code.png');

const Login = ({ onClose, login }) => {
    const [selectedUser, setSelectedUser] = useState("Select a username");
    const [isModalVisible, setIsModalVisible] = useState(true); // Manage modal visibility
    const [pick, setPick] = useState<String>(''); // State to store the selected username

    const usernames = ['User1', 'User2']; // Add your list of usernames here

    const closeModal = () => {
        setIsModalVisible(false); // Close the modal when called
        if (onClose) onClose(); // Call the passed onClose prop function, if provided
    };

    const handleLogin = (username) => {
        setIsModalVisible(false); // Close the modal when called
        if (login) login(username); // Call the passed login prop function, if provided
    };

    useEffect(() => {
        if(selectedUser) {
            setPick(selectedUser);
        }
    }, [selectedUser]);

    return (
        <Modal
            animationType="fade" // Animation when modal appears
            transparent={true} // Makes the background transparent
            visible={isModalVisible} // Modal visibility
            onRequestClose={closeModal} // Close the modal when the back button is pressed (on Android)
        >
            <View style={styles.container}>
                <View style={styles.pickerContainer}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={closeModal}>
                            <Fontisto name="close" size={24} color="black"/>
                        </TouchableOpacity>
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Login</Text>
                        <TouchableOpacity onPress={() => handleLogin(pick)}>
                            <Fontisto name="check" size={24} color="black"/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.qrCodeOverlay}>
                        <Image
                            style={styles.icon}
                            source={QrCode}
                        />
                        <Text style={styles.qrCodeText}>QrCode available soon...</Text>
                    </View>
                    <Picker
                        selectedValue={selectedUser}
                        onValueChange={(itemValue) => setSelectedUser(itemValue)}
                        itemStyle={{ fontSize: 20, color: 'black' }} // Set the font size for the picker items
                        style={{ marginTop: -10 }} // Set the width of the picker
                    >
                        {usernames.map((username) => (
                            <Picker.Item key={username} value={username} label={username}/>
                        ))}
                    </Picker>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, // Take up the entire screen
        justifyContent: "flex-end", // Center content vertically
        alignItems: "center", // Center content horizontally
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background for effect
    },
    pickerContainer: {
        height: 325, // Set a fixed height for the picker
        width: "100%", // Take up the full width
        backgroundColor: "white", // White background
        justifyContent: "flex-start", // Center content vertically
    },
    header: {
        justifyContent: "space-between", // Space between the elements
        flexDirection: "row", // Elements in a row
        alignItems: "center", // Center elements vertically
        backgroundColor: "lightgray", // Light blue background
        padding: 15, // Add some padding
        width: "100%", // Ensure header takes full width
        position: "absolute", // Make sure it stays on top
        top: 0, // Align at the top of the modal
        zIndex: 1, // Ensure it's above other components
    },
    icon: {
        marginTop: 70, // Add some margin at the top
        width: 70,
        height: 70,
    },
    qrCodeOverlay: {
        flexDirection: 'row',  // This makes the children appear in the same row
        alignItems: 'center',  // Vertically center the items in the row
        justifyContent: 'center',  // Optionally center the row horizontally
    },
    qrCodeText: {
        color: 'blue',  // Text color (white to be visible on the QR code)
        fontSize: 16,  // Adjust text size
        fontWeight: 'bold',
        marginTop: 50,  // Add some margin at the top
    },
});

export default Login;
