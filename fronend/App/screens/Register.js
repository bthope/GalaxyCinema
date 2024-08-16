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
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Icon from "react-native-vector-icons/FontAwesome";
import DateTimePicker from "@react-native-community/datetimepicker";
import RadioGroup from "react-native-radio-buttons-group";

export default function Register({ navigation }) {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios");
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const radioButtons = useMemo(() => ([
    { id: '1', label: 'Nam', value: 'male' },
    { id: '2', label: 'Nữ', value: 'female' }
  ]), []);

  const [selectedId, setSelectedId] = useState();

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

      <ScrollView contentContainerStyle={styles.content}>
        <Image
          source={require("../img/account_cover.jpg")}
          style={styles.logoCover}
        />
        <View style={styles.textContent}>
          <Text style={styles.textContent1}>Đăng ký thành viên Start</Text>
          <Text style={styles.textContent1}>Nhận ngay ưu đãi!</Text>
        </View>
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

        <View style={styles.inputContainer}>
          <Icon name="user" size={23} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Họ và tên"
            placeholderTextColor="grey"
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="envelope" size={20} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Nhập Email"
            placeholderTextColor="grey"
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="phone" size={20} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Nhập số điện thoại"
            placeholderTextColor="grey"
          />
        </View>

        <View style={styles.inputContainerRadio}>
          <RadioGroup 
            radioButtons={radioButtons} 
            onPress={setSelectedId}
            layout="row" 
            selectedId={selectedId}
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
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="lock" size={22} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Nhập lại mật khẩu"
            placeholderTextColor="grey"
            secureTextEntry={true}
          />
        </View>

        <TouchableOpacity
        style={styles.button}
      >
        <Text style={styles.buttonText}>Hoàn tất</Text>
      </TouchableOpacity>

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Tài khoản đã được đăng ký ! </Text>
        <TouchableOpacity
          style={styles.signupButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.signupButtonText}
          >Đăng nhập</Text>
        </TouchableOpacity>
      </View>

      </ScrollView>
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
    flex: 1,
    flexDirection: "column",
    backgroundColor: "white",
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
    marginTop: -30,
    top: "28%",
    justifyContent: "center",
    alignItems: "center",
  },
});
