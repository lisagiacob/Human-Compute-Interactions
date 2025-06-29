import React from 'react';
import { View, Text } from 'react-native';
import CameraComponent from './src/components/Camera';

import { UserProvider } from './src/components/UserContext';

export default function App() {
    return (
        <View style={{ flex: 1 }}>
            <UserProvider>
                <CameraComponent />
            </UserProvider>
        </View>
    );
}
