import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import { API_CreateOrder, API_GetRoomLayout } from "../api/Api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Theatre({ navigation }) {
  const route = useRoute();
  const [seats, setSeats] = useState([]);
  const selectedDate = new Date(route.params.selectedDate);
  const formattedStartTime = route.params.startTime.substring(0, 5);
  const formattedEndTime = route.params.endTime.substring(0, 5);
  const roomId = route.params.room;
  const [roomLayout, setRoomLayout] = useState(null);
  const showtimeId = route.params.showtimeId;
  const [seatPrices, setSeatPrices] = useState({ NORMAL: 0, COUPLE: 0 });

 // Calculate total based on seat type prices
 const calculateTotal = () => {
  let total = 0;

  // Loop through each selected seat
  seats.forEach((seatId) => {
    const seat = findSeatById(seatId); // Find the seat object by its ID
    if (seat) {
      total += seat.price; // Use the price property from the seat data
      if (seat.type === "COUPLE") {
        // If it's a couple seat, also add the price of the paired seat
        const pairSeat = seat.groupSeats.find(groupSeat =>
          roomLayout.rows[seat.rowIndex]?.seats.find(s => s.columnIndex === groupSeat.columnIndex)
        );
        if (pairSeat) {
          const pairedSeat = findSeatById(pairSeat.columnIndex); // Assuming columnIndex gives us the paired seat ID
          if (pairedSeat) {
            total += pairedSeat.price; // Add the paired seat's price
          }
        }
      }
    }
  });

  return total; // Return the calculated total
};

  const findSeatById = (seatId) => {
    for (const row of roomLayout.rows) {
      const seat = row.seats.find((s) => s.id === seatId);
      if (seat) {
        return seat;
      }
    }
    return null;
  };

  useEffect(() => {
    if (roomId) {
      const fetchRoomLayout = async () => {
        try {
          const response = await axios.get(
            API_GetRoomLayout + showtimeId + "/seat-layout"
          );
          console.log("Room Layout Data:", response.data);
          setRoomLayout(response.data.data);

          // Update seat prices
          const { NORMAL, COUPLE } = response.data.data.prices;
          setSeatPrices({ NORMAL, COUPLE });
        } catch (error) {
          console.log("Fetch room error: ", error);
        }
      };
      fetchRoomLayout();
    }
  }, [roomId]);

  const renderSeats = () => {
    if (!roomLayout || !Array.isArray(roomLayout.rows)) {
      return null;
    }

    return (
      <View style={styles.seatContainer}>
        {roomLayout.rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.rowContainer}>
            <View style={styles.rowLabelContainer}>
              <Text style={styles.rowLabel}>{row.name}</Text>
            </View>
            <View style={styles.seatRow}>
              {row.seats.map((seat, seatIndex) => (
                <View
                  key={seatIndex}
                  style={[
                    styles.seatWrapper,
                    seat.type === "COUPLE" && styles.coupleSeatWrapper,
                  ]}
                >
                  <Pressable
                    style={[
                      styles.seat,
                      seat.isBooked
                        ? styles.bookedSeat
                        : seats.includes(seat.id)
                        ? styles.selectedSeat
                        : styles.availableSeat,
                      seat.type === "COUPLE" && styles.coupleSeat,
                      seats.includes(seat.id) && styles.selectedSeat,
                    ]}
                    onPress={() => {
                      if (!seat.isBooked) {
                        // Toggle seat selection
                        setSeats((prevSeats) => {
                          if (prevSeats.includes(seat.id)) {
                            return prevSeats.filter((id) => id !== seat.id);
                          }
                          return [...prevSeats, seat.id];
                        });
                      }
                    }}
                  >
                    <Text style={styles.seatText}>{seat.name}</Text>
                  </Pressable>
                </View>
              ))}
            </View>
            <View style={styles.rowLabelContainer}>
              <Text style={styles.rowLabel}>{row.name}</Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

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

  console.log("Token:", accessToken);
  console.log("Showtime ID:", showtimeId);

  // Post selected seats to the API
  const postSelectedSeats = async (selectedSeats) => {
    try {
      const response = await axios.post(
        // "http://192.168.1.8:8080/api/v1/orders",
        API_CreateOrder,
        {
          showTimeId: showtimeId,
          seatIds: selectedSeats,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("API response:", response.data);
      // Hiển thị ra orderId từ response.data
      const orderId = response.data.data.id;
      console.log("Order ID:", orderId);
      // Lưu orderId vào AsyncStorage
      await AsyncStorage.setItem("orderId", orderId.toString());
    } catch (error) {
      
    }
  };

  const getSelectedSeatsInfo = () => {
    if (!roomLayout || !Array.isArray(roomLayout.rows)) {
      return [];
    }
    const selectedSeats = seats.map((seatId) => {
      const seat = findSeatById(seatId);
      if (seat) {
        const row = roomLayout.rows[seat.rowIndex];
        if (row) {
          return `${row.name}${seat.name}`;
        }
      }
      return null;
    }).filter(Boolean);

    // Post the selected seats whenever the seats are selected
    if (selectedSeats.length > 0) {
      postSelectedSeats(seats); // Pass the seat IDs to the API
    }

    return selectedSeats;
  };

  
  // Example log
  console.log("Selected seats: ", getSelectedSeatsInfo());
  

  return (
    <KeyboardAvoidingView
      contentContainerStyle={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="arrowleft" size={28} color="black" />
          </TouchableOpacity>
          <View style={styles.movieInfo}>
            <Text style={styles.movieTitle}>{route.params.movieTitle}</Text>
            <Text style={styles.cinemaName}>{route.params.cinemaName}</Text>
          </View>
        </View>
        <Text style={styles.roomName}>{route.params.roomName}</Text>
        <Text style={styles.startTime}>{formattedStartTime}</Text>

        {/* Scrollable area for seats */}
        <ScrollView contentContainerStyle={styles.seatLayoutContainer}>
          {renderSeats()}
        </ScrollView>

        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <FontAwesome name="square" size={24} color="#ffc40c" />
            <Text>Đang chọn</Text>
          </View>
          <View style={styles.legendItem}>
            <FontAwesome name="square" size={24} color="white" />
            <Text style={{ fontWeight: "bold" }}>Ghế trống</Text>
          </View>
          <View style={styles.legendItem}>
            <FontAwesome name="square" size={24} color="#989898" />
            <Text>Đã bán</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.totalContainer}>
          <View style={styles.totalContainerLeft}>
            <Text style={styles.endTime}>
              Thời gian kết thúc: {formattedEndTime}
            </Text>
            <Text style={styles.seatCount}>
              Ghế: {getSelectedSeatsInfo().join(", ")}
            </Text>
          </View>
          <View style={styles.totalAmount}>
            <Text>
              Tổng cộng:{" "}
              {calculateTotal().toLocaleString("vi-VN")} VND
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate("SelectCombo", {
              seats: getSelectedSeatsInfo(),
              total: calculateTotal(),
              name: route.params.movieTitle,
              mall: route.params.cinemaName,
              timeSelected: formattedStartTime,
              tableSeats: route.params.roomName,
              movie: route.params.movie,
              getSelectedSeats: getSelectedSeatsInfo().join(", "),
              movieImage: route.params.movieImage,
              startTime: formattedStartTime,
              age: route.params.age,
              selectedDate: route.params.selectedDate,
              //showtimeId
              showtimeId: route.params.showtimeId,
              // orderId 
              orderId: route.params.orderId,
            })
          }
          style={styles.button}
        >
          <Text style={styles.buttonText}>Tiếp tục</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 38,
  },
  safeArea: {
    flex: 1,
    justifyContent: "space-between",
  },
  button: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 20,
    backgroundColor: "#FFA500",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  cinemaName: {
    fontSize: 15,
    marginTop: 2,
    color: "gray",
    fontWeight: "500",
  },
  movieInfo: {
    marginLeft: 9,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  cinemaName: {
    fontSize: 15,
    marginTop: 2,
    color: "gray",
    fontWeight: "500",
  },
  roomName: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 10,
  },
  seatContainer: {
    marginVertical: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  startTime: {
    textAlign: "center",
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 10,
    color: "gray",
  },

  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
    width: "100%",
  },
  rowLabelContainer: {
    maxWidth: "25%",
    alignItems: "center",
    width: "10%",
  },
  seatRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    flexGrow: 1,
    maxWidth: "75%",
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  seat: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#999999",
    alignItems: "center",
    justifyContent: "center",
    margin: 4,
  },
  availableSeat: {
    backgroundColor: "white",
  },
  bookedSeat: {
    backgroundColor: "#989898",
  },
  selectedSeat: {
    backgroundColor: "#FFC40C",
  },
  seatText: {
    fontSize: 9,
    fontWeight: "bold",
  },
  coupleSeat: {
    width: 42,
    backgroundColor: "white",
  },
  coupleSeatWrapper: {
    flexDirection: "row",
  },
  totalContainer: {
    flexDirection: "row",
    paddingTop: 10,
    paddingLeft: 4,
    width: 410,
    paddingBottom: 20,

  },
  totalContainerLeft: {
    width: 200,
    height: 50,
  },
  endTime: {
    paddingLeft: 25,
  },

  legend: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 80,
    backgroundColor: "#D8D8D8",
    padding: 10,
    marginLeft: 4,
    width: 410,
  },
  legendItem: {
    alignItems: "center",
    marginHorizontal: 10,
  },
  totalAmount: {
    paddingLeft: 25,
    paddingTop: 10,
    backgroundColor: "#E0E0E0",
    padding: 6,
    borderTopLeftRadius: 6,
    borderBottomEndRadius: 6,
    right: -60,
    width: 150,
  },
  seatCount: {
    paddingLeft: 25,
    paddingTop: 10,
  },
});
