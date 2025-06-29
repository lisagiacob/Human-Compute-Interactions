import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, Modal, StyleSheet } from 'react-native';

import * as Icons from 'react-bootstrap-icons';

interface LoginModalProps {
  onClose: () => void; // Callback to close the modal
  login: (username: string) => void; // Callback to log in a new user
  currentUser?: string; // The current logged-in user
  accounts: any []; // List of other accounts
  addAccount: (username: string) => void; // Callback to add a new account
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, login, currentUser, accounts, addAccount }) => {
  const [username, setUsername] = useState('');
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [qrValue, setQrValue] = useState('');

  const handleLogin = (item: string) => {
    login(item);
    onClose();
  };

  const handleAddAccount = () => {
    const newUsername = `user_${Date.now()}`;
    setUsername(newUsername);
    setQrValue(newUsername); // Ensure qrValue is non-empty before showing the QRCode
    setQrModalVisible(true);
  };

  const closeQrModal = () => {
    setQrModalVisible(false);
  };

  return (
    <Modal
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
        <View style={styles.overlay}>
            <View style={styles.modalContainer}>
                {/* Close button (X) */}
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Text style={styles.closeButtonText}>X</Text>
                </TouchableOpacity>

                <Text style={styles.title}>Brupholee</Text>

                {currentUser && (
                    <Text style={styles.loggedInText}>Logged in as: {currentUser}</Text>
                )}

                {accounts.length > 0 && (
                    <FlatList
                        data={accounts}
                        keyExtractor={(item) => item.username}  // Use 'username' if it's unique
                        renderItem={({ item }) => (
                        <TouchableOpacity style={styles.accountItem} onPress={() => handleLogin(item.username)}>
                            <Text>{item.username}</Text>
                        </TouchableOpacity>
                        )}
                        style={styles.accountsList}
                    />
                )}

                {/*TODO: Add fake QRCode to connect with phone*/}
                <TouchableOpacity style={styles.addButton} onPress={handleAddAccount}>
                    <View style={styles.addAccountContainer}>

                        <Text style={styles.addButtonText}>Add New Account</Text>
                    </View>
                </TouchableOpacity>

                {/* QR Code Modal */}
                <Modal
                    transparent
                    visible={qrModalVisible}
                    animationType="slide"
                    onRequestClose={closeQrModal}
                >
                    <View style={styles.overlay}>
                        <View style={styles.qrModalContainer}>
                            <TouchableOpacity style={styles.closeButton} onPress={closeQrModal}>
                                <Text style={styles.closeButtonText}>X</Text>
                            </TouchableOpacity>

                            <Text style={styles.qrTitle}>Scan this QR Code</Text>
                            <Image
                                source={{
                                uri: `https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=https://example.com`,
                                }}
                                style={{ width: 200, height: 200 }}
                            />

                            <Text style={styles.qrSubtitle}>Fake QR Code for {username}</Text>
                        </View>
                    </View>
                </Modal>
            </View>
        </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0)', // Add opacity to background
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: 'rgba(187, 219, 209, 0.85)',
        borderRadius: 10,
        padding: 20,
        width: '45%',
        alignItems: 'center',
        position: 'relative', // Allow positioning the close button
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    loggedInText: {
        fontSize: 16,
        marginBottom: 10,
        fontStyle: 'italic',
    },
    accountsList: {
        width: '100%',
        marginBottom: 20,
    },
    accountItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        width: '100%',
        padding: 10,
        marginBottom: 20,
    },
    loginButton: {
        backgroundColor: 'lightblue',
        padding: 10,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
        marginBottom: 10,
    },
    loginButtonText: {
        fontWeight: 'bold',
    },
    addButton: {
        backgroundColor: 'transparent',
        padding: 10,
        borderRadius: 5,
        width: '100%',
        marginBottom: 10,
    },
    addButtonText: {
        fontWeight: 'bold',
    },
    addAccountContainer: {
        flexDirection: 'row', // Align the icon and text horizontally
        alignItems: 'center'
    },
    addAccountIcon: {
        width: 30,
        height: 30,
        marginRight: 10,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 10,
    },
    closeButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'gray', // You can change this to another color
    },
    qrModalContainer: {
        backgroundColor: 'rgba(187, 219, 209, 1)',
        borderRadius: 10,
        padding: 20,
        width: '45%',
        alignItems: 'center',
        position: 'relative',
    },
    qrTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    qrSubtitle: {
        fontSize: 14,
        fontStyle: 'italic',
        marginTop: 10,
    },
});

export default LoginModal;
