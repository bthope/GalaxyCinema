import React, { useState, useMemo } from "react";
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
import { StatusBar } from "expo-status-bar";
import Icon from "react-native-vector-icons/FontAwesome";
import DateTimePicker from "@react-native-community/datetimepicker";
import RadioGroup from "react-native-radio-buttons-group";
import { API_CheckOTPEmail, API_Register } from "../api/Api";
import Modal from 'react-native-modal';

export default function Register({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedGender, setSelectedGender] = useState();
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const [errors, setErrors] = useState({});

  const [isModalVisible, setModalVisible] = useState(false); // Hiển thị modal OTP
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']); // Lưu OTP nhập từ người dùng

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios");
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const radioButtons = useMemo(
    () => [
      { id: "1", label: "Nam", value: "male" },
      { id: "2", label: "Nữ", value: "female" },
    ],
    []
  );

  const validateField = (fieldName, value) => {
    let error = '';

    switch (fieldName) {
      case 'name':
        if (!value.trim()) {
          error = "Vui lòng nhập họ và tên.";
        }
        break;
      case 'email':
        if (!value.trim()) {
          error = "Vui lòng nhập email.";
        } else if (!value.includes("@gmail.com")) {
          error = "Email phải có dạng @gmail.com.";
        }
        break;
      case 'phone':
        if (!value.trim()) {
          error = "Vui lòng nhập số điện thoại.";
        } else if (!/^\d{10,11}$/.test(value)) {
          error = "Số điện thoại phải có 10 hoặc 11 chữ số.";
        }
        break;
      case 'password':
        if (!value.trim()) {
          error = "Vui lòng nhập mật khẩu.";
        }
        break;
      case 'confirmPassword':
        if (!value.trim()) {
          error = "Vui lòng nhập lại mật khẩu.";
        } else if (password !== value) {
          error = "Mật khẩu không khớp.";
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

  const handleRegister = async () => {
    // Check if there are any errors
    if (Object.values(errors).some((error) => error)) {
      Alert.alert("Lỗi", "Vui lòng kiểm tra lại các trường.");
      return;
    }

    const genderValue = selectedGender === "1"; // true for 'Nam', false for 'Nữ'

    const userData = {
      name,
      email,
      phone,
      gender: genderValue,
      birthday: date.toISOString().split('T')[0], // Format: YYYY-MM-DD
      password,
    };

    try {
      const response = await fetch(API_Register, { // Replace with your machine's IP
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        setModalVisible(true); // Hiển thị modal OTP sau khi đăng ký thành công
      } else {
        const errorData = await response.json();
        Alert.alert("Đăng ký thất bại", errorData.message || "Đã có lỗi xảy ra.");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể kết nối đến máy chủ.");
    }
  };

  const handleOTPChange = (value, index) => {
    let newOtpCode = [...otpCode];
    newOtpCode[index] = value;
    setOtpCode(newOtpCode);
  };
  const validateOTP = async () => {
    const otp = otpCode.join('');
    if (otp.length !== 6) {
      Alert.alert('Lỗi', 'Mã OTP phải đủ 6 ký tự.');
      return;
    }

    try {
      const response = await fetch(API_CheckOTPEmail, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ otp, email }),
      });

      if (response.ok) {
        Alert.alert("Xác thực OTP thành công!", "Chuyển đến trang đăng nhập.");
        setModalVisible(false); // Ẩn modal OTP
        navigation.navigate('Login');
      } else {
        const errorData = await response.json();
        Alert.alert("Xác thực OTP thất bại", errorData.message || "OTP không chính xác.");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể xác thực OTP.");
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
        <Image
          source={require("../img/close.png")}
          style={{ width: 20, height: 30, marginLeft: 10 }}
          resizeMode="contain"
          onStartShouldSetResponder={() => navigation.navigate("MainTabs")}
        />
      </View>

      <ScrollView contentContainerStyle={styles.content} style={styles.scrollView}> 
        <Image
          source={require("../img/account_cover.jpg")}
          style={styles.logoCover}
        />
        <View style={styles.textContent}>
          <Text style={styles.textContent1}>Đăng ký thành viên Start</Text>
          <Text style={styles.textContent1}>Nhận ngay ưu đãi!</Text>
        </View>
        
        {/* Content Menu */}
        <View style={styles.contentMenu}>
          <View style={styles.contentMenu1}>
            <Image
              source={require("../img/loyaltyPoints.jpg")}
              style={styles.contentMenu2}
            />
            <Text style={styles.contentMenu3}>Tích điểm</Text>
          </View>

          <View style={styles.contentMenu1}>
            <Image
              source={require("../img/exchange.jpg")}
              style={styles.contentMenu2}
            />
            <Text style={styles.contentMenu3}>Đổi quà</Text>
          </View>

          <View style={styles.contentMenu1}>
            <Image
              source={require("../img/special.jpg")}
              style={styles.contentMenu2}
            />
            <Text style={styles.contentMenu3}>Ưu đãi đặc biệt </Text>
          </View>
        </View>

        {/* Input Fields */}
        <View style={styles.inputContainer}>
          <Icon name="user" size={23} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Họ và tên"
            placeholderTextColor="grey"
            value={name}
            onChangeText={setName}
            onBlur={() => validateField('name', name)}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Icon name="envelope" size={20} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Nhập Email"
            placeholderTextColor="grey"
            value={email}
            onChangeText={setEmail}
            onBlur={() => validateField('email', email)}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Icon name="phone" size={20} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Nhập số điện thoại"
            placeholderTextColor="grey"
            value={phone}
            onChangeText={setPhone}
            onBlur={() => validateField('phone', phone)}
            keyboardType="numeric"
          />
          {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
        </View>

        <View style={styles.inputContainerRadio}>
          <RadioGroup
            radioButtons={radioButtons}
            onPress={setSelectedGender}
            layout="row"
            selectedId={selectedGender}
          />
        </View>

        <View style={styles.inputContainer}>
          <TouchableOpacity onPress={showDatepicker} style={styles.inputTouchable}>
            <Icon name="calendar" size={20} style={styles.icon} />
            <Text style={styles.dateText}>
              {date.toLocaleDateString("en-US")}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="spinner"
              onChange={onChangeDate}
            />
          )}
        </View>

        <View style={styles.inputContainer}>
          <Icon name="lock" size={22} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Nhập mật khẩu"
            placeholderTextColor="grey"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
            onBlur={() => validateField('password', password)}
          />
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Icon name="lock" size={22} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Nhập lại mật khẩu"
            placeholderTextColor="grey"
            secureTextEntry={true}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            onBlur={() => validateField('confirmPassword', confirmPassword)}
          />
          {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Hoàn tất</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal OTP */}
      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Nhập mã OTP</Text>
          <View style={styles.otpContainer}>
            {otpCode.map((digit, index) => (
              <TextInput
                key={index}
                style={styles.otpInput}
                maxLength={1}
                keyboardType="numeric"
                value={digit}
                onChangeText={(value) => handleOTPChange(value, index)}
              />
            ))}
          </View>
          <TouchableOpacity style={styles.button} onPress={validateOTP}>
            <Text style={styles.buttonText}>Xác thực OTP</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Tài khoản đã được đăng ký ! </Text>
          <TouchableOpacity
            style={styles.signupButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.signupButtonText}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
    </KeyboardAvoidingView>
  );
}



const styles = StyleSheet.create({
  contain: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "lightgray",
    paddingTop: 35,
    backgroundColor: "white",
  },
  scrollView: {
    flex: 1,  // Ensures the ScrollView takes up the available space
  },
  header: {
    backgroundColor: "white",
    flexDirection: "row",
    alignSelf: "flex-start",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 20,
  },
  content: {
    
    flexDirection: "column",
    backgroundColor: "white",
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  logoCover: {
    top: -25,
    width: 100,
    height: 140,
    borderRadius: 100,
    alignSelf: "center",
  },
  textContent: {
    alignItems: "center",
    marginTop: -15,
  },
  textContent1: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "bold",
  },
  contentMenu: {
    flexDirection: "row",
    height: 70,
    marginTop: 2,
    paddingHorizontal: 10,
    width: "80%",
    justifyContent: "space-between",
    marginLeft: 40,
  },
  contentMenu1: {
    flexDirection: "column",
    flex: 1,
  },
  contentMenu2: {
    width: "100%",
    height: "70%",
    resizeMode: "contain",
  },
  contentMenu3: {
    fontSize: 12,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 15,
  },
  icon: {
    position: "absolute",
    left: 10,
    top: 10,
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
  dateText: {
    marginLeft: -10,
    borderWidth: 0,
    alignItems: "flex-start",
    paddingLeft: 10,
    color: "black",
    fontSize: 16,
    justifyContent: "center",
  },

  inputTouchable: {
    width: 380,
    height: 40,
    borderColor: "grey",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 40,
    flexDirection: "row",
    alignItems: "center",
  },
  inputContainerRadio: {
    flexDirection: "row",
    alignItems: "felx-start",
    marginTop: 15,
  },

  button: {
    width: "100%",
    top: "2%",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 20,
    backgroundColor: "#FFA500",
  },
  signupButton: {
    borderColor: "#FFA500",
    borderWidth: 1,
    borderRadius: 5,
    marginLeft: 5,
    paddingVertical: 5,
    paddingHorizontal: 17,
  },
  signupButtonText: {
    fontSize: 13,
    color: "#FFA500",
    fontWeight: "bold",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginBottom: 10,

  },
  errorText: {
    color: 'red',
    fontSize: 10,
    marginTop: 5,
    alignSelf: 'flex-start',
    width: 380,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  otpInput: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    width: 40,
    height: 40,
    textAlign: 'center',
    fontSize: 18,
    marginRight: 10,
  },

});