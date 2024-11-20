import { useRoute } from "@react-navigation/native";
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
import Barcode from "@kichiyaki/react-native-barcode-generator"; // Replace QRCode
import AsyncStorage from "@react-native-async-storage/async-storage";

const DetailedInvoice = ({ navigation }) => {
  const route = useRoute();

  const {
    movieImage,
    name,
    startTime,
    selectedCombos,
    ageRating,
    mall,
    selectedDate,
    seats,
    total,
    timeSelected,
    tableSeats,
    rating,
    finalAmount,
  } = route.params;
  const [ticketCode, setTicketCode] = useState("");

  useEffect(() => {
    const generateTicketCode = async () => {
      try {
        const lastTicket = await AsyncStorage.getItem("lastTicketNumber");
        const lastNumber = lastTicket ? parseInt(lastTicket, 10) : 0;

        const newTicketNumber = lastNumber + 1;
        const formattedTicketCode = `HD${String(newTicketNumber).padStart(
          8,
          "0"
        )}`;

        await AsyncStorage.setItem(
          "lastTicketNumber",
          newTicketNumber.toString()
        );

        setTicketCode(formattedTicketCode);
      } catch (error) {
        console.error("Error generating ticket code:", error);
      }
    };

    generateTicketCode();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar />
      <View style={styles.header}>
        <Text style={styles.headerText}>Thông Tin Chi Tiết</Text>
      </View>
      <View style={styles.content}>
        {/* Movie Image */}
        <View style={styles.contentMovie1}>
          <Image source={{ uri: movieImage }} style={styles.movieImage} />
          <View>
            <Text style={styles.title}>{name}</Text>
            <View style={styles.movieDetails}>
              <Text style={styles.details}>Phim 2D {" - "}</Text>
              <TouchableOpacity style={styles.buttonTextAge}>
                <Text style={styles.movieAge}>{ageRating}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* Cinema Info */}
        <View style={styles.contentCinema}>
          <Text style={styles.cinemaText}>
            {mall} {" - "}
          </Text>
          <Text style={styles.cinemaroomName}>{tableSeats}</Text>
        </View>
        <View style={styles.contentDate}>
          <Text style={styles.details}>Suất: {timeSelected}</Text>
          <Text style={styles.releaDate}>
            {" - "}
            {selectedDate.substring(0, 10)}
          </Text>
        </View>

        {/* Barcode */}
        <View style={styles.barcodeContainer}>
          <Barcode
            value={ticketCode}
            format="CODE128"
            width={2.3}
            height={50}
            textStyle={styles.barcodeText}
          />
        </View>

        <View style={styles.contentSeact}>
          <Text style={styles.detailsSeat}>Ghế: {seats.join(", ")}</Text>
        </View>
        {/* Seat and Ticket Info */}
        <View style={styles.infoContainerTicket}>
          <Text style={styles.details}>Mã vé: {ticketCode}</Text>
          <Text style={styles.detailsRating}>Stars: {rating}</Text>
          <Text style={styles.Todetails}>
            Tổng cộng: {finalAmount.toLocaleString("vi-VN")}đ
          </Text>
        </View>
      </View>

      {/* Close Button at Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("MainTabs")}
        >
          <Text style={styles.buttonText}>Đóng</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

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
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 20,
    marginLeft: 25,
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
    backgroundColor: "#FF8C00",
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
  contentMovie1: {
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
  Todetails: {
    fontSize: 16,
    marginVertical: 5,
    textAlign: "center",
    width: 100,
  },
  barcodeContainer: {
    alignItems: "center",
    marginVertical: 10,
    top: 25,
  },
  barcodeText: {
    fontSize: 12,
    marginTop: 5,
    width: 150,
  },
});
export default DetailedInvoice;
