  import { Camera, CameraType, CameraView, useCameraPermissions } from 'expo-camera';
  import React, { useEffect, useState, useRef } from 'react';  // Ensure React is imported
  import { ActivityIndicator, Button, StyleSheet, Text, TouchableOpacity, View, Animated, Dimensions } from 'react-native';
  import { Image } from 'react-native';
  import Toast from 'react-native-toast-message';
  import * as MediaLibrary from 'expo-media-library';
  import { Fontisto } from "@expo/vector-icons";

  import API from '../services/API';
  import { useUser } from './UserContext';

  import PhotoPreviewSection from './PhotoPreviewSection';
  import Login from './Login';
  import UserLoginButton from './UserLoginButton';
  import PhotosHistory from './PhotosHistory';
  import StatsHistory from './StatsHistory';
  import ProductList from '../components/ProductList';
  import SkincareView from './SkincareView';
  import { nextTick } from 'process';

  export default function CameraComponent() {
    const toggleCamera = () => {
      if (facing === 'back') {
        setFacing('front');
    
        // Aspetta un frame e verifica se la fotocamera è attiva
        setTimeout(() => {
          if (!cameraRef.current) {
            console.log("Front camera not available, switching back.");
            setFacing('back');
            alert("Front camera is not available on this device.");
          }
        }, 500);
      } else {
        setFacing('back');
      }
    };
    const [facing, setFacing] = useState<CameraType>('front'); // Use 'back' as the default string value
    const [users, setUsers] = useState([]);
    const { loggedInUser, setLoggedInUser } = useUser();
    const [permission, requestPermission] = useCameraPermissions();
    const [isReady, setIsReady] = useState(false);
    const [mediaReady, setMediaReady] = useState(false);
    const [openLogin, setOpenLogin] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [openStatsHistory, setOpenStatsHistory] = useState(false);
    const [isHome, setIsHome] = useState(true); //when false i need to show the button to go home
    const [isTutorialActive, setIsTutorialActive] = useState(false);

    const cameraRef = useRef<CameraView | null>(null);
    const [photo, setPhoto] = useState<any>(null);
    const [photoUri, setPhotoUri] = useState<string | null>(null);

    const scanningAnimation = useRef(new Animated.Value(0)).current;

    const [slidePhotosAnim] = useState(new Animated.Value(-Dimensions.get('window').width)); // Initially off-screen
    const [slideStatsAnim] = useState(new Animated.Value(Dimensions.get('window').width)); // Initially off-screen

    const [openProductList, setOpenProductList] = useState(false);
    const [slideProductAnim] = useState(new Animated.Value(-Dimensions.get('window').width)); // Inizialmente fuori dallo schermo

    const [openSkincare, setOpenSkincare] = useState(false);
    const [slideSkincareAnim] = useState(new Animated.Value(-Dimensions.get('window').width));
     
    const [buttonLayout, setButtonLayout] = useState<any>(null);
    const [tutorialStep, setTutorialStep] = useState(0);

    const cameraButtonRef = useRef<any>(null);
    const loginButtonRef = useRef<any>(null);
    const statsButtonRef = useRef<any>(null);
    const productsButtonRef = useRef<any>(null);
    const skincareButtonRef = useRef<any>(null);

    const steps = [
      { id: 'cameraButton', message: 'Press this button to scan your face and take a photo at the end!' },
      { id: 'loginButton', message: 'Hold to see all the users or double tap to switch!' },
      { id: 'statsButton', message: 'View your stats and history with all the photos that you took!' },
      { id: 'skincareButton', message: 'View your skincare routine and start a timer when doing it!' },
      { id: 'productsButton', message: 'Browse products that you can add to your routine!' },
    ];

    useEffect(() => {
      console.log('Fetching users...');
      const newUs = API.getUsers().then(users => setUsers(users));
    }, []);

    console.log(users);

    useEffect(() => {
      if(!loggedInUser){
        setLoggedInUser(users[0]);
      } else if(loggedInUser?.username){
        const userIndex = users.findIndex((user: any) => user.username === loggedInUser.username);
        if (userIndex !== -1) {
          setLoggedInUser(users[userIndex]);
        }
      }
    }, [users]);

    console.log(loggedInUser);

    const handleNextStep = () => {
      if (tutorialStep < steps.length - 1) {
        setTutorialStep((prev) => prev + 1);
      } else {
        API.setTutorialUser(loggedInUser.username).then(() => setIsTutorialActive(false));
        API.getUsers().then(users => setUsers(users));
      }
    };

    const handleCloseTutorial = () => {
      API.setTutorialUser(loggedInUser.username).then(() => setIsTutorialActive(false));
      const newUsers = API.getUsers().then(users => setUsers(users));
    };

    useEffect(() => {
      if(loggedInUser?.tutorial === 0){
        setIsTutorialActive(true);
      }
    }, [loggedInUser]);

    useEffect(() => {
      setTimeout(() => {
        if (steps[tutorialStep]?.id === "cameraButton") {
          // Use refs for better control
          cameraButtonRef?.current?.measure((x, y, width, height, pageX, pageY) => {
            setButtonLayout({
              x: pageX,
              y: pageY,
              width,
              height,
            });
          });
        } else if (steps[tutorialStep]?.id === "loginButton") {
          loginButtonRef?.current?.measure((x, y, width, height, pageX, pageY) => {
            setButtonLayout({
              x: pageX,
              y: pageY,
              width,
              height,
            });
          });
        } else if (steps[tutorialStep]?.id === "statsButton") {
          statsButtonRef?.current?.measure((x, y, width, height, pageX, pageY) => {
            setButtonLayout({
              x: pageX,
              y: pageY,
              width,
              height,
            });
          });
        } else if (steps[tutorialStep]?.id === "skincareButton") {
          skincareButtonRef?.current?.measure((x, y, width, height, pageX, pageY) => {
            setButtonLayout({
              x: pageX,
              y: pageY,
              width,
              height,
            });
          });
        } else if (steps[tutorialStep]?.id === "productsButton") {
          productsButtonRef?.current?.measure((x, y, width, height, pageX, pageY) => {
            setButtonLayout({
              x: pageX,
              y: pageY,
              width,
              height,
            });
          });
        }
      }, 50); // Small delay ensures the layout has stabilized
    }, [tutorialStep]);
    

    useEffect(() => {
      (async () => {
        if (!permission) {
          const { granted } = await requestPermission();
          if (granted) {
            setIsReady(true);
          } else {
            alert("Camera permission is required to use this feature.");
          }
        } else {
          setIsReady(true);
        }
      })();
    }, [permission]);

    useEffect(() => {
    }, [permission]);

    if (!permission) {
      // Camera permissions are still loading.
      return <View />;
    }

    if (!permission.granted) {
      // Camera permissions are not granted yet.
      return (
        <View style={styles.container}>
          <Text style={styles.message}>We need your permission to show the camera</Text>
          <Button onPress={requestPermission} title="grant permission" />
        </View>
      );
    }

    const startScanningAnimation = () => {
      scanningAnimation.setValue(0); // Reset the animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanningAnimation, {
            toValue: 1, // Move from top to bottom
            duration: 2000, // Adjust the duration for the scanning speed
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    const startFakeLoading = () => {

      Toast.show({
        type: 'info',
        position: 'top',
        topOffset: 30,
        text1: 'Scanning is starting',
        text2: 'Align your face in the oval',
        text1Style: { fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
        text2Style: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', color: 'black' },
        visibilityTime: 3000,
      });

      setIsLoading(true);
      startScanningAnimation(); // Start scanning animation
  
      // Simulate scanning for 3 seconds, then take the photo
      setTimeout(async () => {
        setIsLoading(false); // End scanning animation
        await handleTakePicture(); // Automatically take a photo
      }, 6000);
    };

    const handleTakePicture = async () => {
      if(cameraRef.current) {
        const options = { quality: 1, base64: true, exif: true };
        const photo = await cameraRef.current.takePictureAsync(options);

        setPhoto(photo);
      }
    };

    const handleRetakePicture = () => {
      Toast.show({
        type: 'info',
        position: 'top',
        topOffset: 30,
        text1: 'Photo discarded!',
        text1Style: { fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
        visibilityTime: 3000,
      });
      setPhoto(null);
    };

    const handleSavePicture = async () => {
      try {
        if (!photo || !photo.uri) return;
    
        // Request media library permissions
        const { status } = await MediaLibrary.requestPermissionsAsync();
    
        if (status === 'granted') {
          const asset2 = await MediaLibrary.createAssetAsync(photo.uri); // Save photo to library
    
          Toast.show({
            type: 'success',
            position: 'top',
            topOffset: 30,
            text1: 'Photo saved!',
            text1Style: { fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
            visibilityTime: 3000,
          });

          const assetInfo = await MediaLibrary.getAssetInfoAsync(asset2.id);

          if (assetInfo.uri && assetInfo.localUri) {
            setPhotoUri(assetInfo.localUri); // This should be a valid file URI that you can use
            await API.uploadPhoto(assetInfo.localUri, loggedInUser.username);
            setPhoto(null); // Reset the photo state
          } else {
            throw new Error('Asset URI not available');
          }

        } else {
          // If permission not granted
          Toast.show({
            type: 'error',
            position: 'top',
            topOffset: 30,
            text1: 'Permission to save photo is required!',
            text1Style: { fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
            visibilityTime: 3000,
          });
        }
      } catch (error) {
        console.error('Failed to save the photo', error);
        Toast.show({
          type: 'error',
          position: 'top',
          topOffset: 30,
          text1: 'Failed to save photo!',
          text1Style: { fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
          visibilityTime: 3000,
        });
      }
    };    

    const handleCloseLogin = () => {
      setOpenLogin(false);
    };

    const handleLogin = (user: any) => {
      setLoggedInUser(user);
      setOpenLogin(false);

      Toast.show({
        type: 'success',
        position: 'top',
        topOffset: 30,
        text1: `Logged in as ${user.username}`,
        text1Style: { fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
        visibilityTime: 3000,
      });

    };

    const animateStatsIn = () => {
      Animated.timing(slideStatsAnim, {
        toValue: 0, // Slide into the screen
        duration: 500, // Animation duration (adjust as needed)
        useNativeDriver: true, // Optimize performance
      }).start();
    };
    
    const animatePhotosOut = (onComplete: () => void) => {
      Animated.timing(slidePhotosAnim, {
        toValue: -Dimensions.get('window').width, // Slide off-screen
        duration: 500, // Match slide-in duration
        useNativeDriver: true,
      }).start(() => {
        onComplete(); // Close the component after the animation
      });
    };

    const animatePhotosIn = () => {
      Animated.timing(slidePhotosAnim, {
        toValue: 0, // Slide into the screen
        duration: 500, // Animation duration (adjust as needed)
        useNativeDriver: true, // Optimize performance
      }).start();
    };
    
    const animateStatsOut = (onComplete: () => void) => {
      Animated.timing(slideStatsAnim, {
        toValue: Dimensions.get('window').width, // Slide off-screen
        duration: 500, // Match slide-in duration
        useNativeDriver: true,
      }).start(() => {
        onComplete(); // Close the component after the animation
      });
    };

    const handleOpenStatsHistory = () => {
      setOpenStatsHistory(true);
      setIsHome(false);
      animatePhotosIn();
      animateStatsIn();
    };

    const handleGoHome = () => {
      animatePhotosOut(() => {
      });
      animateStatsOut(() => {
        setOpenStatsHistory(false);
        setIsHome(true);
      });
      animateProductListOut(() => {
        setOpenProductList(false); 
      });
    
      animateSkincareOut(() => {
        setOpenSkincare(false);
      });
    
      setIsHome(true);
    };

    const animateProductListIn = () => {
      Animated.timing(slideProductAnim, {
        toValue: 0, // Entra nello schermo
        duration: 500,
        useNativeDriver: true,
      }).start();
    };
    
    const animateProductListOut = (onComplete: () => void) => {
      Animated.timing(slideProductAnim, {
        toValue: -Dimensions.get('window').width, // Esce dallo schermo
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        onComplete();
      });
    };

    const handleOpenProductList = () => {
      setOpenProductList(true);
      setIsHome(false);
      animateProductListIn();
    };
    
    const handleCloseProductList = () => {
      animateProductListOut(() => {
        setOpenProductList(false);
        setIsHome(true);
      });
    };

    const animateSkincareIn = () => {
      Animated.timing(slideSkincareAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    };
    
    const animateSkincareOut = (onComplete: () => void) => {
      Animated.timing(slideSkincareAnim, {
        toValue: -Dimensions.get('window').width,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        onComplete();
      });
    };
    
    const handleOpenSkincare = () => {
      setOpenSkincare(true);
      setIsHome(false);
      animateSkincareIn();
    };
    
    const handleCloseSkincare = () => {
      animateSkincareOut(() => {
        setOpenSkincare(false);
        setIsHome(true);
      });
    };

  const handleSkincareToProd = () => {
      animateSkincareOut(() => {
        setOpenSkincare(false);
        setIsHome(false);
      });
    };

  const handleProdToSkincare = () => {
    animateSkincareOut(() => {
      setOpenProductList(false);
      setOpenSkincare(true);
      setIsHome(false);
      animateSkincareIn();
    });
  };

    return (
      <View style={styles.container}>

        {isTutorialActive && buttonLayout && (
          <View style={styles.overlay}>
            <View style={[ styles.highlight, {
              top: buttonLayout.y,
              left: buttonLayout.x,
              width: buttonLayout.width,
              height: buttonLayout.height,
            } ]}>
            </View>
            <View style={styles.tooltip}>
              <Text style={styles.tooltipText}>{steps[tutorialStep].message}</Text>
              <TouchableOpacity style={styles.nextButton} onPress={handleNextStep}>
                <Text style={styles.nextText}>Next</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.skipButton} onPress={handleCloseTutorial}>
                <Text style={styles.skipText}>Skip Tutorial</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {isLoading && (
          <View style={styles.scanningOverlay}>
          {/* Oval mask */}
            <View style={styles.ovalMask}>
              <Animated.View
                style={[
                  styles.scanningBar,
                  {
                    transform: [
                      {
                        translateY: scanningAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-140, 140], // Adjust to keep it within the oval
                        }),
                      },
                    ],
                  },
                ]}
              />
            </View>
          </View>
        )}

        {isReady ? (
          <CameraView style={styles.camera} facing={facing} ref={cameraRef}> 
            <View style={ styles.buttonContainer }>
              {/* Bottone per cambiare la fotocamera */}
              <TouchableOpacity 
                style={styles.cameraToggleButton} 
                onPress={toggleCamera} 
                disabled={isLoading}
              >
                <Fontisto name="spinner-refresh" size={24} style={styles.cameraToggleIcon} />
              </TouchableOpacity>

              {/* Se schermata home -> scansione; altrimenti pulsante per home */}
              {isHome ? (
                <TouchableOpacity style={styles.button} onPress={startFakeLoading} disabled={isLoading}
                  ref={cameraButtonRef}
                  onLayout={(event) => {
                    if (steps[tutorialStep].id === "cameraButton") {
                      event.target.measure((x, y, width, height, pageX, pageY) => {
                        // Update layout with absolute screen coordinates
                        setButtonLayout({
                          x: pageX,
                          y: pageY,
                          width: width,
                          height: height,
                        });
                      });
                    }
                  }}>
                  <Fontisto name="camera" size={31} style={styles.icon}/>
                </TouchableOpacity>
                )
              : (
                <TouchableOpacity style={styles.button} onPress={handleGoHome} disabled={isLoading}>
                  <Fontisto name="home" size={35} style={styles.iconHome}/>
                </TouchableOpacity>
                )}
            </View>

            {/* Bottone per login */}
            {isHome && (
              <View style={ styles.buttonContainerRight }
                ref={loginButtonRef}>
                <UserLoginButton onLoginSuccess={handleLogin} users={users}/>
              </View>
            )}

            {/*Bottone per skincare*/}
            {isHome && (
              <View style={styles.buttonContainerLeft} ref={skincareButtonRef}>
                <TouchableOpacity style={styles.button2} onPress={handleOpenSkincare} disabled={isLoading}>
                  <Fontisto name="nav-icon-list" size={30} style={[styles.icon2, { marginLeft: 2, marginBottom: 2 }]}/> 
                </TouchableOpacity>
              </View>
            )}

            {/* Bottone per stats */} 
            {isHome && (
              <View style={ styles.buttonContainerRight2 } ref={statsButtonRef}>
                <TouchableOpacity style={styles.button2} onPress={handleOpenStatsHistory} disabled={isLoading}>
                  <Fontisto name="line-chart" size={27} style={[styles.icon2]}/>
                </TouchableOpacity>
              </View>
            )}

            {/* Bottone prodotti*/}
            {isHome && (
              <View style={ styles.buttonContainerLeft2 } ref={productsButtonRef}>
                <TouchableOpacity style={styles.button2} onPress={handleOpenProductList} disabled={isLoading}>
                  <Fontisto name="shopping-bag" size={37} style={[styles.icon2, { marginBottom: 6, marginLeft: 5 }]}/> 
                </TouchableOpacity>
              </View>
            )}

            {/* Mostra un’animazione di scansione quando la variabile isLoading è true. */}
            {isLoading && (
              <View style={styles.scanningOverlay}>
              {/* Oval mask */}
              <View style={styles.ovalMask}>
                <Animated.View
                  style={[
                    styles.scanningBar,
                    {
                      transform: [
                        {
                          translateY: scanningAnimation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-140, 140], // Adjust to keep it within the oval
                          }),
                        },
                      ],
                    },
                  ]}
                />
              </View>
              </View>
            )}

            {/*Scelgo se salvare o scartare la foto*/}
            {photo && (
              <PhotoPreviewSection
                photo={photo}
                onRetake={handleRetakePicture}
                savePhoto={handleSavePicture}
                style={styles.previewContainer}
              />
            )}
            
            {openLogin && (
              <Login 
                onClose={handleCloseLogin}
                login={handleLogin}
              />
            )}

            {openStatsHistory && (
              <View style={{ flex: 1 }}>
                <Animated.View style={[styles.previewStatsHistory, { transform: [{ translateX: slidePhotosAnim }] } ]}>
                  <PhotosHistory user={loggedInUser} />
                </Animated.View>
                <Animated.View style={{ 
                    transform: [{ translateX: slideStatsAnim }],
                    justifyContent: 'center', 
                    alignItems: 'flex-end', 
                    paddingRight: 0,
                    height: '70%',
                    bottom: '55%',
                }}>
                  <StatsHistory />
                </Animated.View>
              </View>
            )}

            {openProductList && (
              <View style={{ flex: 1 }}>
                <Animated.View style={[styles.previewProductList, { transform: [{ translateX: slideProductAnim }] } ]}>
                  <ProductList  loggedInUser={loggedInUser} onClose={handleCloseProductList} onCloseToSkin={handleProdToSkincare}/>
                </Animated.View>
              </View>
            )}

            {openSkincare && (
              <View style={{ flex: 1 }}>
                <Animated.View style={[styles.previewSkincare, { transform: [{ translateX: slideSkincareAnim }] }]}>
                  <SkincareView loggedInUser={loggedInUser} onClose={handleCloseSkincare} onCloseToProd={handleSkincareToProd}
                  onNavigateToProductList={handleOpenProductList} />
                </Animated.View>
              </View>
            )}

          </CameraView>
        )
        : (
          <Text style={styles.message}>Camera is not ready</Text>
        )}
        <Toast />
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
    },
    message: {
      textAlign: 'center',
      paddingBottom: 10,
    },
    camera: {
      flex: 1,
    },
    buttonContainer: {
      zIndex:-9998,
      flex: 1,
      position: 'absolute', // Positions it absolutely within the parent
      bottom: 25, // Distance from the bottom of the parent
      alignSelf: 'center', // Centers the container horizontally
      backgroundColor: 'transparent', // Ensures no background
    },
    buttonContainerRight: {
      zIndex: -9999,
      flex: 1,
      position: 'absolute', // Positions it absolutely within the parent
      bottom: '55%', // Distance from the bottom of the parent
      right: 15, // Distance from the right of the parent
      alignSelf: 'center', // Centers the container horizontally
      backgroundColor: 'transparent', // Ensures no background
    },    
    buttonContainerLeft: {
      flex: 1,
      position: 'absolute', // Posizionato assolutamente nel contenitore padre
      bottom: '55%', // Simmetrico rispetto a buttonContainerRight
      left: 15, // Posizionato a sinistra
      alignSelf: 'center',
      backgroundColor: 'transparent', // Nessuno sfondo per mantenere la UI pulita
    },
    buttonContainerRight2: {
      zIndex: -10000,
      flex: 1,
      position: 'absolute', // Positions it absolutely within the parent
      bottom: '45%', // Distance from the bottom of the parent
      right: 15, // Distance from the right of the parent
      alignSelf: 'center', // Centers the container horizontally
      backgroundColor: 'transparent', // Ensures no background
    },
    buttonContainerLeft2: {
      flex: 1,
      position: 'absolute', // Posizionato assolutamente nel contenitore padre
      bottom: '45%', // Simmetrico rispetto a buttonContainerRight2
      left: 15, // Posizionato a sinistra
      alignSelf: 'center',
      backgroundColor: 'transparent', // Nessuno sfondo per mantenere la UI pulita
    },
    button: {
      backgroundColor: 'rgba(111, 88, 201, 0.95)',
      borderRadius: 100,
      paddingVertical: 20, // Add some vertical padding
      paddingHorizontal: 20, // Add some horizontal padding
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 4,
      borderColor: 'rgba(126, 120, 210, 0.7)',
    },
    button2: {
      justifyContent: 'center', // Center content inside the button
      alignItems: 'center', // Center content inside the button
      backgroundColor: 'rgba(111, 88, 201, 0.95)',
      borderRadius: 50, // Ensure the circular shape
      width: 70, // Fixed width for the button
      height: 70, // Fixed height for the button
      borderWidth: 3,
      borderColor: 'rgba(126, 120, 210, 0.7)',
    },
    text: {
      fontSize: 18,
      color: 'white',
    },
    icon: {
      width: 35,
      height: 35,
    },
    iconHome: {
      width: 35,
      height: 35,
    },
    icon2: {
      width: 40,
      height: 40,
      paddingLeft: 2,
      paddingTop: 5,
    },
    previewContainer: {
      position: 'absolute',
      borderRadius: 10,
    },
    previewStatsHistory: {
      justifyContent: 'center',
      backgroundColor: 'rgba(182, 184, 214, 0.75)',
      width: 250,
      top: '15%',
      height: '70%',
      borderRadius: 7,
      borderWidth: 3,
      borderColor: 'rgba(111, 88, 201, 1)',
      marginLeft: 4,
      zIndex: 10,
    },
    savedPhoto: {
      width: '100%', // Adjust the width as needed
      height: 300, // Set a fixed height, or adjust accordingly
      resizeMode: 'contain', // To fit the image without distortion
      marginTop: 20,
    },
    ovalMask: {
      width: 350, // Width of the oval
      height: 500, // Height of the oval
      borderRadius: 175, // Make it oval
      backgroundColor: 'transparent', // Transparent center
      borderWidth: 2,
      borderColor: 'rgb(189, 237, 224)', // Green outline
      alignItems: 'center',
      justifyContent: 'center',
    },
    scanningBar: {
      width: '90%', // Scanning bar width
      height: 5, // Scanning bar height
      backgroundColor: 'lightcyan', // Semi-transparent green
      borderRadius: 2,
      position: 'absolute',
    },
    scanningOverlay: {
      zIndex: 1000,
      position: 'absolute',
      height: '100%',
      width: '100%',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    scanningText: {
      color: 'white',
      fontSize: 20,
      marginTop: 10,
    },
    overlay: {
      zIndex: 9999,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      justifyContent: 'center',
      alignItems: 'center'
    },
    tooltip: {
      position: 'absolute',
      bottom: 20,
      width: '26%',
      left: '15%',
      backgroundColor: 'rgba(111, 88, 201, 0.7)',
      padding: 20,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOpacity: 0.3,
      shadowRadius: 5,
      borderWidth: 3,
      borderColor: 'rgba(111, 88, 201, 1)',
    },
    tooltipText: {
      fontSize: 16,
      marginBottom: 40,
    },
    nextButton: {
      position: 'absolute',
      backgroundColor: 'blue',
      padding: 10,
      borderRadius: 7,
      marginTop: 10,
      bottom: 10,
      right: 15,
      borderWidth: 2,
      borderColor: 'darkblue',
    },
    nextText: {
      color: 'white',
      fontSize: 14,
    },
    skipButton: {
      position: 'absolute',
      bottom: 10,
      left: 15,
      backgroundColor: 'red',
      padding: 10,
      borderRadius: 7,
      borderWidth: 2,
      borderColor: 'darkred',
      marginTop: 10,
    },
    skipText: {
      color: 'white',
      fontSize: 14,
    },
    cameraToggleButton: {
      backgroundColor: 'transparent', // Sfondo trasparente SOLO per questo bottone
      padding: 10, // Riduci il padding per un aspetto più compatto
      alignItems: 'center',
      justifyContent: 'center',
    },
    cameraToggleIcon: {
      width: 24,
      height: 24,
      color: 'white', // Mantieni il colore bianco (puoi cambiarlo se preferisci)
    },
    previewProductList: {
      justifyContent: 'center',
      backgroundColor: 'rgba(182, 184, 214, 0.75)',
      width: 250,
      top: '15%',
      height: '70%',
      borderRadius: 7,
      zIndex: 10,
      borderWidth: 3,
      borderColor: 'rgba(111, 88, 201, 1)',
      marginLeft: 4,
    },
    previewSkincare: {
      justifyContent: 'center',
      backgroundColor: 'rgba(182, 184, 214, 0.75)',
      width: 250,
      top: '15%',
      height: '70%',
      borderRadius: 7,
      zIndex: 10,
      borderWidth: 3,
      borderColor: 'rgba(111, 88, 201, 1)',
      marginLeft: 4,
    },
    highlight: {
      position: 'absolute',
      backgroundColor: '#00000000', // Transparent
      borderWidth: 6,
      borderColor: 'rgba(111, 88, 201, 1)', // Purple border color
      borderRadius: 100, // Circle shape
      shadowColor: 'rgba(111, 88, 201, 1)', // Glow color (same as border)
      shadowOpacity: 0.9, // Intensity of the glow
      shadowOffset: { width: 5, height: 5 }, // No offset; glow spreads evenly
      shadowRadius: 10, // Size of the glow
      elevation: 20, // For Android glow (adjust as needed)
    },
  });