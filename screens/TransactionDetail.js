import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import QRCode from "react-native-qrcode-svg"; // Thêm QRCode component nếu chưa có
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TransactionDetail({ route, navigation }) {
  // Retrieve the parameters passed from the Transaction screen
  const {
    imagePortrait,
    title,
    age,
    cinemaName,
    roomName,
    startTime,
    releaseDate,
    orderDate,
    total,
    code,
    totalPrice,
    seatName,
    rating,
  } = route.params;

  // Format the date and time if necessary
  const formattedOrderDate = new Date(orderDate).toLocaleString();
  const formattedStartTime = startTime.substring(0, 5); // Only display hours and minutes

  // useEffect(() => {
  //   const saveData = async () => {
  //     try {
  //       await AsyncStorage.setItem("total", route.params.total.toLocaleString("vi-VN") + "đ");
  //       await AsyncStorage.setItem("seat", route.params.getSelectedSeats);
  //     } catch (error) {
  //       console.error("Error saving data:", error);
  //     }
  //   };

  //   saveData();
  //   // Khi đặt vé khác thì sẽ xóa AsyncStorage
  //   return () => {
  //     AsyncStorage.removeItem("total");
  //     AsyncStorage.removeItem("seat");
  //   };
  // }, []);
  // Lấy dữ liệu từ AsyncStorage  await AsyncStorage.setItem("total", route.params.total.toLocaleString("vi-VN") + "đ") và await AsyncStorage.setItem("seat", route.params.getSelectedSeats)
  const [totalPriceAs, setTotalPriceAs] = useState("");
  const [seatNameAs, setSeatNameAs] = useState("");

  useEffect(() => {
    const getData = async () => {
      try {
        const totalPrice = await AsyncStorage.getItem("total");
        const seatName = await AsyncStorage.getItem("seat");
        if (totalPrice !== null && seatName !== null) {
          setTotalPriceAs(totalPrice);
          setSeatNameAs(seatName); // Parse seatName if it's stored as an array
        }
      } catch (error) {
        console.error("Error getting data:", error);
      }
    };

    getData();
  }, []);
  console.log(totalPriceAs);
  console.log(seatNameAs);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={28} color="#0000DD" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Movie Image */}
        <View style={styles.contentMovie}>
          <Image source={{ uri: imagePortrait }} style={styles.movieImage} />
          <View>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.movieDetails}>
              <Text style={styles.details}>Phim 2D {" - "}</Text>
              <TouchableOpacity style={styles.buttonTextAge}>
                <Text style={styles.movieAge}>T{age}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Cinema Info */}
        <View style={styles.contentCinema}>
          <Text style={styles.cinemaText}>
            {cinemaName} {" - "}
          </Text>
          <Text style={styles.cinemaroomName}>{roomName}</Text>
        </View>
        <View style={styles.contentDate}>
          <Text style={styles.details}>Suất: {formattedStartTime}</Text>
          <Text style={styles.releaDate}>
            {" - "}
            {releaseDate.substring(0, 10)}
          </Text>
        </View>

        {/* QR Code */}
        <View style={styles.qrContainer}>
          <QRCode value="https://example.com/ticket/764341" size={100} />
        </View>

        <View style={styles.contentSeact}>
          <Text style={styles.detailsSeat}>
            Ghế: {seatName.length > 0 ? seatName.join(", ") : seatNameAs}
          </Text>
        </View>

        {/* Seat and Ticket Info */}
        <View style={styles.infoContainerTicket}>
          <Text style={styles.details}>Mã vé: {code}</Text>
          <Text style={styles.detailsRating}>Stars: {rating}</Text>
          {/* Hiển thị thêm totalPriceAs */}
          <Text style={styles.details}>
            Tổng Cộng: {totalPrice.length > 0 ? totalPrice : totalPriceAs} 
          </Text>
        </View>
      </View>
      {/* Close Button at Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Đóng</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#E8E8E8",
    paddingTop: 35,
  },
  header: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
  },
  content: {
    marginTop: 20,
    alignItems: "center",
    width: "90%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
    height: 600,
  },
  movieImage: {
    width: 120,
    height: 180,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
  },
  movieDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  },
  buttonTextAge: {
    backgroundColor: "#FF4500",
    borderRadius: 4,
    paddingVertical: 3,
    paddingHorizontal: 8,
    right: 25,
  },
  movieAge: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  infoContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  details: {
    fontSize: 16,
    marginVertical: 5,
    textAlign: "center",
    width: 100,
  },
  qrContainer: {
    marginVertical: 15,
    top: 20,
  },
  button: {
    backgroundColor: "#FFA500",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginTop: 20,
    width: "100%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  contentMovie: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 300,
    top: 10,
  },
  contentCinema: {
    width: 300,
    top: 20,
    flexDirection: "row",
  },
  cinemaText: {
    fontSize: 16,
    fontWeight: "bold",
    width: 200,
  },
  cinemaroomName: {
    fontSize: 16,
    width: 100,
    right: 10,
  },
  contentDate: {
    flexDirection: "row",
    width: 300,
    top: 20,
  },
  releaDate: {
    fontSize: 16,
    width: 120,
    right: 0,
    top: 4,
  },
  infoContainerTicket: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 300,
    top: 70,
  },
  contentSeact: {
    width: 300,
    top: 20,
    borderBlockColor: "black",
  },
  detailsSeat: {
    fontSize: 16,
    marginVertical: 5,
    textAlign: "flex-start",
    justifyContent: "flex-start",
    width: 100,
    top: 20,
  },
  footer: {
    backgroundColor: "#E8E8E8",
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    width: "90%",
  },
  detailsRating: {
    fontSize: 16,
    marginVertical: 5,
    textAlign: "center",
    width: 50,
  },
});
