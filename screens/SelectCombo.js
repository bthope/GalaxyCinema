import React, { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  Image,
  FlatList,
  Alert,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import axios from "axios";
import { useRoute } from "@react-navigation/native";
import { API_CreateOrder, API_GetCombo, API_UpdateProduct } from "../api/Api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SelectCombo({ navigation }) {
  const route = useRoute();
  const [combos, setCombos] = useState([]); // State to store fetched combos
  const [selectedCombos, setSelectedCombos] = useState({});

  useEffect(() => {
    // Fetch combo data from the API
    const fetchCombos = async () => {
      try {
        const response = await axios.get(API_GetCombo);
        setCombos(response.data.data); // Assuming response.data.data contains the combo array
      } catch (error) {
        console.error("Error fetching combo data: ", error);
      }
    };

    fetchCombos();
  }, []);
  // Gọi  await AsyncStorage.setItem("orderId", orderId.toString()); để lấy orderId
  const [orderId, setOrderId] = useState(null);
  useEffect(() => {
    const fetchOrderId = async () => {
      try {
        const orderId = await AsyncStorage.getItem("orderId");
        setOrderId(orderId);
        console.log("Fetched orderId:", orderId);
      } catch (error) {
        console.error("Error retrieving orderId:", error);
      }
    };

    fetchOrderId();
  }, []);
  // Log orderId
  useEffect(() => {
    console.log("orderId:", orderId);
  }, [orderId]);

  const [accessToken, setAccessToken] = useState(null);
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

  // // Hủy đơn hàng sau khi hết thời gian giữ ghế 6:00
  // const [timeLeft, setTimeLeft] = useState(10);
  //  // Hàm gọi API xóa order
  //  const deleteOrder = async () => {
  //   if (!accessToken || !orderId) {
  //     Alert.alert("Error", "Access token or order ID is missing.");
  //     return;
  //   }

  //   const url = `http://192.168.1.8:8080/api/v1/orders/${orderId}`;

  //   try {
  //     const response = await fetch(url, {
  //       method: "DELETE",
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //         "Content-Type": "application/json",
  //       },
  //     });

  //     if (response.ok) {
  //       console.log("Order deleted successfully.");

  //       // Thông báo thành công và điều hướng về MainTabs
  //       Alert.alert("Success", "Order deleted successfully.", [
  //         { text: "OK", onPress: () => navigation.navigate("MainTabs") },
  //       ]);
  //        // reset lại tất cả các state

  //     } else {
  //       const errorData = await response.json();
  //       console.error("Failed to delete order:", errorData);
  //       Alert.alert("Error", "Failed to delete order.");
  //     }
  //   } catch (error) {
  //     console.error("Error deleting order:", error);
  //     Alert.alert("Error", "An error occurred while deleting the order.");
  //   }
  // };
  // // Đếm ngược thời gian
  // useEffect(() => {
  //   if (timeLeft === 0) {
  //     // Khi hết thời gian, gọi API delete
  //     deleteOrder();
  //     return;
  //   }

  //   const timer = setTimeout(() => {
  //     setTimeLeft(timeLeft - 1);
  //   }, 1000); // Giảm 1 giây sau mỗi 1000ms (1 giây)

  //   return () => clearTimeout(timer); // Hủy bỏ timer khi component bị unmount
  // }, [timeLeft]);

  // // Hàm format thời gian
  // const formatTime = (seconds) => {
  //   const minutes = Math.floor(seconds / 60);
  //   const remainingSeconds = seconds % 60;
  //   return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  // };

  // Hủy đơn hàng sau khi hết thời gian giữ ghế 6:00
  const [timeLeft, setTimeLeft] = useState(360);

  // Lấy giá trị thời gian đã lưu từ AsyncStorage khi vào màn hình
  const loadTimeLeft = async () => {
    try {
      const savedTime = await AsyncStorage.getItem("timeLeft");
      if (savedTime !== null) {
        setTimeLeft(parseInt(savedTime, 10));
      }
    } catch (error) {
      console.error("Error loading time left:", error);
    }
  };

  // Lưu giá trị thời gian còn lại vào AsyncStorage trước khi unmount
  const saveTimeLeft = async (time) => {
    try {
      await AsyncStorage.setItem("timeLeft", time.toString());
    } catch (error) {
      console.error("Error saving time left:", error);
    }
  };

  useEffect(() => {
    // Load the saved time when the component mounts
    loadTimeLeft();

    return () => {
      // Save the time when the component unmounts
      saveTimeLeft(timeLeft);
    };
  }, []);

  // Đếm ngược thời gian
  useEffect(() => {
    if (timeLeft === 0) {
      // Khi hết thời gian, điều hướng về MainTabs
      navigation.navigate("MainTabs");
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000); // Giảm 1 giây sau mỗi 1000ms (1 giây)

    return () => clearTimeout(timer); // Hủy bỏ timer khi component bị unmount
  }, [timeLeft]);

  // Hàm format thời gian
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  // Update combo quantity via API
  const updateProductQuantity = async (id, quantity) => {
    try {
      const response = await axios.put(
        // `http://192.168.1.8:8080/api/v1/orders/${orderId}/products`,
        API_UpdateProduct + orderId + "/products",
        {
          products: [{ id: id, quantity: quantity }],
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Product quantity updated:", response.data);
      // Lưu orderId vào AsyncStorage
      await AsyncStorage.setItem("orderId", response.data.data.id.toString());
    } catch (error) {
      console.error("Error updating product quantity:", error);
    }
  };

  // Increase quantity
  const increaseQuantity = (id) => {
    const newQuantity = (selectedCombos[id] || 0) + 1;
    setSelectedCombos((prevSelectedCombos) => ({
      ...prevSelectedCombos,
      [id]: newQuantity,
    }));

    // Call the API to update the quantity
    updateProductQuantity(id, newQuantity);
  };

  // Decrease quantity
  const decreaseQuantity = (id) => {
    const newQuantity = (selectedCombos[id] || 0) - 1;
    if (newQuantity <= 0) {
      const { [id]: _, ...rest } = selectedCombos;
      setSelectedCombos(rest);
    } else {
      setSelectedCombos((prevSelectedCombos) => ({
        ...prevSelectedCombos,
        [id]: newQuantity,
      }));
    }

    // Call the API to update the quantity
    if (newQuantity > 0) {
      updateProductQuantity(id, newQuantity);
    } else {
      updateProductQuantity(id, 0); // Optionally handle zero quantities if needed
    }
  };

  const calculateTotal = () => {
    return Object.keys(selectedCombos).reduce((total, id) => {
      const combo = combos.find((item) => item.id.toString() === id);
      return total + combo.price * selectedCombos[id];
    }, 0);
  };

  const totalWithCombos = route.params.total + calculateTotal();

  // fetch API để gửi thông tin thanh toán
  const handleCombo = async () => {
    // Show success alert and navigate back
    navigation.navigate("PayMent", {
      seats: route.params.seats,
      total: totalWithCombos,
      name: route.params.name,
      mall: route.params.mall,
      timeSelected: route.params.timeSelected,
      tableSeats: route.params.tableSeats,
      movie: route.params.movie,
      getSelectedSeats: route.params.getSelectedSeats,
      movieImage: route.params.movieImage,
      startTime: route.params.startTime,
      // Thêm thông tin combo
      selectedCombos: selectedCombos,
      //age
      age: route.params.age,
      cinemaName: route.params.cinemaName,
      // selectedDate
      selectedDate: route.params.selectedDate,
      // selectedDate: selectedDate,
      selectedDate: route.params.selectedDate,
      //showtimeId
      showtimeId: route.params.showtimeId,
      // timeLeft
      timeLeft: timeLeft,
    });
  };

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
        <Text style={styles.headerText}>Chọn combo</Text>
      </View>
      <View style={styles.heaerTime}>
        <Text style={styles.headerTextTime}>
          Thời gian giữ ghế: {formatTime(timeLeft)}
        </Text>
      </View>
      <View>
        <FlatList
          data={combos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            // Safeguard: Check if item exists and has an image property
            if (!item || !item.image) {
              return (
                <View style={styles.commentItem}>
                  <Text style={styles.commentTitle}>Image not available</Text>
                </View>
              );
            }

            return (
              <View style={styles.commentItem}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.commentImage}
                />
                <View style={styles.commentTextContainer}>
                  <Text style={styles.commentTitle}>{item.name}</Text>
                  <Text style={styles.readMore}>{item.description}</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.priceFastlist}>
                      Giá: {item.price.toLocaleString("vi-VN")}đ
                    </Text>

                    <View style={styles.quantityContainer}>
                      <TouchableOpacity
                        onPress={() => decreaseQuantity(item.id)}
                      >
                        <Text style={styles.quantityButton}>–</Text>
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>
                        {selectedCombos[item.id] || 0}
                      </Text>
                      <TouchableOpacity
                        onPress={() => increaseQuantity(item.id)}
                      >
                        <Text style={styles.quantityButton}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            );
          }}
        />

        <View style={styles.footer}>
          <View>
            <Text style={styles.seatText}>{`${
              route.params.seats.length
            }x ghế ${route.params.seats.join(", ")}`}</Text>
            <Text style={styles.toltalText}>
              Tổng cộng: {totalWithCombos.toLocaleString("vi-VN")}đ
            </Text>
          </View>
          <TouchableOpacity onPress={handleCombo} style={styles.button}>
            <Text style={styles.buttonText}>Tiếp tục</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  contain: {
    flex: 1.2,
    alignItems: "center",
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
    fontSize: 20,
    marginLeft: 15,
  },
  commentItem: {
    marginBottom: 20,
    borderBottomWidth: 1,
    backgroundColor: "white",
    borderBottomColor: "#DDDDDD",
    paddingBottom: 10,
    alignItems: "flex-start",
    marginHorizontal: 23,
    top: 20,
  },
  commentImage: {
    width: "95%",
    height: 220,
    left: 10,
    marginBottom: 10,
    resizeMode: "center",
    borderRadius: 10,
  },
  commentTextContainer: {
    alignItems: "flex-start",
    paddingHorizontal: 30,
  },
  commentTitle: {
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "left",
    marginBottom: 5,
  },
  readMore: {
    color: "orange",
    textAlign: "left",
    fontWeight: "bold",
    fontSize: 12,
    marginBottom: 5,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
    left: 90,
    backgroundColor: "white",
  },
  quantityButton: {
    fontSize: 20,
    paddingHorizontal: 10,
    color: "gray",
  },
  quantityText: {
    fontSize: 18,
    marginHorizontal: 10,
  },
  priceFastlist: {
    color: "red",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "left",
    marginTop: 10,
  },
  footer: {
    marginTop: 7,
    padding: 10,
    flexDirection: "row",
    height: 160,
    justifyContent: "space-between",
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "#FFA500",
    width: 130,
    height: 40,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  seatText: {
    fontSize: 16,
  },
  toltalText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
    color: "#FFA500",
    width: 200,
  },
  heaerTime: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  headerTextTime: {
    fontWeight: "bold",
    fontSize: 16,
    color: "red",
  },
});
