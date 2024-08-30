import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome"; // Import thư viện FontAwesome hoặc thư viện icon khác
import { useNavigation, useRoute } from "@react-navigation/native";

export default function Login({ navigation }) {
  return (
    <View style={styles.container}>
      <Image
        source={require("../img/close.png")}
        style={styles.closes}
        resizeMode="contain"
        onStartShouldSetResponder={() => navigation.navigate('MainTabs')}
      />
      <Image
        source={require("../img/LoginLogo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <View style={styles.inputContainer}>
        <Icon name="envelope" size={20} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Nhập Email"
          placeholderTextColor="grey"
          onChangeText={(text) => setEmail(text)}
        />
      </View>
      <View style={{flex: 0.1}}></View>
      <View style={styles.inputContainer}>
        <Icon name="lock" size={27} style={{position: "absolute", left: 10, top: 8, color: "grey"}} />
        <TextInput
          style={styles.input}
          placeholder="Nhập mật khẩu"
          placeholderTextColor="grey"
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
        />
      </View>

      <TouchableOpacity style={styles.forgotPass}>
        <Text style={styles.forgotPasswordText}>Quên mật khẩu ?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
      >
        <Text style={styles.buttonText}>Đăng nhập</Text>
      </TouchableOpacity>
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Không có tài khoản!</Text>
        <TouchableOpacity
          style={styles.signupButton}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.signupButtonText}
          >Đăng ký</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#ffffff",
  },
  closes:{
    top: "-6%",
    left: "-45%",
    color: "#0000AA",
    width: "100%",
    height: "2.3%",
  },
  logo: {
    width: "100%",
    height: "30%",
    marginBottom: "5%",
    marginTop: "3%",
  },
  inputContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 10,
    borderBlockColor: "grey",
  },
  
  icon: {
    position: "absolute",
    left: 10,
    top: 12,
    color: "grey",
  },
  input: {
    width: 380,
    height: 40,
    borderColor: "grey",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 40,
    color: "grey",
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginTop: 2,
    alignSelf: "flex-start",
    marginLeft: 10,
  },
  button: {
    width: "100%",
    top: "3%",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 20,
    backgroundColor: "#FFA500",
  },
  buttonDisabled: {
    backgroundColor: "lightgray",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  forgotPasswordText: {
    marginTop: 10,
    color: "#000088",
    fontWeight: "bold",
    fontSize: 14,
  },
  forgotPass: {
    alignSelf: "flex-end",
  },
  signupContainer: {
    flexDirection: "row",
    marginTop: 80,
    top: "28%",
    justifyContent: "center",
    alignItems: "center",
  },
  signupText: {
    fontSize: 400,
    fontSize: 16,
    marginTop: 10,
    color: "black",
    fontWeight: "bold",
    top: "-1%",
  },
  signupButton: {
    borderColor: "#FFA500",
    borderWidth: 1,
    borderRadius: 5,
    marginLeft: 12,
    paddingVertical: 5,
    paddingHorizontal: 17,
  },
  signupButtonText: {
    fontSize: 14,
    color: "#FFA500",
    fontWeight: "bold",
  },
});
