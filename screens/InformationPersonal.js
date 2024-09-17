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
import React, { useCallback, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import { RadioButton } from "react-native-paper"; // Import RadioButton

export default function InformationPersonal({ navigation }) {
  // State to hold user data
  const [userData, setUserData] = useState({
    name: "",
    phone: "",
    birthday: "",
    email: "",
    gender: true, // Default gender (true = male, false = female)
  });
  const [loading, setLoading] = useState(true);

  const loadUserData = async () => {
    try {
      const storedUserData = await AsyncStorage.getItem("userInfo"); // Retrieve data
      if (storedUserData) {
        setUserData(JSON.parse(storedUserData)); // Parse and set user data
      }
    } catch (error) {
      console.log("Failed to load user data:", error);
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

  // Function to handle updates to text fields
  const handleChange = (field, value) => {
    setUserData((prev) => ({
      ...prev,
      [field]: value,
    }));
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
          <AntDesign name="arrowleft" size={28} color="#0000DD" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Thông tin cá nhân</Text>
      </View>
      <View style={styles.contentAvt}>
        <View>
            <Image source={require("../img/user.png")} style={styles.imgUser} />
            <Image source={require("../img/photo.png")} style={styles.imgPhoto} />
        </View>
       
        <Text style={styles.textUser}>
          {userData ? userData.name : "Tên người dùng"}
        </Text>
      </View>
      {/* Thong tin ca nhan */}
      <View style={styles.info}>
        <TextInput
          style={styles.inputRepair}
          placeholder="Name"
          value={userData.name}
          onChangeText={(text) => handleChange("name", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone"
          value={userData.phone}
          onChangeText={(text) => handleChange("phone", text)}
        />
        <TextInput
          style={styles.inputRepair}
          placeholder="Birthday"
          value={userData.birthday}
          onChangeText={(text) => handleChange("birthday", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={userData.email}
          onChangeText={(text) => handleChange("email", text)}
        />
        {/* Giới tính dùng radio để hiển thị 2 nút chọn nam và nữ */}
        <View style={styles.genderContainer}>
          <View style={styles.radioGroup}>
            <View style={styles.radioItem}>
              <RadioButton
                value="male"
                status={userData.gender === true ? "checked" : "unchecked"}
                onPress={() => handleChange("gender", true)}
              />
              <Text>Nam</Text>
            </View>
            <View style={styles.radioItem}>
              <RadioButton
                value="female"
                status={userData.gender === false ? "checked" : "unchecked"}
                onPress={() => handleChange("gender", false)}
              />
              <Text>Nữ</Text>
            </View>
          </View>
        </View>
        <View style={styles.contentfooter}>
          {/* Cap nhat thong tin */}
          <View>
            <TouchableOpacity style={styles.buttonUpdate}>
              <Text style={styles.buttonText}>Cập nhật</Text>
            </TouchableOpacity>
          </View>

          <View>
            <TouchableOpacity 
                onPress={() => navigation.navigate("EditPassWord")}
            >
              <Text
                style={styles.textEditpassword}
              >
                Chỉnh sửa mật khẩu
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
  contentAvt: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  imgUser: {
    width: 90,
    height: 90,
    borderRadius: 50,
    marginTop: 10,
  },
  textUser: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 15,
  },
  input: {
    top: 20,
    width: "90%",
    height: 40,
    padding: 10,
    marginVertical: 8,
    borderRadius: 5,
    backgroundColor: "#E8E8E8",
    textAlign: "left",
    marginLeft: 20,
  },
  inputRepair: {
    top: 20,
    width: "90%",
    height: 40,
    padding: 10,
    marginVertical: 8,
    borderRadius: 5,
    backgroundColor: "white",
    textAlign: "left",
    marginLeft: 20,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  genderContainer: {
    marginVertical: 30,
    marginLeft: 10,
  },
  radioGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  contentfooter: {
    flexDirection: "column",
    height: 60,
    width: "100%",
    borderColor: "#DDDDDD",
    justifyContent: "center",
    marginTop: 0.5,
    backgroundColor: "white",
    top: "60%",
  },
  buttonUpdate: {
    width: "90%",
    top: "3%",
    height: 40,
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
  textEditpassword:{
    color: "blue", 
    textAlign: "center", 
    marginTop: 10,
    top: 10,
    fontSize: 14,
  },
  imgPhoto: {
    width: 25,
    height: 30,
    borderRadius: 50,
    position: "absolute",
    top: 40,
    left: 75,
    resizeMode: "contain",
  },
});
