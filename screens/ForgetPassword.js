import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  Image,
  TextInput,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import { API_forgotPassword } from "../api/Api";

export default function ForgetPassword({ navigation }) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      return "Email không được để trống.";
    } else if (!emailPattern.test(email)) {
      return "Email không đúng định dạng.";
    }
    return "";
  };

  const handleSubmit = async () => {
    const emailError = validateEmail(email);
    if (emailError) {
      setEmailError(emailError);
      return;
    }

    try {
      const response = await fetch(API_forgotPassword, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        Alert.alert("Thành công", "Đã gửi email kích hoạt đến địa chỉ của bạn.");
        navigation.navigate("Login");
      } else {
        const errorData = await response.json();
        Alert.alert("Lỗi", errorData.message || "Đã có lỗi xảy ra.");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể kết nối đến máy chủ.");
    }
  };

  return (
    <KeyboardAvoidingView
      contentContainerStyle={styles.contain}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.contain}
    >
      <StatusBar />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <AntDesign name="arrowleft" size={28} color="#0000DD" />
        </TouchableOpacity>
      </View>
      <View style={styles.contentPasswrod}>
        <Text style={styles.contentText}>Quên mật khẩu?</Text>
        <Text style={styles.textInl}>
          Vui lòng cung cấp email đăng nhập, chúng tôi sẽ
        </Text>
        <Text style={styles.textInl}>gửi link kích hoạt cho bạn</Text>
      </View>
      <View style={styles.contentInput}>
        <View style={styles.inputContainer}>
          <Icon name="envelope" size={20} style={styles.icon} />
          <TextInput
            style={[styles.inputRepair, emailError && styles.inputError]}
            placeholder="Nhập email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setEmailError(""); // Clear error on change
            }}
            onBlur={() => setEmailError(validateEmail(email))}
          />
        </View>
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.buttonUpdate} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Lưu lại</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  contain: {
    flex: 1.2,
    backgroundColor: "lightgray",
    paddingTop: 35,
    backgroundColor: "white",
  },
  header: {
    backgroundColor: "white",
    flexDirection: "row",
    alignSelf: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  inputContainer: {
    flexDirection: "row", // Đặt icon và TextInput cùng hàng
    alignItems: "center", // Canh giữa icon và TextInput theo chiều dọc
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 5,
    backgroundColor: "white",
    marginVertical: 8,
    marginLeft: 20,
    paddingLeft: 10, // Khoảng cách giữa khung và icon
    width: "90%",
    height: 50,
    marginTop: "5%",
  },
  icon: {
    marginRight: 10, // Khoảng cách giữa icon và TextInput
    color: "grey",
  },
  inputRepair: {
    flex: 1, // Đảm bảo TextInput chiếm hết không gian còn lại
    height: "90%", // Chiều cao khớp với `inputContainer`
    padding: 10,
  },
  footer: {
    flex: 0.1,
    backgroundColor: "white",
    padding: 10,
  },
  buttonUpdate: {
    width: "90%",
    top: "3%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 20,
    backgroundColor: "#FFA500",
    marginLeft: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  contentPasswrod: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: "20%",
  },
  contentText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: "5%",
  },
  textInl: {
    fontSize: 15,
    color: "gray",
  },
  contentInput:{
    flex: 0.8,
    backgroundColor: "white",
    padding: 10,
  },
  errorText: {
    color: "red",
    marginTop: 2,
    width: "90%",
    left: 20,
    alignSelf: "flex-start",
  },
});
