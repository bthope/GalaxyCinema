import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Platform, KeyboardAvoidingView, Modal, FlatList, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Icon from "react-native-vector-icons/FontAwesome"; 
import { provinces } from '../data/provinces'; 
import { cinemas } from '../data/cinemas'; 

export default function MovieTheater({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState('Toàn quốc');
  const [selectedProvinceIndex, setSelectedProvinceIndex] = useState(null);
  const [filteredCinemas, setFilteredCinemas] = useState(cinemas); // Khởi tạo danh sách rạp phim

  const handleSelectProvince = (index) => {
    setSelectedProvince(provinces[index]);
    setSelectedProvinceIndex(index);
  };

  const handleConfirm = () => {
    // Lọc danh sách rạp phim dựa trên khu vực đã chọn
    const filtered = cinemas.filter(cinema => {
      // Bạn có thể thêm logic để xác định khu vực cho các rạp phim
      return selectedProvince === 'Toàn quốc' || cinema.address.includes(selectedProvince);
    });
    setFilteredCinemas(filtered); // Cập nhật danh sách rạp phim đã lọc
    setModalVisible(false);
  };

  return (
    <KeyboardAvoidingView contentContainerStyle={styles.contain}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.contain}
    >
      <StatusBar />
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerTouch}
          onPress={() => setModalVisible(true)}  
        >
          <Icon name="map-marker" size={25} color="#0033CC" style={{ marginTop: 2 }} />
          <Text style={styles.headerText}>{selectedProvince}</Text>
        </TouchableOpacity>    
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Vị trí</Text>
          <FlatList
            data={provinces}
            keyExtractor={(item) => item}
            renderItem={({ item, index }) => (
              <TouchableOpacity 
                style={styles.provinceItem}
                onPress={() => handleSelectProvince(index)}
              >
                <View style={styles.radioButton}>
                  {selectedProvinceIndex === index ? (
                    <Icon name="circle" size={20} color="#0033CC" />
                  ) : (
                    <Icon name="circle-thin" size={20} color="#0033CC" />
                  )}
                </View>
                <Text style={styles.provinceText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalButton}>
              <Text style={styles.buttonText}>Đóng</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleConfirm} style={styles.modalButton}>
              <Text style={styles.buttonText}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.cinemaListContainer}>
        <FlatList
          data={filteredCinemas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.cinemaItem}>
              <Image source={item.image} style={styles.cinemaImage} />
              <View style={styles.cinemaInfo}>
                <Text style={styles.cinemaName}>{item.name}</Text>
                <Text style={styles.cinemaAddress}>{item.address}</Text>
                <Text style={styles.cinemaPhone}>Phone: {item.phone}</Text>
              </View>
            </View>
          )}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  contain: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignSelf: 'flex-start',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 5,
    borderBottomColor: 'lightgray',
    marginTop: 10,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#0033CC',
    marginLeft: 10,
  },
  headerTouch: {
    flexDirection: 'row',
    marginLeft: 20,
    justifyContent: "center",
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    width: '90%',
    left: '5%',
    bottom: '10%',
    top: '-3%',
    marginTop: 50,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  provinceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    width: '100%',
  },
  provinceText: {
    flex: 1,
    fontSize: 18,
    textAlign: 'left',
  },
  radioButton: {
    marginRight: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    backgroundColor: '#0033CC',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cinemaListContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 10,
  },
  cinemaItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  cinemaImage: {
    width: 120,
    height: 80,
    marginRight: 10,
    borderRadius: 5,
  },
  cinemaInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  cinemaName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cinemaAddress: {
    fontSize: 14,
    color: 'gray',
    marginTop: 5,
  },
  cinemaPhone: {
    fontSize: 14,
    color: 'gray',
    marginTop: 5,
  },
});
