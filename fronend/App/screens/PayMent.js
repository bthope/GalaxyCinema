import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Platform, KeyboardAvoidingView, Image } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useRoute } from '@react-navigation/native';

// Thành phần RadioButton tùy chỉnh
const RadioButton = ({ selected, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      {selected ? (
        <AntDesign name="checkcircle" size={24} color="#FFA500" style={{top: 10}}/>
      ) : (
        <AntDesign name="checkcircleo" size={24} color="gray" style={{top: 10}}/>
      )}
    </TouchableOpacity>
  );
};

export default function PayMent({ navigation }) {
  const route = useRoute();
  const { seats, total, name, mall, timeSelected, movie, selectedDate } = route.params;

  // Trạng thái cho phương thức thanh toán được chọn
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('momo', 'vnPay', 'shopeePay', 'payoo');


  return (
    <KeyboardAvoidingView
      contentContainerStyle={styles.contain}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.contain}
    >
      <StatusBar />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={28} color="#0000DD" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Thanh toán</Text>
      </View>
      <View style={styles.contentTitle}>
        <View>
          <Image source={movie.image} style={styles.movieImage} />
        </View>
        <View>
          <View>
            <Text style={styles.infoText}>{name}</Text>
            <Text style={styles.infoText}>{mall}</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.infoText}>{timeSelected}</Text>
            <Text style={styles.infoText}>{new Date(selectedDate).toLocaleDateString('vi-VN')}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.infoTextInfomation}>Thông tin giao dịch</Text>
      <View style={styles.contentInformation}>
        <View style={styles.contentSeat}>
          <Text style={styles.infoText}>{`${seats.length}x - ${seats.join(', ')} `}</Text>
          <Text style={styles.infoText}>{total.toLocaleString('vi-VN')}đ</Text>
        </View>
        <View>
          <Text>------------------------------------------------------------------------------------------</Text>
        </View>
        <View style={styles.contentSeat}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Khuyến Mãi</Text>
            <AntDesign name="right" size={16} color="#FFA500" />
          </TouchableOpacity>

          <Text style={styles.infoText}>Tổng cộng:</Text>
          <Text style={styles.infoText1}>{total.toLocaleString('vi-VN')}đ</Text>
        </View>
      </View>
      <Text style={styles.infoTextInfomation}>Phương thức thanh toán</Text>
      <View style={styles.contentPayMent}>
        <View style={styles.contentTabPayMent}>
          <View style={styles.contentTab2PayMent}>
            <Image source={require('../img/momo.png')} style={styles.logo} />
            <Text style={styles.textPayMent}>Ví MoMo</Text>
          </View>
          <View>
            <RadioButton
              selected={selectedPaymentMethod === 'momo'}
              onPress={() => setSelectedPaymentMethod('momo')}
            />
          </View>
        </View>

        <View style={styles.contentTabPayMent}>
          <View style={styles.contentTab2PayMent}>
            <Image source={require('../img/VNPay.jpg')} style={styles.logo} />
            <Text style={styles.textPayMent}>Ví MoMo</Text>
          </View>
          <View>
            <RadioButton
              selected={selectedPaymentMethod === 'vnPay'}
              onPress={() => setSelectedPaymentMethod('vnPay')}
            />
          </View>
        </View>

        <View style={styles.contentTabPayMent}>
          <View style={styles.contentTab2PayMent}>
            <Image source={require('../img/shopeePay.png')} style={styles.logo} />
            <Text style={styles.textPayMent}>Ví shopeePay - Mã: SPPCINE08 Giảm 10K cho đơn hàng 100K</Text>
          </View>
          <View>
            <RadioButton
              selected={selectedPaymentMethod === 'shopeePay'}
              onPress={() => setSelectedPaymentMethod('shopeePay')}
            />
          </View>
        </View>

        <View style={styles.contentTabPayMent}>
          <View style={styles.contentTab2PayMent}>
            <Image source={require('../img/Payoo.png')} style={styles.logo} />
            <Text style={styles.textPayMent}>HSBC/Payoo - ATM/VISA/MASTER/JCB/QRCORE</Text>
          </View>
          <View>
            <RadioButton
              selected={selectedPaymentMethod === 'payoo'}
              onPress={() => setSelectedPaymentMethod('payoo')}
            />
          </View>
        </View>
        <View style={styles.contentFooter}>
          <View style={styles.contentFooterLeft}>
            <Text style={styles.infoText}>Tổng cộng:</Text>
            <Text style={styles.infoText1}>{total.toLocaleString('vi-VN')}đ</Text>
          </View>
          <TouchableOpacity style={styles.button1}>
            <Text style={styles.buttonText1}>Thanh toán</Text>
          </TouchableOpacity>
        </View>
        
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  contain: {
    flex: 1.2,
    backgroundColor: 'lightgray',
    paddingTop: 35,
    backgroundColor: '#E8E8E8',
  },
  header: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 15,
  },
  contentTitle: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 10,
    top: 10,
    flexDirection: 'row',
    height: 130,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  movieImage: {
    width: 80,
    height: 105,
    borderRadius: 7,
    left: 10,
    resizeMode: 'cover',
  },
  infoText: {
    fontSize: 14,
    padding: 5,
    fontWeight: 'bold',
  },
  infoTextInfomation: {
    fontSize: 14,
    fontWeight: 'bold',
    padding: 10,
    top: 5,
  },
  contentInformation:{
    backgroundColor: 'white',
    padding: 10,
    top: 5,
  },
  contentSeat:{
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    height: 35,
    justifyContent: "space-around",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "#fff",
    width: 130,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: '#FFA500',
  },
  buttonText: {
    color: "#FFA500",
    fontSize: 14,
    fontWeight: "bold",
  },
  infoText1:{
    fontSize: 16,
    padding: 5,
    fontWeight: 'bold',
    color: '#FFA500',
  },
  contentPayMent:{
    backgroundColor: 'white',
    padding: 10,
    top: 5,
    height: 330,
  },
  contentTabPayMent:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  contentTab2PayMent:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo:{
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  textPayMent:{
    fontSize: 16,
    fontWeight: 'bold',
    padding: 10,
    flexWrap: 'wrap',
    width: 310,
  },
  contentFooter:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    top: 80,
    backgroundColor: 'white',
    height: 80,
    left: -10,
    width: 420,
    alignItems:"center",
  },
  contentFooterLeft:{
    flexDirection: 'row',
  },
  button1: {
    height: 45,
    justifyContent: "space-around",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "#fff",
    width: 130,
    flexDirection: "row",
    backgroundColor: '#FFA500',

  },
  buttonText1: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
