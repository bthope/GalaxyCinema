import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Platform, KeyboardAvoidingView, Image } from 'react-native'
import React from 'react'
import { AntDesign } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';


export default function Setting({navigation}) {
  return (
   <KeyboardAvoidingView contentContainerStyle={styles.contain}
   behavior={Platform.OS === "ios" ? "padding" : "height"}
   style={styles.contain}
   >
    <StatusBar />
    <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("MainTabs")}>
          <AntDesign name="arrowleft" size={28} color="#0000DD" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Cài đặt</Text>
    </View>
    <View style={styles.contentfooter}> 
        <Text style={styles.contentfooterText}>Vị trí hiện tại</Text>
    </View>
    <View style={styles.contentfooter}>
        <Text style={styles.contentfooterText}>Quyền thông báo</Text>
    </View>
    <View style={styles.contentfooter1}>
        <Text style={styles.contentfooterText}>Ngôn ngữ</Text>
        <View style={{flexDirection: 'row', marginLeft:"50%"}}>
            <Text style={{color: 'gray'}}>Tiếng Việt </Text>
            <AntDesign name="right" size={20} color="gray" style={{marginLeft: 10}} />
        </View>
    </View>
    <View style={styles.contentfootert}>
        <Text style={styles.contentfooterTextt}>Galaxy Cinema phiên bản 3.5.7</Text>
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
        backgroundColor: '#E8E8E8'
      },
      header: {
        backgroundColor: 'white',
        flexDirection: 'row',
        alignSelf: 'flex-start',
        justifyContent: 'flex-start',
        borderBottomWidth: 0.5,
        width: '100%',
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 20,
        marginLeft: 25,
    },
    contentfooter:{
        flexDirection: "column",  
        borderWidth: 0.5, 
        height: 60, 
        width: "100%",  
        borderColor: "#DDDDDD", 
        justifyContent:"center", 
        marginTop: 0.5,
        backgroundColor: 'white',
        borderBottomWidth: 0.5,
        borderBottomColor: "#DDDDDD",
    },
    contentfooterText:{
        marginLeft: 15,
        fontSize: 17,
    },
    contentfootert:{
        flexDirection: "column",  
        borderWidth: 0.5, 
        height: 60, 
        width: "100%",  
        borderColor: "#DDDDDD", 
        justifyContent:"center", 
        marginTop: 0.5,
        borderBottomWidth: 0.5,
        borderBottomColor: "#DDDDDD",
    },
    contentfooterTextt:{
        marginLeft: 15,
    },
    contentfooter1:{
        flexDirection: "row",  
        borderWidth: 0.5, 
        height: 60, 
        width: "100%",  
        borderColor: "#DDDDDD", 
        justifyContent:"felx-start",
        alignItems: 'center',
        marginTop: 0.5,
        backgroundColor: 'white',
        borderBottomWidth: 0.5,
        borderBottomColor: "#DDDDDD",
    },


})