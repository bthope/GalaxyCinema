import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import React, { useCallback, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import { API_EditPassword } from "../api/Api";

export default function EditPassWord({ navigation }) {
  const [userData, setUserData] = useState();
  const [loading, setLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // State để lưu lỗi
  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=])(?=\S+$).{8,32}$/;

  const loadUserData = async () => {
    try {
      const storedUserData = await AsyncStorage.getItem("userInfo"); // Lấy dữ liệu user từ AsyncStorage
      if (storedUserData) {
        setUserData(JSON.parse(storedUserData)); // Lưu userData vào state
      }
    } catch (error) {
      console.log("Failed to load user data:", error);
    } finally {
      setLoading(false); // Dừng loading sau khi lấy dữ liệu
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadUserData();
    }, [])
  );
  const validateInput = (fieldName, value) => {
    let errorMessage = "";
  
    switch (fieldName) {
      case "currentPassword":
        if (!value.trim()) {
          errorMessage = "Mật khẩu hiện tại không được để trống.";
        }
        break;
      case "newPassword":
        if (!value.trim()) {
          errorMessage = "Mật khẩu mới không được để trống.";
        } else if (!passwordPattern.test(value)) {
          errorMessage =
            "Mật khẩu mới phải chứa ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt.";
        }
        break;
      case "confirmPassword":
        if (!value.trim()) {
          errorMessage = "Nhập lại mật khẩu mới không được để trống.";
        } else if (value !== newPassword) {
          errorMessage = "Mật khẩu mới và xác nhận mật khẩu không khớp.";
        }
        break;
      default:
        break;
    }
  
    return errorMessage;
  };
  
  

  const handleBlur = (inputName, value) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [inputName]: validateInput(inputName, value),
    }));
  };

  const handleChangePassword = async () => {
    // Kiểm tra tất cả các input trước khi submit
    if (
      validateInput("currentPassword", currentPassword) ||
      validateInput("newPassword", newPassword) ||
      validateInput("confirmPassword", confirmPassword)
    ) {
      return; // Nếu có lỗi, dừng lại và không gửi request
    }

    try {
      const response = await fetch(API_EditPassword, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.accessToken}`, // Thêm token vào header
        },
        body: JSON.stringify({
          currentPassword: currentPassword,
          newPassword: newPassword,
        }),
      });

      if (response.ok) {
        alert("Thay đổi mật khẩu thành công!");
        navigation.navigate("InformationPersonal");
      } else {
        const errorData = await response.json();
        alert(`Lỗi: ${errorData.message || "Thay đổi mật khẩu thất bại"}`);
      }
    } catch (error) {
      console.error("Error changing password:", error);
      alert("Đã xảy ra lỗi khi thay đổi mật khẩu.");
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
        <TouchableOpacity onPress={() => navigation.navigate("InformationPersonal")}>
          <AntDesign name="arrowleft" size={28} color="#0000DD" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Chỉnh sửa mật khẩu</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.info}>
          <Text style={styles.textTitle}>GALAXY CINEMA</Text>

          {/* Ô input mật khẩu hiện tại */}
          <View style={styles.inputContainer}>
            <Icon
              name="lock"
              size={27}
              style={{ position: "absolute", left: 10, top: 8, color: "grey" }}
            />
            <TextInput
              style={styles.inputRepair}
              placeholder="Mật khẩu hiện tại"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              onBlur={() => handleBlur("currentPassword", currentPassword)}
              secureTextEntry
            />
          </View>
          {errors.currentPassword ? (
            <Text style={styles.errorText}>{errors.currentPassword}</Text>
          ) : null}

          {/* Ô input mật khẩu mới */}
          <View style={styles.inputContainer}>
            <Icon
              name="lock"
              size={27}
              style={{ position: "absolute", left: 10, top: 8, color: "grey" }}
            />
            <TextInput
              style={styles.inputRepair}
              placeholder="Mật khẩu mới"
              value={newPassword}
              onChangeText={setNewPassword}
              onBlur={() => handleBlur("newPassword", newPassword)}
              secureTextEntry
            />
          </View>
          {errors.newPassword ? (
            <Text style={styles.errorText}>{errors.newPassword}</Text>
          ) : null}

          {/* Ô input nhập lại mật khẩu */}
          <View style={styles.inputContainer}>
            <Icon
              name="lock"
              size={27}
              style={{ position: "absolute", left: 10, top: 8, color: "grey" }}
            />
            <TextInput
              style={styles.inputRepair}
              placeholder="Nhập lại mật khẩu mới"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              onBlur={() => handleBlur("confirmPassword", confirmPassword)}
              secureTextEntry
            />
          </View>
          {errors.confirmPassword ? (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          ) : null}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.buttonUpdate} onPress={handleChangePassword}>
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
    borderBottomWidth: 0.5,
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 20,
    marginLeft: 25,
  },
  inputRepair: {
    flex: 1, 
    height: "100%", 
    padding: 10,
    left: 20,
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
  content: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
    justifyContent: "center",
  },
  info: {
    flex: 1,
    backgroundColor: "white",
    padding: 1,
    justifyContent: "center",
  },
  footer: {
    flex: 0.1,
    backgroundColor: "white",
    padding: 10,
  },
  textTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#0000DD",
    marginBottom: 20,
    fontFamily: "sans-serif",
  },
  inputContainer: {
    flexDirection: "row", 
    alignItems: "center", 
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 5,
    backgroundColor: "white",
    marginVertical: 8,
    marginLeft: 20,
    paddingLeft: 10, 
    width: "90%",
    height: 50,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginLeft: 20,
    marginTop: 5,
  },
});
