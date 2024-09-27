import React, { useState, useEffect } from "react";
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
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import axios from "axios";
import { useRoute } from "@react-navigation/native";

export default function SelectCombo({ navigation }) {
  const route = useRoute();
  const [combos, setCombos] = useState([]); // State to store fetched combos
  const [selectedCombos, setSelectedCombos] = useState({});

  useEffect(() => {
    // Fetch combo data from the API
    const fetchCombos = async () => {
      try {
        const response = await axios.get(
          "http://192.168.1.7:8080/api/v1/products"
        );
        setCombos(response.data.data); // Assuming response.data.data contains the combo array
      } catch (error) {
        console.error("Error fetching combo data: ", error);
      }
    };

    fetchCombos();
  }, []);

  const increaseQuantity = (id) => {
    setSelectedCombos((prevSelectedCombos) => ({
      ...prevSelectedCombos,
      [id]: (prevSelectedCombos[id] || 0) + 1,
    }));
  };

  const decreaseQuantity = (id) => {
    setSelectedCombos((prevSelectedCombos) => {
      const newQuantity = (prevSelectedCombos[id] || 0) - 1;
      if (newQuantity <= 0) {
        const { [id]: _, ...rest } = prevSelectedCombos;
        return rest;
      } else {
        return {
          ...prevSelectedCombos,
          [id]: newQuantity,
        };
      }
    });
  };

  const calculateTotal = () => {
    return Object.keys(selectedCombos).reduce((total, id) => {
      const combo = combos.find((item) => item.id.toString() === id);
      return total + combo.price * selectedCombos[id];
    }, 0);
  };

  const totalWithCombos = route.params.total + calculateTotal();

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
              Tổng cộng: {totalWithCombos.toLocaleString("vi-VN")}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("PayMent", {
              //   seats: getSelectedSeatsInfo(),
              // total: calculateTotal(),
              // name: route.params.movieTitle,
              // mall: route.params.cinemaName,
              // timeSelected: formattedStartTime,
              // tableSeats: route.params.roomName,
              // // Rạp phim
              // movie: route.params.movie,
              // // Hiển thị ghế đã chọn 
              // getSelectedSeats: getSelectedSeatsInfo().join(', '),
              // // thêm hình ảnh phim movieImage
              // movieImage: route.params.movieImage,
              // // startTime
              // startTime: formattedStartTime,
              // Lấy các thông tin này
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
               

              })
            }
           
            style={styles.button}
          >
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
    height: 120,
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
  },
});
