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
  Image,
  Alert,
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
  const [selectedSeatsData, setSelectedSeatsData] = useState([]); // New state to store seat data
  const [accessToken, setAccessToken] = useState(null);

  // Calculate total based on seat type prices
  const calculateTotal = () => {
    // If finalAmount exists, use it instead of calculating from seats
    if (finalAmount !== null) {
      return finalAmount;
    }
    return selectedSeatsData.reduce((total, seat) => total + seat.price, 0);
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
    const fetchAccessToken = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        setAccessToken(token || "No token found");
      } catch (error) {
        console.error("Error retrieving accessToken:", error);
      }
    };

    fetchAccessToken();
  }, []);

  useEffect(() => {
    if (roomId) {
      const fetchRoomLayout = async () => {
        try {
          const response = await axios.get(
            API_GetRoomLayout + showtimeId + "/seat-layout"
          );
          setRoomLayout(response.data.data);
          const { NORMAL, COUPLE } = response.data.data.prices;
          setSeatPrices({ NORMAL, COUPLE });
        } catch (error) {
          console.log("Fetch room error: ", error);
        }
      };
      fetchRoomLayout();
    }
  }, [roomId]);

  const handleSeatSelection = (seat, nextSeat = null) => {
    if (seat.booked) return;

    setSeats(prevSeats => {
      const isSelected = prevSeats.includes(seat.id);
      let newSeats;

      if (seat.type === "COUPLE") {
        if (isSelected) {
          newSeats = prevSeats.filter(id => id !== seat.id && id !== nextSeat.id);
        } else {
          newSeats = [...prevSeats, seat.id, nextSeat.id];
        }
      } else {
        if (isSelected) {
          newSeats = prevSeats.filter(id => id !== seat.id);
        } else {
          newSeats = [...prevSeats, seat.id];
        }
      }

      // Update selected seats data
      const newSelectedSeatsData = newSeats.map(seatId => {
        const selectedSeat = findSeatById(seatId);
        const row = roomLayout.rows[selectedSeat.rowIndex];
        return {
          id: seatId,
          name: `${row.name}${selectedSeat.name}`,
          price: selectedSeat.price,
          type: selectedSeat.type
        };
      });

      setSelectedSeatsData(newSelectedSeatsData);
      return newSeats;
    });
  };



  const [finalAmount, setFinalAmount] = useState(null);
const [showDiscountAlert, setShowDiscountAlert] = useState(false);
const [orderData, setOrderData] = useState(null);

