import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import { Fontisto } from "@expo/vector-icons";
import API from '../services/API.js'; 
import Toast from 'react-native-toast-message';

// Definizione dell'interfaccia per un prodotto skincare
interface SkincareProduct {
  product_id: number;
  time_of_day: string;
  name: string;
  frequency: string;
  start_time: string;
  end_time: string;
}

const SkincareView = ({ 
  loggedInUser, 
  onClose, 
  onCloseToProd,
  onNavigateToProductList 
}: { 
  loggedInUser: any, 
  onClose: () => void, 
  onCloseToProd: () => void,
  onNavigateToProductList: () => void
}) => {
  const [skincare, setSkincare] = useState<SkincareProduct[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState<number | null>(null);
  const [currentProduct, setCurrentProduct] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [currentSkincareIndex, setCurrentSkincareIndex] = useState<number>(0);

  const fetchSkincare = async (index?: number) => {
    if (!loggedInUser) return;
    try {
      let response;
      // Se index non è passato, carichiamo la skincare corrente 
      if (index === undefined) {
        response = await API.getCurrentSkincare(loggedInUser.username);
        setCurrentSkincareIndex(0); // Resetta l'indice quando carichi la skincare attuale, che ha offset 0
      } else {
        response = await API.getSkincareByIndex(loggedInUser.username, index);
        setCurrentSkincareIndex(index);
      }
      if (response) {
        setSkincare(response);
      } else {
        alert("Non ci sono più skincares precedenti.");
      }
    } catch (error) {
      setSkincare(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkincare();
  }, [refreshTrigger]);

  const startTimer = (product: SkincareProduct) => {
    const start = parseTime(product.start_time);
    const end = parseTime(product.end_time);
    const duration = end - start;

    if (duration > 0) {
      setTimer(duration * 60);
      setCurrentProduct(product.name);
    }
  };

  const parseTime = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const confirmCreateRandomSkincare = () => {
    Alert.alert(
      "Wait a minute! 🤔",
      "Are you sure you want to create a new skincare routine just for your needs?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: createRandomSkincare,
        },
      ]
    );
  };

  const confirmCreateSkincare = () => {
    Alert.alert(
      "Wait a minute! 🤔",
      "Are you sure you want to create a new empty skincare routine?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: createSkincare,
        },
      ]
    );
  };

  const confirmDeleteProduct = (product: SkincareProduct) => {
    Alert.alert(
      `Delete ${product.name}?`,
      "Do you really want to delete this product from your skincare routine?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => deleteProduct(product),
        },
      ]
    );
  };  

  const createRandomSkincare = async () => {
    try {
        if (!loggedInUser) return;
        console.log("🆕 Creating a new random skincare for", loggedInUser.username);

        await API.createRandomSkincare(loggedInUser.username);

        setRefreshTrigger(prev => prev + 1);

    } catch (error) {
        console.error("Errore nella creazione della skincare:", error);
        alert("Errore nella creazione della skincare.");
    }
  };

  const createSkincare = async () => {
    try {
        if (!loggedInUser) return;
        console.log("🆕 Creating a new random skincare for", loggedInUser.username);

        await API.createSkincare(loggedInUser.username);

        setRefreshTrigger(prev => prev + 1);

        onNavigateToProductList();
        setCurrentSkincareIndex(0);
        onCloseToProd();
    } catch (error) {
        console.error("Errore nella creazione della skincare:", error);
        alert("Errore nella creazione della skincare.");
    }
  };

  const deleteProduct = async (product: SkincareProduct) => {
    try{
      if(!loggedInUser) return;
      if(!product.product_id){
        console.error("Errore: manca ID del prodotto")
      }

      await API.deleteProduct(product.product_id, loggedInUser.username)
      setSkincare((prevSkincare) => prevSkincare ? prevSkincare.filter(p => p.product_id !== product.product_id) : null);

      Toast.show({
        type: 'success',
        position: 'top',
        topOffset: 30,
        text1: `Product ${product?.name}`,
        text2: 'has been deleted from your skincare routine',
        text1Style: { fontSize: 14, fontWeight: 'bold', textAlign: 'center' },
        text2Style: { fontSize: 12, fontWeight: 'bold', textAlign: 'center', color: 'black' },
        visibilityTime: 3000,
      });

    } catch(error){
      console.error("Errore nell'eliminazione del prodotto");
      //alert("Errore: prodotto non eliminato");
      Toast.show({
        type: 'error',
        position: 'top',
        topOffset: 30,
        text1: `Product ${product?.name}`,
        text2: 'couldn\'t be deleted from your skincare routine',
        text1Style: { fontSize: 14, fontWeight: 'bold', textAlign: 'center' },
        text2Style: { fontSize: 12, fontWeight: 'bold', textAlign: 'center', color: 'black' },
        visibilityTime: 3000,
      });
    }
  }

  useEffect(() => {
    if (timer !== null && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);

      return () => clearInterval(interval);
    } else if (timer === 0) {
      setTimer(null);
      setCurrentProduct(null);
    }
  }, [timer]);

  return (
    <View style={styles.container}>
      {timer !== null && (
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>
            {currentProduct}: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
          </Text>
          <TouchableOpacity onPress={() => setTimer(null)} style={styles.timerCloseButton}>
            <Fontisto name="close" size={25} color="white" />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.titleContainer}>
        <TouchableOpacity style={styles.navButton} onPress={() => fetchSkincare(currentSkincareIndex + 1)}
          disabled={skincare?.length === 0}>
          <Text style={styles.buttonText}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>
          {currentSkincareIndex === 0 ? "Current Skincare Routine" : "Skincare Routine"}
        </Text>

        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => {
            if (currentSkincareIndex > 1) {
              fetchSkincare(currentSkincareIndex - 1);
            } else {
              fetchSkincare(0);
            }
          }} 
        >
          <Text style={styles.buttonText}>→</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="white" />
      ) : skincare && skincare.length > 0 ? (
      <FlatList
        data={skincare}
        keyExtractor={(item, index) => `${item.product_id}-${index}`}
        renderItem={({ item }) => {
          return(
          <View>
            <TouchableOpacity style={styles.card} onPress={() => startTimer(item)}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productName}>{item.time_of_day}</Text>
              <Text style={styles.productDetails}>
                {item.frequency} | {item.start_time} - {item.end_time}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => confirmDeleteProduct(item)} style={styles.closeButton}>
              <Fontisto name="close" size={15} color="rgba(111, 88, 201, 1)" />
            </TouchableOpacity>
          </View>)
        }}
      />) : (
        <>
        <Text style={styles.text}>No skincare routine found.</Text>
        <Text style={styles.text}>You have scrolled too far!</Text>
        </>
      )}

      <TouchableOpacity 
      onPress={() => {
        setCurrentSkincareIndex(0);
        onClose();
      }}  
      style={styles.closeButton} >
        <Fontisto name="close" size={25} color="white" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => {
        setCurrentSkincareIndex(0)
        confirmCreateRandomSkincare();
      }}>
          <Text style={styles.buttonText}>   New Skincare {"\n"} JUST FOR YOU!</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonMini} onPress={() => {
        setCurrentSkincareIndex(0);
        confirmCreateSkincare();
      }}>
      <Text style={styles.buttonText}>Build your skincare</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(182, 184, 214, 0.75)',
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: 'white',
  },
  text: {
    fontSize: 16,
    color: 'white',
    marginBottom: 5,
  },
  card: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  productDetails: {
    fontSize: 14,
    color: '#555',
  },
  timerContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 999,
  },
  timerText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    top: 2,
    right: 0,
    padding: 10,
  },
  timerCloseButton: {
    position: 'absolute',
    top: 10,
    right: 5,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  button: {
      backgroundColor: 'rgba(111, 88, 201, 1)',
      padding: 12,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 20
  },  
  buttonMini: {
    backgroundColor: 'rgba(111, 88, 201, 0.71)',
    padding: 5,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10
},
  buttonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold"
  },
  navButton: {
    backgroundColor: 'rgba(111, 88, 201, 0.71)',
    width: 20,   // 🔹 Imposta una larghezza fissa
    height: 20,  // 🔹 Imposta un'altezza uguale per ottenere un cerchio
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -15,
  },
  navButtonsContainer: {
    flexDirection: 'row',  // 🔹 Mette i bottoni in riga
    justifyContent: 'center',  // 🔹 Centra i bottoni orizzontalmente
    alignItems: 'center',  // 🔹 Centra verticalmente
    gap: 90,  // 🔹 Distanza tra i bottoni (puoi aumentarla se vuoi più spazio)
  },
  titleContainer: {
    flexDirection: 'row',  // 🔹 Posiziona elementi in riga
    alignItems: 'center',  // 🔹 Centra verticalmente i pulsanti con la scritta
    justifyContent: 'space-between',  // 🔹 Mette un pulsante a sinistra, il testo al centro e l'altro pulsante a destra
    marginBottom: 10,  // 🔹 Spazio sotto il titolo
    marginTop: 20,
  },
});

export default SkincareView;
