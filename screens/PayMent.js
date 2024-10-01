import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  Image,
  Alert,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_CompleteOrder, API_CreateOrder } from "../api/Api";

// Thành phần RadioButton tùy chỉnh
const RadioButton = ({ selected, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      {selected ? (
        <AntDesign
          name="checkcircle"
          size={24}
          color="#FFA500"
          style={{ top: 10 }}
        />
      ) : (
        <AntDesign
          name="checkcircleo"
          size={24}
          color="gray"
          style={{ top: 10 }}
        />
      )}
    </TouchableOpacity>
  );
};

export default function PayMent({ navigation }) {
  const route = useRoute();
  const selectedDate = new Date(route.params.selectedDate);
  const day = String(selectedDate.getDate()).padStart(2, "0"); // Get day and pad with leading zero
  const month = String(selectedDate.getMonth() + 1).padStart(2, "0"); // Get month and pad with leading zero
  const year = selectedDate.getFullYear(); // Get full year

  const formattedDate = `${day}/${month}/${year}`;

  // Trạng thái cho phương thức thanh toán được chọn
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    "momo",
    "vnPay",
    "shopeePay",
    "payoo"
  );
  // Lấy showtimeId từ route.params
  const showtimeId = route.params.showtimeId;
  console.log("showtimeId", showtimeId);
  const [accessToken, setAccessToken] = useState(null);
  const [seatIds, setSeatIds] = useState([0]); 
  // Lấy accessToken từ AsyncStorage
  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        setAccessToken(token || "No token found"); // Provide a fallback message
        console.log("Fetched accessToken:", token);
      } catch (error) {
        console.error("Error retrieving accessToken:", error);
      }
    };

    fetchAccessToken();
  }, []);

  // Log accessToken
  useEffect(() => {
    console.log("accessToken:", accessToken);
  }, [accessToken]);

  // Hiển thị orderId từ route.params
  const orderId = route.params.orderId;
  console.log("orderId Thanh Toan", orderId);


  // fetch API để gửi thông tin thanh toán
  const handlePayment = async () => {
    // Ensure the access token and orderId are available
    if (!accessToken) {
      Alert.alert("Error", "Access token is missing.");
      return;
    }
    
    if (!orderId) {
      Alert.alert("Error", "Order ID is missing.");
      return;
    }
  
    // API URL with the orderId
    // const API_CompleteOrder = `http://192.168.1.7:8080/api/v1/orders/${orderId}/complete`;
  
    // Prepare the payment data
    const paymentData = {
      showTimeId: showtimeId, // Replace with actual showtimeId
      seatIds: [0], // Replace with actual selected seat IDs if necessary
    };
  
    try {
      // Make the PUT request to complete the order
      const response = await fetch(API_CompleteOrder + orderId + "/complete", {
        method: "PUT", // Use PUT method as requested
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`, // Use the accessToken in headers
        },
        body: JSON.stringify(paymentData), // Convert paymentData to JSON
      });
  
      // Check if the response is okay
      if (!response.ok) {
        // Handle non-200 responses
        const errorMessage = await response.text(); // Get the error message from the response
        console.error("Payment error response:", errorMessage); // Log the error response
        throw new Error("Payment failed: " + errorMessage); // Throw a detailed error
      }
  
      // Parse the JSON response
      const result = await response.json();
      console.log("Payment result:", result); // Log the payment result
  
      // Show success alert and navigate back
      Alert.alert("Thành công", "Thanh toán hoàn tất!", [
        {
          text: "OK",
          onPress: () => navigation.navigate("MainTabs"), // Navigate back to MainTabs
        },
      ]);
    } catch (error) {
      console.error("Payment error:", error); // Log the error
      Alert.alert("Error", "Payment could not be processed. Please try again."); // Show error alert
    }
  };
  
  // Lưu giá trị của Tổng cộng và ghế đã chọn và AsyncStorage  {route.params.total.toLocaleString("vi-VN")}đ và {route.params.getSelectedSeats} vào AsyncStorage
  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem("total", route.params.total.toLocaleString("vi-VN") + "đ");
        await AsyncStorage.setItem("seat", route.params.getSelectedSeats);
      } catch (error) {
        console.error("Error saving data:", error);
      }
    };

    saveData();
    // Khi đặt vé khác thì sẽ xóa AsyncStorage
  }, []);



  return (
    <KeyboardAvoidingView
      contentContainerStyle={styles.contain}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.contain}
    >
      <StatusBar />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={28} color="#0000DD" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Thanh toán</Text>
      </View>
      <View style={styles.contentTitle}>
        <View>
          {/* movieImage */}
          <Image
            source={{ uri: route.params.movieImage }}
            style={styles.movieImage}
          />
        </View>
        <View>
          <Text style={styles.infoText}>{route.params.name}</Text>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.infoText}>2D phụ đề</Text>
            {/* age */}
            <TouchableOpacity style={styles.buttonTextAge}>
              <Text style={styles.movieAge}>T{route.params.age}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.infoText}>{route.params.mall} -</Text>
            <Text style={styles.infoText}>{route.params.tableSeats}</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.infoText}>{route.params.timeSelected} -</Text>
            {/* initialSelectedDate: route.params.initialSelectedDate, */}
            <Text style={styles.infoText}>{formattedDate}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.infoTextInfomation}>Thông tin giao dịch</Text>
      <View style={styles.contentInformation}>
        <View style={styles.contentSeat}>
          <Text style={styles.infoText}>{route.params.getSelectedSeats}</Text>
          <Text style={styles.infoText}>
            {route.params.total.toLocaleString("vi-VN")}đ
          </Text>
        </View>
        <View>
          <Text>
            ------------------------------------------------------------------------------------------
          </Text>
        </View>
        <View style={styles.contentSeat}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Khuyến Mãi</Text>
            <AntDesign name="right" size={16} color="#FFA500" />
          </TouchableOpacity>

          <Text style={styles.infoText}>Tổng cộng:</Text>
          <Text style={styles.infoText1}>
            {route.params.total.toLocaleString("vi-VN")}đ
          </Text>
        </View>
      </View>
      <Text style={styles.infoTextInfomation}>Phương thức thanh toán</Text>
      <View style={styles.contentPayMent}>
        <View style={styles.contentTabPayMent}>
          <View style={styles.contentTab2PayMent}>
            <Image source={require("../img/momo.png")} style={styles.logo} />
            <Text style={styles.textPayMent}>Ví MoMo</Text>
          </View>
          <View>
            <RadioButton
              selected={selectedPaymentMethod === "momo"}
              onPress={() => setSelectedPaymentMethod("momo")}
            />
          </View>
        </View>

        <View style={styles.contentTabPayMent}>
          <View style={styles.contentTab2PayMent}>
            <Image source={require("../img/VNPay.jpg")} style={styles.logo} />
            <Text style={styles.textPayMent}>Ví MoMo</Text>
          </View>
          <View>
            <RadioButton
              selected={selectedPaymentMethod === "vnPay"}
              onPress={() => setSelectedPaymentMethod("vnPay")}
            />
          </View>
        </View>

        <View style={styles.contentTabPayMent}>
          <View style={styles.contentTab2PayMent}>
            <Image
              source={require("../img/shopeePay.png")}
              style={styles.logo}
            />
            <Text style={styles.textPayMent}>
              Ví shopeePay - Mã: SPPCINE08 Giảm 10K cho đơn hàng 100K
            </Text>
          </View>
          <View>
            <RadioButton
              selected={selectedPaymentMethod === "shopeePay"}
              onPress={() => setSelectedPaymentMethod("shopeePay")}
            />
          </View>
        </View>

        <View style={styles.contentTabPayMent}>
          <View style={styles.contentTab2PayMent}>
            <Image source={require("../img/Payoo.png")} style={styles.logo} />
            <Text style={styles.textPayMent}>
              HSBC/Payoo - ATM/VISA/MASTER/JCB/QRCORE
            </Text>
          </View>
          <View>
            <RadioButton
              selected={selectedPaymentMethod === "payoo"}
              onPress={() => setSelectedPaymentMethod("payoo")}
            />
          </View>
        </View>
        <View style={styles.contentFooter}>
          <View style={styles.contentFooterLeft}>
            <Text style={styles.infoText}>Tổng cộng:</Text>
            <Text style={styles.infoText1}>
              {route.params.total.toLocaleString("vi-VN")}đ
            </Text>
          </View>
          <TouchableOpacity style={styles.button1}
            onPress={handlePayment}
          >
            <Text style={styles.buttonText1}>Thanh toán</Text>
          </TouchableOpacity>
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
    backgroundColor: "#E8E8E8",
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
  headerText: {
    fontWeight: "bold",
    fontSize: 18,
    marginLeft: 15,
  },
  contentTitle: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 10,
    top: 10,
    flexDirection: "row",
    height: 130,
    justifyContent: "space-around",
    alignItems: "center",
  },
  movieImage: {
    width: 80,
    height: 105,
    borderRadius: 7,
    left: 10,
    resizeMode: "cover",
  },
  infoText: {
    fontSize: 14,
    padding: 5,
    fontWeight: "bold",
  },
  infoTextInfomation: {
    fontSize: 14,
    fontWeight: "bold",
    padding: 10,
    top: 5,
  },
  contentInformation: {
    backgroundColor: "white",
    padding: 10,
    top: 5,
  },
  contentSeat: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    height: 35,
    justifyContent: "space-around",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "#fff",
    width: 130,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#FFA500",
  },
  buttonText: {
    color: "#FFA500",
    fontSize: 14,
    fontWeight: "bold",
  },
  infoText1: {
    fontSize: 16,
    padding: 5,
    fontWeight: "bold",
    color: "#FFA500",
  },
  contentPayMent: {
    backgroundColor: "white",
    padding: 10,
    top: 5,
    height: 330,
  },
  contentTabPayMent: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  contentTab2PayMent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  textPayMent: {
    fontSize: 16,
    fontWeight: "bold",
    padding: 10,
    flexWrap: "wrap",
    width: 310,
  },
  contentFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    top: 80,
    backgroundColor: "white",
    height: 80,
    left: -10,
    width: 420,
    alignItems: "center",
  },
  contentFooterLeft: {
    flexDirection: "row",
  },
  button1: {
    height: 45,
    justifyContent: "space-around",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "#fff",
    width: 130,
    flexDirection: "row",
    backgroundColor: "#FFA500",
  },
  buttonText1: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  buttonTextAge: {
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF8C00",
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    width: 45,
  },
  movieAge: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});
