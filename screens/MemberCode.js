import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import Barcode from "@kichiyaki/react-native-barcode-generator";
import QRCode from "react-native-qrcode-svg";

export default function MemberCode({ navigation, memberData }) {
  // Assuming memberData contains member-specific information
  const memberCode = memberData?.code || "MEMBER123";

  return (
    <KeyboardAvoidingView
      contentContainerStyle={styles.contain}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.contain}
    >
      <StatusBar />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("MainTabs")}>
          <AntDesign name="arrowleft" size={28} color="#0000DD" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Mã thành viên</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.contentText}>Hiển thị QR/Barcode</Text>

        {/* Barcode Generator */}
        <View style={styles.contentBarcode}>
          <Barcode
            value={memberCode}
            format="CODE128"
            text={memberCode}
            width={2}
            height={100}
            style={styles.barcodeStyle}
          />
        </View>

        {/* QR Code Generator */}
        <View style={styles.contentQR}>
          <QRCode
            value={memberCode}
            size={170}
            color="black"
            backgroundColor="white"
          />
          <Text style={styles.contentTextQR}>Quét QR code trên màn hình</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate("MainTabs")}
        >
          <Text style={styles.footerText}>Đóng</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  contain: {
    flex: 1.2,
    alignItems: "center",
    paddingTop: 35,
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
    marginLeft: 25,
  },
  content: {
    backgroundColor: "white",
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginTop: 10,
    height: "83%",
  },
  contentText: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 20,
  },
  contentBarcode: {
    marginBottom: 20,
    top: 10,
  },
  contentQR: {
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    top: 90,
  },
  contentTextQR: {
    fontSize: 16,
    marginTop: 10,
    fontWeight: "bold",
    top: "5%",
  },
  footer: {
    width: "50%",
    alignItems: "center",
  },
  footerButton: {
    backgroundColor: "#FFA500",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginTop: 20,
    width: "180%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",

  },
  footerText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});
