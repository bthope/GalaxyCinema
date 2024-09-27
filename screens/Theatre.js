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
  ScrollView, // Import ScrollView
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";

export default function Theatre({ navigation }) {
  const route = useRoute();
  const [seats, setSeats] = useState([]);
  const pricePerSeat = 40000; // 40 nghìn VND mỗi ghế
  const selectedDate = new Date(route.params.selectedDate);
  const formattedStartTime = route.params.startTime.substring(0, 5);
  const formattedEndTime = route.params.endTime.substring(0, 5);
  const roomId = route.params.room;
  const [roomLayout, setRoomLayout] = useState(null);

  const calculateTotal = () => {
    return seats.length * pricePerSeat;
  };

  useEffect(() => {
    if (roomId) {
      const fetchRoomLayout = async () => {
        try {
          const response = await axios.get(
            `http://192.168.1.7:8080/api/v1/rooms/${roomId}/layout`
          );
          console.log("Room Layout Data:", response.data);
          setRoomLayout(response.data.data);
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
          <View key={rowIndex} style={styles.layfromrow}>
            <View style={styles.rowLabelContainer}>
              <Text style={styles.rowLabel}>{row.name}</Text>
            </View>
            <View style={styles.seatRow}>
              {row.seats.map((seat, seatIndex) => (
                <View key={seatIndex} style={styles.seatWrapper}>
                  <Pressable
                    style={[
                      styles.seat,
                      seat.isBooked
                        ? styles.bookedSeat
                        : seats.includes(seat.id)
                        ? styles.selectedSeat
                        : styles.availableSeat,
                    ]}
                    onPress={() => {
                      if (!seat.isBooked) {
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

  const getSelectedSeatsInfo = () => {
    if (!roomLayout || !Array.isArray(roomLayout.rows)) {
      return [];
    }
  
    return seats.map((seatId) => {
      for (const row of roomLayout.rows) {
        const seat = row.seats.find((s) => s.id === seatId);
        if (seat) {
          return `${row.name}${seat.name}`; // Concatenate row name and seat name (e.g., "H9")
        }
      }
      return null;
    }).filter(Boolean); // Filter out null values if any seatId is not found
  };
  

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
              {/* Lấy số name và số ghế*/}
              Ghế: {getSelectedSeatsInfo().join(', ')}
            </Text>
          </View>
          <View style={styles.totalAmount}>
            <Text>
              Tổng cộng: 
            </Text>
            <Text> {calculateTotal().toLocaleString("vi-VN")} VND</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate("SelectCombo", {
              //Hiện thị ghế đã chọn
              seats: getSelectedSeatsInfo(),
              total: calculateTotal(),
              name: route.params.movieTitle,
              mall: route.params.cinemaName,
              timeSelected: formattedStartTime,
              tableSeats: route.params.roomName,
              // Rạp phim
              movie: route.params.movie,
              // Hiển thị ghế đã chọn 
              getSelectedSeats: getSelectedSeatsInfo().join(', '),
              // thêm hình ảnh phim movieImage
              movieImage: route.params.movieImage,
              // startTime
              startTime: formattedStartTime,
              // age: movie.age,
              age: route.params.age,
              // selectedDate: selectedDateFormatted,
              selectedDate: route.params.selectedDate,
              
             

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
    flex: 1, // Fill the entire area
    justifyContent: "space-between", // Keep content distributed
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
  seatContainer: {
    marginVertical: 20,
  },
  layfromrow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
    width: "100%", // Ensures full width
  },
  rowLabelContainer: {
    maxWidth: "25%", // Fixed width for row labels
    alignItems: "center", // Center align the labels
    width: "20%",
  },
  seatRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    flexGrow: 1,
    maxWidth: "75%", // Limits the width to prevent pushing labels
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
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    margin: 1,
  },
  availableSeat: {
    backgroundColor: "white",
  },
  bookedSeat: {
    backgroundColor: "#989898",
  },
  selectedSeat: {
    backgroundColor: "#ffc40c",
  },
  seatText: {
    fontSize: 10,
    color: "black",
  },
  seatWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
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
  startTime: {
    textAlign: "center",
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 10,
    color: "gray",
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
  seatCount: {
    paddingLeft: 25,
    paddingTop: 10,
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
  seatLayoutContainer: {
    alignItems: "center", // Use contentContainerStyle for alignment
    marginTop: 20,
    paddingBottom: 20, // Add padding if needed for scroll comfort
  },
});
