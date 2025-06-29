import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Animated, View, StyleSheet, Image, Text } from 'react-native';
import LoginModal from './LoginModal';

import API from '../services/API';

import { useUser } from './UserContext';

interface UserLoginButtonProps {
  onLoginSuccess: (username: string) => void; // Optional callback for parent communication
  users: any []; // Initial logged-in user list
}

export default function UserLoginButton({ onLoginSuccess, users }: UserLoginButtonProps) {
  const { loggedInUser } = useUser();
  const [activeUserIndex, setActiveUserIndex] = useState(0); // Currently active user index
  const [openLogin, setOpenLogin] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  const userSwitchAnimation = useState(new Animated.Value(0))[0];

  const rotateStyle = {
    transform: [{ rotate : "0deg" }]
  };

  useEffect(() => {
    if (loggedInUser) {
      const userIndex = users.findIndex((user) => user.username === loggedInUser.username);
      if (userIndex !== -1) {
        setActiveUserIndex(userIndex);
        if (users[userIndex]?.pfp_id) {
          // Assuming pfp_id is a URL or an image source
          //console.log('Switching to userAJHSDJADKJHASD:', users[userIndex]);
          API.getPhotoById(users[activeUserIndex]?.pfp_id).then((photo) => setProfilePicture(photo.path));
        }
        else {
          setProfilePicture(null);
        }
      }
    }
  }, [loggedInUser, users]);

  const handleDoubleTap = async () => {
    const nextUserIndex = (activeUserIndex + 1) % users.length;
    const nextUser = users[nextUserIndex];

    //console.log('Switching to user:', nextUser);

    if (nextUser?.pfp_id) {
      try {
        const photo = await API.getPhotoById(nextUser.pfp_id);
        setProfilePicture(photo.path); // Update profile picture directly
      } catch (error) {
        console.error('Error loading profile picture:', error);
        setProfilePicture(null); // Fallback to null if there's an error
      }
    } else {
      setProfilePicture(null); // If no profile picture, set to null
    }
    //console.log('Switching to userAAA:', nextUser);
    setActiveUserIndex(nextUserIndex);

    Animated.timing(userSwitchAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // Reset animation value after the transition
      userSwitchAnimation.setValue(0);
    });
    
    onLoginSuccess(users[nextUserIndex]); // Call the callback if provided
  };

  const handleLongPress = () => {
    setOpenLogin(true);
  };

  const handleLogin = (username: string) => {
    const newUser = users.find((user) => user.username === username);
    const newUserIndex = users.indexOf(newUser);
    const nextUserIndex = (newUserIndex) % users.length;
    setActiveUserIndex(nextUserIndex);
    onLoginSuccess(newUser); // Call the callback if provided
  };

  const handleCloseLogin = () => {
    setOpenLogin(false);
  };

  let lastTap = 0;

  const handlePress = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTap < DOUBLE_TAP_DELAY) {
      handleDoubleTap();
    }
    lastTap = now;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={handlePress}
        onLongPress={handleLongPress}
      >
        <Animated.Text
          style={[
            styles.initial,
            {
              opacity: userSwitchAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0],
              }),
              transform: [
                {
                  scale: userSwitchAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.2],
                  }),
                },
              ],
            },
          ]}
        >
          {profilePicture ? (
            // Assuming pfp_id is a URL or an image source
            <Image
              source={{ uri: profilePicture }}
              style={[styles.icon, rotateStyle]}
              resizeMode='cover'
            />
          ) : (
            // Display username if no profile picture
            <Text style={styles.initial}>
              {users?.[activeUserIndex]?.username?.[0]?.toUpperCase() || 'U'}
            </Text>
          )}
        </Animated.Text>
      </TouchableOpacity>

      {openLogin && (
        <LoginModal
          onClose={handleCloseLogin}
          login={handleLogin}
          currentUser={users[activeUserIndex].username}
          accounts={users}
          addAccount={onLoginSuccess}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    justifyContent: 'center', // Center content inside the button
    alignItems: 'center', // Center content inside the button
    backgroundColor: 'rgba(111, 88, 201, 0.95)',
    borderRadius: 50, // Ensure the circular shape
    width: 70, // Fixed width for the button
    height: 70, // Fixed height for the button
    borderWidth: 3,
    borderColor: 'rgba(126, 120, 210, 0.7)',
    overflow: 'hidden', // Prevent any content from spilling outside
  },
  initial: {
    color: 'black', // Change this to the desired text color
    fontSize: 32, // Adjust font size as needed
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 65, // Match this to the `icon` height for proper vertical centering
    width: 65, // Match this to the button's width
    height: 65, // Match this to the button's height
    borderRadius: 50, // Keep it circular
    backgroundColor: 'rgba(111, 88, 201, 0.95)', // Fallback color for initials
  },
  icon: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
});
