import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Platform, KeyboardAvoidingView, Image } from 'react-native'
import React from 'react'
import { AntDesign } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';

export default function Account({navigation}) {

  return (
    <KeyboardAvoidingView contentContainerStyle={styles.contain}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.contain}
    >
      <StatusBar />
      <View style={styles.header}>
        <Text style={styles.headerText}>Tài khoản</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Setting")}>
          <AntDesign name="setting" size={28} color="#000080" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Image source={require('../img/account_cover.jpg')} style={styles.logoCover}/>
        <View style={styles.textContent}>
          <Text style={styles.textContent1}>Đăng ký thành viên Start</Text>
          <Text style={styles.textContent1}>Nhận ngay ưu đãi!</Text>
        </View>
        <View style={styles.contentMenu}> 
          <View style={styles.contentMenu1}>
            <Image source={require('../img/loyaltyPoints.jpg')} style={styles.contentMenu2}/>
            <Text style={styles.contentMenu3}>Tích điểm</Text>
          </View>

          <View style={styles.contentMenu1}>
            <Image source={require('../img/exchange.jpg')} style={styles.contentMenu2}/>
            <Text style={styles.contentMenu3}>Đổi quà</Text>
          </View>

          <View style={styles.contentMenu1}>
            <Image source={require('../img/special.jpg')} style={styles.contentMenu2}/>
            <Text style={styles.contentMenu3} >Ưu đãi đặc biệt  </Text>
          </View>
        </View>

        <View style={styles.contentButtom}>
          <TouchableOpacity style={{backgroundColor: '#FF7F24', width: '80%', height: 50, borderRadius: 5, alignSelf: 'center', marginTop: 30, flex: 1}}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={{color: 'white', textAlign: 'center', marginTop: 10}}>Đăng ký</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{borderColor: '#FF7F24',borderWidth: 2, width: '80%', height: 50, borderRadius: 5, alignSelf: 'center', marginTop: 30, flex: 1, marginLeft: 12}}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={{color: '#FF7F24', textAlign: 'center', marginTop: 10}}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{flexDirection: "column",  borderWidth: 1, width: "100%",   borderColor: "#DDDDDD",  justifyContent:"center", marginTop: 1}}></View>

      <View style={styles.contentfooter}>
        <Text style={styles.contentfooterText}>Email: hotro@galaxystudio.vn</Text>
        <Image source={require('../img/next.png')} style={styles.contentfooterImage}/>
      </View>

      <View style={styles.contentfooter}>
        <Text style={styles.contentfooterText}>Thông Tin Công Ty</Text>
        <Image source={require('../img/next.png')} style={styles.contentfooterImage}/>
      </View>

      <View style={styles.contentfooter}>
        <Text style={styles.contentfooterText}>Điều Khoản Sử Dụng</Text>
        <Image source={require('../img/next.png')} style={styles.contentfooterImage}/>
      </View>

      <View style={styles.contentfooter}>
        <Text style={styles.contentfooterText}>Chính Sách Thanh Toán</Text>
        <Image source={require('../img/next.png')} style={styles.contentfooterImage}/>
      </View>

      <View style={styles.contentfooter}>
        <Text style={styles.contentfooterText}>Chính Sách Bảo Mật</Text>
        <Image source={require('../img/next.png')} style={styles.contentfooterImage}/>
      </View>

      <View style={styles.contentfooter}>
        <Text style={styles.contentfooterText}>Câu Hỏi Thương Gặp</Text>
        <Image source={require('../img/next.png')} style={styles.contentfooterImage}/>
      </View>

     
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  contain: {
    flex: 1.2,
    alignItems: 'center',
    backgroundColor: 'lightgray',
    paddingTop: 35,
    backgroundColor: 'white'
  },
  header: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignSelf: 'flex-start',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 10,
},
headerText: {
    fontWeight: 'bold',
    fontSize: 20
},
content: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',

},
logoCover: {
    width: 200,
    height: 190,
    borderRadius: 100,
    alignSelf: 'center',
},
textContent: {
    alignItems: 'center',
    marginTop: 10
},
textContent1:{
  textAlign: 'center',
  fontSize: 17,
  fontWeight: 'bold'
},
contentMenu: {
    flexDirection: 'row',
    height: 70,
    marginTop: 20,
    paddingHorizontal: 10,
    width: '80%',
    justifyContent: 'space-between',
},
contentMenu1: {
    flexDirection: 'column',
    flex: 1,
},
contentMenu2: {
    width: "100%",
    height: "90%",
    resizeMode: "contain",
},
contentMenu3: {
    fontSize: 12,
    textAlign: "center"
},
contentButtom:{
  flexDirection: "row", 
  justifyContent: "space-between", 
  paddingHorizontal: 45
},

contentfooter:{
  flexDirection: "column",  
  borderWidth: 0.5, 
  height: 50, 
  width: "100%",  
  borderColor: "#DDDDDD", 
  justifyContent:"center", 
  marginTop: 0.5
},
contentfooterText:{
  marginLeft: 15
},
contentfooterImage:{
  width: 10, 
  height: 11, 
  position: "absolute", 
  right: 15
}

})