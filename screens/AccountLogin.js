import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Platform, KeyboardAvoidingView, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AntDesign } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AccountLogin({navigation}) {
  const [userData, setUserData] = useState(null); // State to hold user data

  useEffect(() => {
    // Function to load user data from AsyncStorage
    const loadUserData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('userInfo'); // Retrieve data
        if (storedUserData) {
          setUserData(JSON.parse(storedUserData)); // Parse and set user data
        }
      } catch (error) {
        console.log('Failed to load user data:', error);
      }
    };

    loadUserData(); // Load data on component mount
  }, []);

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
        <View style={styles.infoContent}>
            <Image source={require('../img/person.png')} style={styles.imgPerson}/>
            <View style={styles.infoBettewConten}>
                <View style={styles.infoname}>
                    <Image source={require('../img/medal.png')} style={styles.imgName}/>
                    <Text style={styles.textinforname}>{userData ? userData.name : 'Loading...'}</Text>
                </View>
                <View style={styles.infoname}>
                    <Image source={require('../img/gift.png')} style={styles.imgName}/>
                    <Text style={styles.textinforname}>0 Stars</Text>
                </View>
            </View>
            <View style={styles.infoRightcontent}>
                <TouchableOpacity style={{}}>
                    <Image source={require('../img/pr.jpg')} style={styles.imgQR}/>
                    <Text style={{color: '#FFA500', textAlign: 'center', marginTop: 5, width: 100}}>Mã thành viên</Text>
                </TouchableOpacity>
            </View>
        </View>
        <View style={styles.contentinforuser}>
            <View style={styles.contentTT}>
                <Image source={require('../img/pencil.png')} style={styles.imgUser}/>
                <Text style={{color: 'black', textAlign: 'center', marginTop: 5, width: 100}}>Thông tin</Text>
            </View>

            <View style={styles.contentTT2}> 
                <Image source={require('../img/undo.png')} style={styles.imgUser}/>
                <Text style={{color: 'black', textAlign: 'center', marginTop: 5, width: 100}}>Giao dịch</Text>
            </View>

            <View style={styles.contentTT3}>
                <Image source={require('../img/bell.png')} style={styles.imgUser}/>
                <Text style={{color: 'black', textAlign: 'center', marginTop: 5, width: 100}}>Thông báo</Text>
            </View>
        </View>
      </View>
      

      <View style={{flexDirection: "column",  borderWidth: 1, width: "100%",   borderColor: "#DDDDDD",  justifyContent:"center", marginTop: 1}}></View>

      <View style={styles.contentgrift}>
            <View>
                <TouchableOpacity>
                    <Image source={require('../img/startAccount.jpg')} style={styles.imggift}/>
                    <Text style={{color: 'blue', textAlign: 'center', marginTop: 5, width: 100}}>Đổi Quà</Text>
                </TouchableOpacity>
            </View>
            <View style={{left: 50}}>
                <TouchableOpacity>
                    <Image source={require('../img/giftAccount.jpg')} style={styles.imggift}/>
                    <Text style={{color: 'blue', textAlign: 'center', marginTop: 5, width: 100}}>My Rewards</Text>
                </TouchableOpacity>
            </View>
            <View style={{left: 100}}>
                <TouchableOpacity>
                    <Image source={require('../img/kc.jpg')} style={styles.imggift}/>
                    <Text style={{color: 'blue', textAlign: 'center', marginTop: 5, width: 100}}>Gói hội viên</Text>
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

      <View style={styles.contentfooterLogout}>
        <TouchableOpacity onPress={() => navigation.navigate("MainTabs")}>
            <Text style={styles.contentfooterTextLogout}>Đăng xuất</Text>
        </TouchableOpacity> 
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
    flex: 0.4,
    flexDirection: 'column',
    backgroundColor: 'white',

},
infoContent:{
  flexDirection: "row",
  justifyContent: "space-around",
  marginTop: 10,
  borderWidthBottom: 1,
  borderColor: "#DDDDDD",
  
},
imgPerson:{
  width: 70,
  height: 70,
  resizeMode: "contain",
  left: -20,
  top: 10
},
textinforname:{
    fontSize: 18,
    fontWeight: "bold"
},
infoBettewConten:{
    flexDirection: "column",
    justifyContent: "center",
    width: 200,
    height: 80,
    top: 5,
    left: -10
},
infoname:{
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 10
  
},
imgName:{
  width: 20,
  height: 20,
  resizeMode: "contain",
  marginRight: 5,
  top: 10
},

infoRightcontent:{
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: 80,
  height: 80,
  borderRadius: 40,
  top: 6
},
imgQR:{
  width: 50,
  height: 50,
  resizeMode: "center",
  left: 25
},
contentgrift:{
  flexDirection: "row",
  justifyContent: "space-around",
  marginTop: 10,
  left: -55,
  flex: 0.4
},
imggift:{
  width: 100,
  height: 100,
  resizeMode: "contain"
},

contentinforuser:{
  flexDirection: "row",
  justifyContent: "space-around",
  marginTop: -10,
  flex: 0.3
},
imgUser:{
  width: 20,
  height: 20,
  resizeMode: "contain",
  left: 10,
  top: 2
},
contentTT:{
  flexDirection: "row",
  alignItems: "center",
    justifyContent: "center",
    width: 100,
    height: 100,
    left: -20
},
contentTT2:{
  flexDirection: "row",
  alignItems: "center",
    justifyContent: "center",
    width: 100,
    height: 100,
},
contentTT3:{
  flexDirection: "row",
  alignItems: "center",
    justifyContent: "center",
    width: 100,
    height: 100,
    right: -20
},

contentfooter:{
  flexDirection: "column",  
  borderWidth: 0.5, 
  height: 50, 
  width: "100%",  
  borderColor: "#DDDDDD", 
  justifyContent:"center", 
  marginTop: 0.5,
},
contentfooterText:{
  marginLeft: 15
},
contentfooterImage:{
  width: 10, 
  height: 11, 
  position: "absolute", 
  right: 15
},
contentfooterLogout:{
  flexDirection: "column",  
  borderWidth: 2, 
  height: 50, 
  width: "100%",  
  borderColor: "#DDDDDD", 
  justifyContent:"center", 
  marginTop: 0.5,
},
contentfooterTextLogout:{
  textAlign: "center",
  color: "#FFA500",
  fontWeight: "bold",
  fontSize: 18
},

})