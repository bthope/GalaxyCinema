import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Transaction({ navigation }) {
  // State variables
  const [accessToken, setAccessToken] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch access token from AsyncStorage
  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        setAccessToken(token);
        console.log("Fetched accessToken:", token);
      } catch (error) {
        console.error("Error retrieving accessToken:", error);
      }
    };

    fetchAccessToken();
  }, []);

  // Fetch orders when accessToken is available
  useEffect(() => {
    const fetchOrders = async () => {
      if (accessToken) {
        try {
          const response = await fetch(
            "http://192.168.1.7:8080/api/v1/orders",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch orders");
          }

          const data = await response.json();
          setOrders(data.data); // Assuming 'data' contains the orders
          console.log("Fetched orders:", data.data);
        } catch (error) {
          console.error("Error fetching orders:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrders();
  }, [accessToken]);

  // Log accessToken
  useEffect(() => {
    console.log("accessTokenTransaction:", accessToken);
  }, [accessToken]);

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#0000DD" style={{ flex: 1 }} />
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("MainTabs")}>
          <AntDesign name="arrowleft" size={28} color="#0000DD" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Lịch Sử Giao Dịch</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {orders.length > 0 ? (
          orders.map((order) => (
            <TouchableOpacity key={order.id} style={styles.orderContainer}
              // truyền các thông tin
              onPress={() => navigation.navigate("TransactionDetail", { 
                imagePortrait: order.showTime.movie.imagePortrait,
                title: order.showTime.movie.title,
                age: order.showTime.movie.age,
                cinemaName: order.showTime.cinemaName,
                roomName: order.showTime.room.name,
                startTime: order.showTime.startTime,
                releaseDate: order.showTime.movie.releaseDate,
                orderDate: order.orderDate,
                total: order.total,
                code: order.code,
               //  "totalPrice": 100000.0, kiểu số thực
                totalPrice: order.totalPrice,
                rating: order.showTime.movie.rating,
             
                //  "orderDetails": [
                //   {
                //     "type": "TICKET",
                //     "price": 100000.0,
                //     "quantity": 0,
                //     "product": null,
                //     "seat": {
                //         "name": "D8",
                //         "type": "NORMAL"
                //     }
                // },

                // Lấy ra name của seat ví dụ "D8"
                seatName: order.orderDetails
                .filter((orderDetail) => orderDetail.seat !== null)
                .map((orderDetail) => orderDetail.seat.name),
                           
               })}
            >
              <Text style={styles.orderDateText}>
                {new Date(order.orderDate).toLocaleString()}
              </Text>

              <View style={styles.orderInfomation}>
                <View style={styles.imageHD}>
                  <Image
                    source={{ uri: order.showTime.movie.imagePortrait }}
                    style={styles.movieImage}
                  />
                </View>
                <View style={styles.contentInfomationLeft}>
                  <Text style={styles.title}>{order.showTime.movie.title}</Text>
                  <View style={styles.rowTitle}>
                    <Text style={styles.details}>Phim 2D</Text>
                    <TouchableOpacity style={styles.buttonTextAge}>
                      <Text style={styles.movieAge}>
                        T{order.showTime.movie.age}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.rowTitle}>
                    <Text style={styles.cinemaText}>
                      {order.showTime.cinemaName} - {" "}
                    </Text>
                    <Text style={styles.detailsRap}>
                      {order.showTime.room.name}
                    </Text>
                  </View>
                  <View style={styles.rowTitle}>
                    <Text style={styles.details}>
                      {order.showTime.startTime.substring(0, 5)} - {" "}
                    </Text>
                    <Text style={styles.detailsDate}>
                      {order.showTime.movie.releaseDate}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noOrdersText}>No transactions found.</Text>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
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
    borderBottomWidth: 0.5,
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 20,
    marginLeft: 25,
    textAlign: "center",
  },
  scrollView: {
    alignItems: "center",
    paddingBottom: 20,
  },
  orderContainer: {
    backgroundColor: "#E8E8E8",
    marginBottom: 10,
    borderRadius: 5,
    padding: 10,
    top: 10,
    width: "100%",
  },
  orderInfomation: {
    flexDirection: "row", // Set layout direction to row
    backgroundColor: "white",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 20,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    width: "100%",
    padding: 10, // Add some padding
    borderRadius: 10, // Add border radius to match the rest of the style
  },
  movieImage: {
    width: 100, // Set width to a smaller size
    height: 150,
    borderRadius: 10,
    marginRight: 15, // Add margin to separate image and details
  },
  detailsContainer: {
    flex: 1, // Take up the remaining space next to the image
    justifyContent: "space-between", // Distribute space between elements
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  details: {
    fontSize: 14,
    marginVertical: 2,
    width: 100,
  },
  noOrdersText: {
    fontSize: 16,
    marginTop: 20,
  },
  orderDateText: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "gray",
  },
  rowTitle: {
    flexDirection: "row",
    width: 220,
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
    right: 30,
  },
  movieAge: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  cinemaText: {
    fontSize: 14,
    fontWeight: "bold",
    width: 160,
  },
  contentInfomationLeft: {
    width: 220,
    top: 10,
  },
  detailsDate:{
    right: 45,
    width: 100,
    top: 2,

  },
  detailsRap:{
    width: 100,
    top: 2,
    right: 4,
  },
  
});
