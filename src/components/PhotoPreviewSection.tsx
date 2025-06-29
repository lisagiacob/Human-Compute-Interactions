import React, { useEffect, useState } from "react";
import { SafeAreaView, TouchableOpacity, View, Image, StyleSheet, StyleProp, ViewStyle, Animated } from "react-native";
import { Fontisto } from "@expo/vector-icons";
import { CameraCapturedPicture } from "expo-camera";

const PhotoPreviewSection = ({
  photo,
  onRetake,
  savePhoto,
  style,
}: {
  photo: CameraCapturedPicture;
  onRetake: () => void;
  savePhoto: () => void;
  style?: StyleProp<ViewStyle>;
}) => {
  const [showPreview, setShowPreview] = useState(true);
  const [opacity] = useState(new Animated.Value(1)); // For fading out effect
  const [frameScale] = useState(new Animated.Value(1)); // For animating the frame size

  useEffect(() => {
    // Reset state and animations whenever a new photo is taken
    setShowPreview(true);
    opacity.setValue(1);
    frameScale.setValue(1);

    // Set a timer to hide the preview after 5 seconds
    const timer = setTimeout(() => {
      setShowPreview(false);
      savePhoto(); // Save the photo automatically after 5 seconds
    }, 5000); 

    // Fade out effect after 8 seconds (optional)
    Animated.timing(opacity, {
      toValue: 0, // Fade out
      duration: 500,
      delay: 5500, // Start fading after 8 seconds
      useNativeDriver: true,
    }).start();

    // Cleanup the timer if component unmounts
    return () => clearTimeout(timer);
  }, [photo, opacity, frameScale]); // Dependency on `photo` to reset animations on new photo

  const mirrorStyle = {
    transform: [{ scaleX: -1 }], // Flip the image horizontally
  };

  return (
    showPreview && (
      <SafeAreaView style={[styles.container, style]}>
        <View style={styles.box}>
          <Animated.Image
            style={[styles.previewContainer, { opacity, transform: [{ scale: frameScale }] }, mirrorStyle]}
            source={{ uri: "data:image/jpg;base64," + photo.base64 }}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={savePhoto}>
              <Fontisto name="check" size={19} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onRetake}>
              <Fontisto name="close-a" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute", // Position it relative to the parent
    bottom: 50, // Distance from the bottom edge
    right: 60, // Distance from the right edge
    backgroundColor: "rgba(0, 0, 0, 0)", // Add a background for better visibility
    alignItems: "center", // Center the content within the container
  },
  box: {
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "transparent",
  },
  previewContainer: {
    width: 250, // Fixed width
    height: 200, // Fixed height, or adjust based on your design
    borderRadius: 50,
    marginBottom: 10,
    resizeMode: "cover", // Ensures the image fits within the container
    borderWidth: 2.5,
    borderColor: "rgb(182, 184, 214)",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 150,
  },
  button: {
    backgroundColor: 'rgba(126, 120, 210, 0.95)',
    padding: 16,
    borderRadius: 50,
    borderWidth: 2.5,
    borderColor: "black",
  },
});

export default PhotoPreviewSection;
