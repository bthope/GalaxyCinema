import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import { API_Login } from "../api/Api";
import { StatusBar } from "expo-status-bar";
import { AntDesign } from "@expo/vector-icons";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validateField = (fieldName, value) => {
    let error = "";

    switch (fieldName) {
      case "email":
        if (!value.trim()) {
          error = "Vui lòng nhập email.";
        } else if (!value.includes("@")) {
          error = "Email phải có dạng hợp lệ.";
        }
        break;
      case "password":
        if (!value.trim()) {
          error = "Vui lòng nhập mật khẩu.";
        }
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: error,
    }));
  };

  const handleLogin = async () => {
    // Validate fields
    validateField("email", email);
    validateField("password", password);

    if (Object.values(errors).some((error) => error)) {
      Alert.alert("Lỗi", "Vui lòng kiểm tra lại các trường.");
      return;
    }

    // Login API call
    try {
      const response = await fetch(API_Login, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const result = await response.json();
        const { data } = result;

        // Lưu thông tin đăng nhập vào AsyncStorage
        await AsyncStorage.setItem("userInfo", JSON.stringify(data));

        console.log("Đăng nhập thành công!", data);

        Alert.alert("Đăng nhập thành công!", "Chuyển đến trang Account.");
        navigation.navigate("MainTabs");
      } else {
        const errorData = await response.json();
        Alert.alert(
          "Đăng nhập thất bại",
          errorData.message || "Đã có lỗi xảy ra."
        );
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
        <TouchableOpacity onPress={() => navigation.navigate("MainTabs")}>
          <AntDesign name="close" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <Image
        source={require("../img/LoginLogo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <View style={styles.inputContainer}>
        <Icon name="envelope" size={20} style={styles.icon} />
        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          placeholder="Nhập Email"
          placeholderTextColor="grey"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setErrors((prev) => ({ ...prev, email: "" })); // Clear error on change
          }}
          onBlur={() => validateField("email", email)}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      </View>
      <View style={{ flex: 0.1 }}></View>
      <View style={styles.inputContainer}>
        <Icon
          name="lock"
          size={27}
          style={{ position: "absolute", left: 10, top: 8, color: "grey" }}
        />
        <TextInput
          style={[styles.input, errors.password && styles.inputError]}
          placeholder="Nhập mật khẩu"
          placeholderTextColor="grey"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setErrors((prev) => ({ ...prev, password: "" })); // Clear error on change
          }}
          secureTextEntry
          onBlur={() => validateField("password", password)}
        />
        {errors.password && (
          <Text style={styles.errorText}>{errors.password}</Text>
        )}
      </View>

      <TouchableOpacity style={styles.forgotPass}
        onPress={() => navigation.navigate("ForgetPassword")}
      >
        <Text style={styles.forgotPasswordText}>Quên mật khẩu ?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Đăng nhập</Text>
      </TouchableOpacity>
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Không có tài khoản!</Text>
        <TouchableOpacity
          style={styles.signupButton}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.signupButtonText}>Đăng ký</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  contain: {
    flex: 1.2,
    alignItems: "center",
    paddingTop: 40,
    backgroundColor: "white",
  },
  header: {
    backgroundColor: "white",

    alignSelf: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  closes: {
    color: "#0000AA",
    width: "100%",
    height: "5%",
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
    borderBottomWidth: 1,
    padding: 10,
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginTop: 2,
    alignSelf: "flex-start",
    width: 380,
  },
  button: {
    width: "90%",
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
    right: "5%",
  },
  forgotPass: {
    alignSelf: "flex-end",
  },
  signupContainer: {
    flexDirection: "row",
    marginTop: 80,
    top: "40%",
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