const handleContinue = async () => {
  if (seats.length === 0) {
    Alert.alert("Thông báo", "Vui lòng chọn ghế trước khi tiếp tục");
    return;
  }

  if (!accessToken) {
    Alert.alert("Thông báo", "Vui lòng đăng nhập để đặt vé");
    return;
  }

  // Nếu đã có orderData, nghĩa là API đã được gọi trước đó
  if (orderData) {
    navigation.navigate("SelectCombo", orderData);
    return;
  }

  try {
    const response = await axios.post(
      API_CreateOrder,
      {
        showTimeId: showtimeId,
        seatIds: seats,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const orderId = response.data.data.id;
    await AsyncStorage.setItem("orderId", orderId.toString());

    // Update finalAmount if there's a discount in the response
    if (response.data.data.finalAmount) {
      setFinalAmount(response.data.data.finalAmount);
    }

      // Tính toán các giá trị
      const formattedSeats = selectedSeatsData.map(seat => seat.name).join(", ");
      const originalTotal = selectedSeatsData.reduce((total, seat) => total + seat.price, 0);
      const finalAmount = response.data.data.finalAmount;
      const hasDiscount = finalAmount && finalAmount !== originalTotal;
      
      // Xác định total dựa trên việc có giảm giá hay không
      const total = hasDiscount ? finalAmount : originalTotal;

    const navigationData = {
      seats: formattedSeats,
      // total lấy giá trị của Tại sao lại lấy giá trị của currentTotal ở đây?total: currentTotal nó ra null cách khác để lấy giá trị của currentTotal ở đây là sao?
      total: total,
      originalTotal: originalTotal,
      hasDiscount: hasDiscount,
      name: route.params.movieTitle,
      mall: route.params.cinemaName,
      timeSelected: formattedStartTime,
      tableSeats: route.params.roomName,
      movie: route.params.movie,
      movieImage: route.params.movieImage,
      startTime: formattedStartTime,
      ageRating: route.params.ageRating,
      selectedDate: route.params.selectedDate,
      showtimeId: showtimeId,
      orderId: orderId,
      rating: route.params.rating,
      
    };

    console.log("ccurrentTotal:", currentTotal);
    

    setOrderData(navigationData);

    // Nếu có giảm giá, hiển thị thông báo
    if (hasDiscount) {
      Alert.alert(
        "Thông báo",
        `Bạn đã được giảm giá ${(originalTotal - response.data.data.finalAmount).toLocaleString("vi-VN")} VND`,
        [
          {
            text: "Tiếp tục",
            onPress: () => setShowDiscountAlert(true)
          }
        ]
      );
    } else {
      navigation.navigate("SelectCombo", navigationData);
    }

  } catch (error) {
    console.error("Error creating order:", error);
    Alert.alert(
      "Lỗi",
      "Không thể tạo đơn hàng. Vui lòng thử lại.",
      [{ text: "OK" }]
    );
  }
};

// Lưu currentTotal vào state
const [currentTotal, setCurrentTotal] = useState(null);

const renderTotalAmount = () => {
  const originalTotal = selectedSeatsData.reduce((total, seat) => total + seat.price, 0);
  const hasDiscount = finalAmount !== null && finalAmount !== originalTotal;
  const displayTotal = hasDiscount ? finalAmount : originalTotal;

  return (
    <View style={styles.totalAmount}>
      {hasDiscount ? (
        <>
          <Text style={styles.originalPrice}>
            {originalTotal.toLocaleString("vi-VN")} VND
          </Text>
          <Text style={styles.discountedPrice}>
            {displayTotal.toLocaleString("vi-VN")} VND
          </Text>
        </>
      ) : (
        <Text style={styles.normalPrice}>
          {displayTotal.toLocaleString("vi-VN")} VND
        </Text>
      )}
    </View>
  );
};



  const renderSeats = () => {
    if (!roomLayout || !Array.isArray(roomLayout.rows)) {
      return null;
    }

    const rows = Array(roomLayout.maxRow).fill(null);
    roomLayout.rows.forEach((row) => (rows[row.index] = row));

    const renderSeat = (seat, index, array) => {
      if (!seat) {
        return <View key={`empty-${index}`} style={styles.emptySeat} />;
      }

      if (seat.price === null) {
        return null;
      }

      if (seat.type === "COUPLE") {
        const nextSeat = array[index + 1];
        array.splice(index + 1, 1);

        const isSelected = seats.includes(seat.id) && seats.includes(nextSeat?.id);

        return (
          <Pressable
            key={seat.id}
            style={[
              styles.coupleSeatContainer,
              isSelected ? styles.selectedSeat : styles.availableSeat,
            ]}
            onPress={() => handleSeatSelection(seat, nextSeat)}
            disabled={seat.booked}
          >
            <Text style={[styles.seatText, isSelected && { color: "#ffffff" }]}>
              {seat.name}
            </Text>
            <Text style={[styles.seatText, isSelected && { color: "#ffffff" }]}>
              {nextSeat?.name}
            </Text>
          </Pressable>
        );
      }

      const isSelected = seats.includes(seat.id);
      return (
        <Pressable
          key={seat.id}
          style={[
            styles.seat,
            seat.booked
              ? styles.bookedSeat
              : isSelected
              ? styles.selectedSeat
              : styles.availableSeat,
          ]}
          onPress={() => handleSeatSelection(seat)}
          disabled={seat.booked}
        >
          <Text style={[styles.seatText, isSelected && { color: "#ffffff" }]}>
            {seat.name}
          </Text>
        </Pressable>
      );
    };

    const renderRow = (row) => {
      const seats = Array(roomLayout.maxColumn).fill(null);
      row.seats.forEach((seat) => (seats[seat.columnIndex] = seat));
      return seats.map(renderSeat);
    };

    return (
      <View style={styles.seatContainer}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.rowContainer}>
            {row ? (
              <>
                <View style={styles.rowLabelContainer}>
                  <Text style={styles.rowLabel}>{row.name}</Text>
                </View>
                <View style={styles.seatRow}>{renderRow(row)}</View>
                <View style={styles.rowLabelContainer}>
                  <Text style={styles.rowLabel}>{row.name}</Text>
                </View>
              </>
            ) : (
              <View />
            )}
          </View>
        ))}
      </View>
    );
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

        <ScrollView contentContainerStyle={styles.seatLayoutContainer}>
          {renderSeats()}
        </ScrollView>

        <View style={styles.Screen}>
          <Image
            source={require("../img/hinhanhT.png")}
            resizeMode="contain"
            style={styles.ScreenImg}
          />
        </View>

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

        <View style={styles.totalContainer}>
          <View style={styles.totalContainerLeft}>
            <Text style={styles.endTime}>
              Thời gian kết thúc: {formattedEndTime}
            </Text>
            <Text style={styles.seatCount}>
              Ghế: {selectedSeatsData.map(seat => seat.name).join(", ")}
            </Text>
          </View>
          {/* <View style={styles.totalAmount}>
            <Text>
              Tổng cộng: {calculateTotal().toLocaleString("vi-VN")} VND
            </Text>
          </View> */}
          {renderTotalAmount()}
        </View>

        <TouchableOpacity
          onPress={handleContinue}
          style={styles.button}
          disabled={seats.length === 0}
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
  // Ghế
  seatContainer: {
    marginVertical: 20,
    width: "100%",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "center", // Center the seats horizontally
    alignItems: "center",
    marginVertical: 5,
    width: "100%",
  },
  rowLabelContainer: {
    width: "10%",
    alignItems: "center",
  },
  seatRow: {
    flexDirection: "row",
    flexWrap: "nowrap", // Ensure seats don't wrap to the next line
    justifyContent: "space-between", // Center the seats within the row
    maxWidth: "90%",
    marginLeft: "auto", // Align to center by default
    marginRight: "auto",
  },
  seat: {
    width: 22, // Adjust seat size as needed
    height: 22,
    borderWidth: 1,
    borderColor: "#999999",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    margin: 1,
  },
  coupleSeatContainer: {
    width: 55, // Double width for couple seats
    height: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#999999",
    borderRadius: 4,
    paddingHorizontal: 4,
    gap: 3, // Ensure spacing between couple seats
  },
  seatText: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#000000", // Default text color (black)
  },
  emptySeat: {
    width: 22,
    height: 22,
  },
  availableSeat: {
    backgroundColor: "#ffffff", // Available seat color
  },
  bookedSeat: {
    backgroundColor: "#989898", // Booked seat color
  },
  selectedSeat: {
    backgroundColor: "#FFC40C", // Yellow background for selected seats
    color: "#ffffff", // White text for selected seats
  },

  // Tông cộng
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
  Screen: {
    padding: 10,
    width: 410,
    marginLeft: 4,
    top: -5,
    justifyContent: "center",
    alignItems: "center",
  },
  ScreenImg: {
    width: 710,
    height: 120,
    borderRadius: 10,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    color: '#999',
    fontSize: 14,
    marginBottom: 4,
  },
  discountedPrice: {
    color: '#e51c23', // Màu đỏ cho giá đã giảm
    fontSize: 16,
    fontWeight: 'bold',
  },
  normalPrice: {
    fontSize: 16,
    color: '#000',
  },

});
