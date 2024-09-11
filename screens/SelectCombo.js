import React, { useState } from "react";
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
import { comboData } from "../data/combo";
import { useRoute } from "@react-navigation/native";

export default function SelectCombo({ navigation }) {
  const route = useRoute();
  const [selectedCombos, setSelectedCombos] = useState({});

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
      const combo = comboData.find((item) => item.id.toString() === id);
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
          data={comboData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.commentItem}>
              <Image source={item.image} style={styles.commentImage} />
              <View style={styles.commentTextContainer}>
                <Text style={styles.commentTitle}>{item.title}</Text>
                <Text style={styles.readMore}>{item.content}</Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.priceFastlist}>Giá: {item.price}đ</Text>

                  <View style={styles.quantityContainer}>
                    <TouchableOpacity onPress={() => decreaseQuantity(item.id)}>
                      <Text style={styles.quantityButton}>–</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>
                      {selectedCombos[item.id] || 0}
                    </Text>
                    <TouchableOpacity onPress={() => increaseQuantity(item.id)}>
                      <Text style={styles.quantityButton}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          )}
        />
        <View style={styles.footer}>
          <View>
            <Text style={styles.seatText}>{`${route.params.seats.length}x ghế ${route.params.seats.join(
              ", "
            )}`}</Text>
            <Text style={styles.toltalText}>Tổng cộng: {totalWithCombos.toLocaleString("vi-VN")}đ</Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("PayMent", {

                seats: route.params.seats,
                total: totalWithCombos,
                name: route.params.name,
                mall: route.params.mall,
                timeSelected: route.params.timeSelected,
                tableSeats: route.params.tableSeats,
                movie: route.params.movie,
                selectedDate: route.params.selectedDate,
              })
            }
           style={styles.button}>
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
    left: 120,
    backgroundColor: "white",
    borderWidth: 0.2,
    borderColor: "gray",
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
