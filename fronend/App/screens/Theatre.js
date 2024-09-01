import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Pressable,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { FontAwesome } from "@expo/vector-icons";

export default function Theatre({ navigation }) {
  const route = useRoute();

  // Tạo trạng thái `seats` tại đây
  const [seats, setSeats] = useState([]);
  const pricePerSeat = 40000; // 40 nghìn VND mỗi ghế

  const selectedDate = new Date(route.params.selectedDate);


  const onSeatSelect = (item) => {
    const seatSelected = seats.find((seat) => seat === item);
    if (seatSelected) {
      setSeats(seats.filter((seat) => seat !== item));
    } else {
      setSeats([...seats, item]);
    }
  };

  const showSeats = () => {
    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {seats.map((seat, index) => (
          <Text
            key={index}
            style={{ marginTop: 4, fontSize: 17, paddingHorizontal: 4 }}
          >
            {seat}
          </Text>
        ))}
      </View>
    );
  };

  const calculateTotal = () => {
    return seats.length * pricePerSeat;
  };

  return (
    <KeyboardAvoidingView
      contentContainerStyle={styles.contain}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.contain}
    >
      <StatusBar />
      <SafeAreaView>
        <View
          style={{
            alignItems: "flex-start",
            justifyContent: "flex-start",
            marginLeft: 10,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <AntDesign name="arrowleft" size={28} color="black" />
            </TouchableOpacity>

            <View style={{ marginLeft: 9 }}>
              <Text style={{ fontSize: 18, fontWeight: "600" }}>
                {route.params.name}
              </Text>
              <Text style={{ fontSize: 15, marginTop: 2, color: "gray" }}>
                {route.params.mall}
              </Text>
            </View>
          </View>
        </View>
        <Text
          style={{
            textAlign: "center",
            fontSize: 15,
            fontWeight: "bold",
            marginTop: 10,
            justifyContent: "center",
          }}
        >
          {route.params.timeSelected}
        </Text>
        <Text
          style={{
            textAlign: "center",
            fontSize: 12,
            fontWeight: "bold",
            marginTop: 10,
            justifyContent: "center",
            color: "gray",
          }}
        >
          CLASSIC (240)
        </Text>

        <View style={{ marginTop: 20 }} />
        <FlatList
          numColumns={7}
          data={route.params.tableSeats}
          style={{ marginLeft: 8 }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => onSeatSelect(item)}
              style={{
                margin: 10,
                borderColor: "gray",
                borderWidth: 0.5,
                borderRadius: 5,
                flex: 0.2,
              }}
            >
              {seats.includes(item) ? (
                <Text
                  style={{
                    backgroundColor: "#ffc40c",
                    padding: 8,
                    flex: 1,
                    borderRadius: 5,
                  }}
                >
                  {item}
                </Text>
              ) : (
                <Text style={{ padding: 8, flex: 1 }}>{item}</Text>
              )}
            </Pressable>
          )}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: 90,
            top: -60,
            backgroundColor: "#D8D8D8",
            padding: 10,
            marginLeft: 4,
            width: 410,
          }}
        >
          <View>
            <FontAwesome
              style={{ textAlign: "center", marginBottom: 4 }}
              name="square"
              size={24}
              color="#ffc40c"
            />
            <Text>Đang chọn</Text>
          </View>
          <View style={{ marginHorizontal: 20 }}>
            <FontAwesome
              style={{ textAlign: "center", marginBottom: 4 }}
              name="square"
              size={24}
              color="white"
            />
            <Text style={{ width: 80 }}>Ghế trống</Text>
          </View>
          <View>
            <FontAwesome
              style={{ textAlign: "center", marginBottom: 4 }}
              name="square"
              size={24}
              color="#989898"
            />
            <Text>Đã bán</Text>
          </View>
        </View>
        <View
          style={{
            padding: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View>
            <Text
              style={{
                marginBottom: 4,
                fontSize: 15,
                fontWeight: "500",
              }}
            >
              Show end time approx 6:51 pm
            </Text>
            {seats.length > 0 ? (
              showSeats()
            ) : (
              <Text style={{ fontSize: 18, width: 170 }}>No seat selected</Text>
            )}
          </View>
          <View
            style={{
              backgroundColor: "#E0E0E0",
              padding: 6,
              borderTopLeftRadius: 6,
              borderBottomEndRadius: 6,
              right: -4,
            }}
          >
            <Text style={{ width: 110 }}>
              Tổng cộng: {calculateTotal().toLocaleString("vi-VN")} VND
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate("SelectCombo", {
              seats: seats,
              total: calculateTotal(),
              name: route.params.name,
              mall: route.params.mall,
              timeSelected: route.params.timeSelected,
              tableSeats: route.params.tableSeats,
              movie: route.params.movie,
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
  contain: {
    flex: 1.2,
    alignItems: "flex-start",
    backgroundColor: "white",
    paddingTop: 38,
  },
  button: {
    width: "100%",
    top: "-1%",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 20,
    backgroundColor: "#FFA500",
    width: 400,
    left: 10,
    height: 50,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
