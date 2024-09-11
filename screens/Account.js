import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Platform, KeyboardAvoidingView, Image } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Account({ navigation }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to check login status
  const [userData, setUserData] = useState(null); // State to hold user data
  const [loading, setLoading] = useState(true); // State to handle loading state

    // Function to load user data from AsyncStorage
    const loadUserData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('userInfo'); // Retrieve data
        if (storedUserData) {
          setUserData(JSON.parse(storedUserData)); // Parse and set user data
          setIsLoggedIn(true); // Set login status to true
        } else {
          setIsLoggedIn(false); // Set login status to false
        }
      } catch (error) {
        console.log('Failed to load user data:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };
  
    // Automatically load data when the screen is focused or re-focused
    useFocusEffect(
      useCallback(() => {
        loadUserData();
      }, [])
    );
  

    // Show loading indicator while fetching user data
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      );
    }

  // Function to handle logout
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userInfo'); // Remove user data from AsyncStorage
      setUserData(null); // Clear user data from state
      setIsLoggedIn(false); // Set login status to false
    } catch (error) {
      console.log('Failed to log out:', error);
    }
  };


  return (
    <KeyboardAvoidingView
      contentContainerStyle={styles.contain}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.contain}
    >
      <StatusBar />
      <View style={styles.header}>
        <Text style={styles.headerText}>Tài khoản</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Setting')}>
          <AntDesign name="setting" size={28} color="#000080" />
        </TouchableOpacity>
      </View>
      {isLoggedIn ? (
        // AccountLogin component content when user is logged in
        <View style={styles.content}>
         
          <View style={styles.infoContent}>
            <Image source={require('../img/person.png')} style={styles.imgPerson} />
            <View style={styles.infoBettewConten}>
              <View style={styles.infoname}>
                <Image source={require('../img/medal.png')} style={styles.imgName} />
                <Text style={styles.textinforname}>{userData ? userData.name : 'Loading...'}</Text>
              </View>
              <View style={styles.infoname}>
                <Image source={require('../img/gift.png')} style={styles.imgName} />
                <Text style={styles.textinforname}>0 Stars</Text>
              </View>
            </View>
            <View style={styles.infoRightcontent}>
              <TouchableOpacity>
                <Image source={require('../img/pr.jpg')} style={styles.imgQR} />
                <Text style={{ color: '#FFA500', textAlign: 'center', marginTop: 5, width: 100, right:20 }}>Mã thành viên</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.contentinforuser}>
            <View style={styles.contentTT}>
              <Image source={require('../img/pencil.png')} style={styles.imgUser} />
              <Text style={{ color: 'black', textAlign: 'center', marginTop: 5, width: 100 }}>Thông tin</Text>
            </View>
            <View style={styles.contentTT2}>
              <Image source={require('../img/undo.png')} style={styles.imgUser} />
              <Text style={{ color: 'black', textAlign: 'center', marginTop: 5, width: 100 }}>Giao dịch</Text>
            </View>
            <View style={styles.contentTT3}>
              <Image source={require('../img/bell.png')} style={styles.imgUser} />
              <Text style={{ color: 'black', textAlign: 'center', marginTop: 5, width: 100 }}>Thông báo</Text>
            </View>
            
          </View>
          <View style={{flexDirection: "column",  borderBottomWidth: 2, width: 420,   borderColor: "#DDDDDD",  justifyContent:"center", marginTop: 30}}></View>

          <View style={styles.contentgrift}>
            <View style={{left: 40}}>
                <TouchableOpacity>
                    <Image source={require('../img/startAccount.jpg')} style={styles.imggift}/>
                    <Text style={{color: 'blue', textAlign: 'center', marginTop: 5, width: 100}}>Đổi Quà</Text>
                </TouchableOpacity>
            </View>
            <View style={{left: 40}}>
                <TouchableOpacity>
                    <Image source={require('../img/giftAccount.jpg')} style={styles.imggift}/>
                    <Text style={{color: 'blue', textAlign: 'center', marginTop: 5, width: 100}}>My Rewards</Text>
                </TouchableOpacity>
            </View>
            <View style={{right: -30}}>
                <TouchableOpacity>
                    <Image source={require('../img/kc.jpg')} style={styles.imggift}/>
                    <Text style={{color: 'blue', textAlign: 'center', marginTop: 5, width: 100}}>Gói hội viên</Text>
                </TouchableOpacity>
            </View>
        </View>
        </View>

        
      ) : (
        // Account component content when user is not logged in
        <View style={styles.content}>
          <Image source={require('../img/account_cover.jpg')} style={styles.logoCover} />
          <View style={styles.textContent}>
            <Text style={styles.textContent1}>Đăng ký thành viên Start</Text>
            <Text style={styles.textContent1}>Nhận ngay ưu đãi!</Text>
          </View>
          <View style={styles.contentMenu}>
            <View style={styles.contentMenu1}>
              <Image source={require('../img/loyaltyPoints.jpg')} style={styles.contentMenu2} />
              <Text style={styles.contentMenu3}>Tích điểm</Text>
            </View>
            <View style={styles.contentMenu1}>
              <Image source={require('../img/exchange.jpg')} style={styles.contentMenu2} />
              <Text style={styles.contentMenu3}>Đổi quà</Text>
            </View>
            <View style={styles.contentMenu1}>
              <Image source={require('../img/special.jpg')} style={styles.contentMenu2} />
              <Text style={styles.contentMenu3}>Ưu đãi đặc biệt</Text>
            </View>
          </View>
          <View style={styles.contentButtom}>
            <TouchableOpacity
              style={{ backgroundColor: '#FF7F24', width: '80%', height: 50, borderRadius: 5, alignSelf: 'center', marginTop: 30, flex: 1 }}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={{ color: 'white', textAlign: 'center', marginTop: 10 }}>Đăng ký</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ borderColor: '#FF7F24', borderWidth: 2, width: '80%', height: 50, borderRadius: 5, alignSelf: 'center', marginTop: 30, flex: 1, marginLeft: 12 }}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={{ color: '#FF7F24', textAlign: 'center', marginTop: 10 }}>Đăng nhập</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Footer Section */}
      <View style={{ flexDirection: 'column', borderWidth: 1, width: '100%', borderColor: '#DDDDDD', justifyContent: 'center', marginTop: 1 }}></View>

      {/* Footer Links */}
      {['Email: hotro@galaxystudio.vn', 'Thông Tin Công Ty', 'Điều Khoản Sử Dụng', 'Chính Sách Thanh Toán', 'Chính Sách Bảo Mật', 'Câu Hỏi Thường Gặp'].map((item, index) => (
        <View style={styles.contentfooter} key={index}>
          <Text style={styles.contentfooterText}>{item}</Text>
          <Image source={require('../img/next.png')} style={styles.contentfooterImage} />
        </View>
      ))}

      {/* Logout Option */}
      {isLoggedIn && (
        <View style={styles.contentfooterLogout}>
          <TouchableOpacity onPress={() => setIsLoggedIn(false)}>
            <Text style={styles.contentfooterTextLogout}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // Container styles
  contain: {
    flex: 1.2,
    alignItems: 'center',
    backgroundColor: 'white',
    paddingTop: 35,
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
    fontSize: 20,
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },

  // Account-specific styles
  logoCover: {
    width: 200,
    height: 190,
    borderRadius: 100,
    alignSelf: 'center',
  },
  textContent: {
    alignItems: 'center',
    marginTop: 10,
  },
  textContent1: {
    textAlign: 'center',
    fontSize: 17,
    fontWeight: 'bold',
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
    textAlign: "center",
  },
  contentButtom: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 45,
  },

  // AccountLogin-specific styles
  infoContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    
    borderColor: "#DDDDDD",
  },
  imgPerson: {
    width: 70,
    height: 70,
    resizeMode: "contain",
    left: 10,
    top: 10,
  },
  textinforname: {
    fontSize: 18,
    fontWeight: "bold",
  },
  infoBettewConten: {
    flexDirection: "column",
    justifyContent: "center",
    width: 200,
    height: 80,
    top: 5,
    left: -10,
  },
  infoname: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  imgName: {
    width: 20,
    height: 20,
    resizeMode: "contain",
    marginRight: 5,
    top: 10,
  },
  infoRightcontent: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: 80,
    height: 80,
    borderRadius: 40,
    top: 6,
  },
  imgQR: {
    width: 50,
    height: 50,
    resizeMode: "center",
    left: 5,
  },
  contentgrift: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    left: -40,
    flex: 0.2,
  },
  imggift: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  contentinforuser: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: -10,
    flex: 0.3,
    
  },
  imgUser: {
    width: 20,
    height: 20,
    resizeMode: "contain",
    left: 10,
    top: 2,
  },
  contentTT: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    height: 100,
    left: 5,
  },
  contentTT2: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    height: 100,
  },
  contentTT3: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    height: 100,
    right: -10,
  },

  // Footer styles
  contentfooter: {
    flexDirection: "column",
    borderWidth: 0.5,
    height: 50,
    width: "100%",
    borderColor: "#DDDDDD",
    justifyContent: "center",
    marginTop: 0.5,
  },
  contentfooterText: {
    marginLeft: 15,
  },
  contentfooterImage: {
    width: 10,
    height: 11,
    position: "absolute",
    right: 15,
  },
  contentfooterLogout: {
    flexDirection: "column",
    borderWidth: 2,
    height: 50,
    width: "100%",
    borderColor: "#DDDDDD",
    justifyContent: "center",
    marginTop: 0.5,
  },
  contentfooterTextLogout: {
    textAlign: "center",
    color: "#FFA500",
    fontWeight: "bold",
    fontSize: 18,
  },
});


