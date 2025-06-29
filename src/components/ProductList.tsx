import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Modal, TextInput, Button } from 'react-native';
import { FontAwesome } from "@expo/vector-icons";
import API from '../services/API.js';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';

interface Product {
  id: number;
  name: string;
  price: number;
  duration: number;
}

const ProductList = ({ 
  loggedInUser, 
  onClose,
  onCloseToSkin, 
} : { 
  loggedInUser: any, 
  onClose: () => void,
  onCloseToSkin: () => void
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Stato per gestire il modale e i dati della skincare
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [timeOfDay, setTimeOfDay] = useState('');
  const [frequency, setFrequency] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // Funzione per formattare l'orario in HH:mm
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatToHHMM = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const isFormComplete = () => {
    return selectedProduct !== null && timeOfDay !== '' && frequency !== '';
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await API.getAllProducts();
        setProducts(response);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const openModal = (product: Product) => {
    setSelectedProduct(product);

    const newStartTime = new Date();

    // Calcola endTime sommando la durata del prodotto (convertita in millisecondi)
    const newEndTime = new Date(newStartTime.getTime() + product.duration * 60000);
  
    setEndTime(newEndTime);

    setModalVisible(true);
  };

  const addToSkincare = async () => {
    if (!selectedProduct) {
      alert("Seleziona un prodotto prima di aggiungerlo!");
      return;
    }
    if (!isFormComplete()) {
      alert("⚠️ Per aggiungere un prodotto, seleziona Time of Day e Frequency.");
      return;
    }
  
    const skincareData = {
      username: loggedInUser?.username,
      product_id: selectedProduct?.id,
      time_of_day: timeOfDay,
      frequency: frequency,
      start_time: formatToHHMM(startTime), // Ora è nel formato HH:MM
      end_time: formatToHHMM(endTime) // Ora è nel formato HH:MM
    };
    
    try {
      await API.addProductToSkincare(skincareData);
      Toast.show({
        type: 'success',
        position: 'top',
        topOffset: 30,
        text1: `Product ${selectedProduct?.name}`,
        text2: 'added to your skincare routine!',
        text1Style: { fontSize: 12, fontWeight: 'bold', textAlign: 'center' },
        text2Style: { fontSize: 12, fontWeight: 'bold', textAlign: 'center', color: 'black' },
        visibilityTime: 3000,
      });
      setModalVisible(false);
      //onClose();
    } catch (error) {
      alert('Errore durante l’aggiunta del prodotto.');
      Toast.show({
        type: 'error',
        position: 'top',
        topOffset: 30,
        text1: `Product ${selectedProduct?.name}`,
        text2: 'couldn\'t be added to your routine!',
        text1Style: { fontSize: 12, fontWeight: 'bold', textAlign: 'center' },
        text2Style: { fontSize: 12, fontWeight: 'bold', textAlign: 'center', color: 'black' },
        visibilityTime: 3000,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Products</Text>

      {loading ? (
        <ActivityIndicator size="large" color="white" />
      ) : (
        <FlatList
          data={products || []}
          keyExtractor={(item, index) => (item?.id ? item.id.toString() : `product-${index}`)}
          renderItem={({ item }) => (
            <View style={styles.productItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.productText}>
                  {item.name} {"\n"}
                  ${item.price} {"\n"}
                  {item.duration} min
                </Text>
              </View>
              <TouchableOpacity onPress={() => openModal(item)} style={styles.addButton}>
                <FontAwesome name="plus-circle" size={18} color="white" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={() => {
        onCloseToSkin()
      }}> 
      <Text style={styles.buttonText}>View your Skincare</Text>
      </TouchableOpacity>

      {/* Modale per inserire i dati della skincare */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add {selectedProduct?.name} in your skincare routine</Text>

            {/* Selettore Time of Day */}
            <Text style={styles.label}>Time of Day</Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.optionButton, timeOfDay === 'morning' && styles.selectedButton]}
                onPress={() => setTimeOfDay('morning')}
              >
                <Text style={styles.optionText}>Morning</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.optionButton, timeOfDay === 'afternoon' && styles.selectedButton]}
                onPress={() => setTimeOfDay('afternoon')}
              >
                <Text style={styles.optionText}>Afternoon</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.optionButton, timeOfDay === 'evening' && styles.selectedButton]}
                onPress={() => setTimeOfDay('evening')}
              >
                <Text style={styles.optionText}>Evening</Text>
              </TouchableOpacity>
            </View>

            {/* Selettore Frequency */}
            <Text style={styles.label}>Frequency</Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.optionButton, frequency === 'daily' && styles.selectedButton]}
                onPress={() => setFrequency('daily')}
              >
                <Text style={styles.optionText}>Daily</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.optionButton, frequency === 'monthly' && styles.selectedButton]}
                onPress={() => setFrequency('monthly')}
              >
                <Text style={styles.optionText}>Monthly</Text>
              </TouchableOpacity>
            </View>

            {/* Selettore Start Time */}
            <Text style={styles.label}>Start Time</Text>
            <TouchableOpacity onPress={() => setShowStartPicker(true)} style={styles.timeButton}>
              <Text style={styles.timeText}>{formatTime(startTime)}</Text>
            </TouchableOpacity>
            {showStartPicker && (
              <DateTimePicker
                value={startTime}
                mode="time"
                display="spinner"
                textColor='black'
                onChange={(event, selectedDate) => {
                  setShowStartPicker(false);
                  if (selectedDate) setStartTime(selectedDate);
                }}
              />
            )}

            {/* Selettore End Time */}
            <Text style={styles.label}>End Time</Text>
            <TouchableOpacity onPress={() => setShowEndPicker(true)} style={styles.timeButton}>
              <Text style={styles.timeText}>{formatTime(endTime)}</Text>
            </TouchableOpacity>
            {showEndPicker && (
              <DateTimePicker
                value={endTime}
                mode="time"
                display="spinner"
                textColor='black'
                onChange={(event, selectedDate) => {
                  setShowEndPicker(false);
                  if (selectedDate) setEndTime(selectedDate);
                }}
              />
            )}

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.confirmButton, isFormComplete() ? {} : styles.disabledButton]} 
                onPress={addToSkincare}
                disabled={!isFormComplete()}
              >
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <FontAwesome name="close" size={25} color="white" />
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
  productItem: {
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
    width: '100%',
  },
  productText: {
    fontSize: 16,
    color: 'black',
  },
  addButton: {
    width: 20,  
    height: 20,
    backgroundColor: '#6b52ae',
    borderRadius: 20, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  confirmButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  picker: {
    width: '100%',
    height: 50,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  timeButton: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    marginBottom: 10,
  },
  timeText: {
    fontSize: 16,
    color: 'black',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
  },
  
  selectedButton: {
    backgroundColor: '#6b52ae', // Colore per il pulsante selezionato
  },
  
  optionText: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
  },

  button: {
    backgroundColor: 'rgba(111, 88, 201, 1)',
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20
},  
disabledButton: {
  backgroundColor: 'gray',  // Colore spento
  opacity: 0.5,  // Opacità ridotta
}
});

export default ProductList;