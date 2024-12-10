import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

// Sample notification data (same as before)
const notificationData = [
  {
    id: 1,
    title: "Khuyến mãi đặc biệt",
    content: "Giảm 50% cho suất chiếu đầu tiên trong tuần!",
    image: "https://cdn.galaxycine.vn/media/2024/12/6/shopee-pay-1_1733479302828.jpg",
    date: new Date("2024-02-15T14:30:00"),
    type: "promotion"
  },
  {
    id: 2,
    title: "Đặt vé thành công",
    content: "Bạn đã đặt vé xem phim Dune: Part Two thành công",
    image: "https://cdn.galaxycine.vn/media/2024/12/6/500_1733461566594.jpg",
    date: new Date("2024-02-14T19:45:00"),
    type: "booking"
  },
  {
    id: 3,
    title: "Ưu đãi thành viên",
    content: "Bạn có 100 điểm thưởng mới được cộng vào tài khoản",
    image: "https://cdn.galaxycine.vn/media/2024/1/19/1200x1800_1705628936074.jpg",
    date: new Date("2024-02-13T10:15:00"),
    type: "loyalty"
  },
  {
    id: 4,
    title: "Phim mới sắp ra mắt",
    content: "Avengers: Secret Wars - Đặt vé ngay để không bỏ lỡ!",
    image: "https://cdn.galaxycine.vn/media/2024/12/3/ngai-qu-500_1733197391606.jpg",
    date: new Date("2024-02-12T16:20:00"),
    type: "movie_release"
  },
  {
    id: 5,
    title: "Thông báo hệ thống",
    content: "Hệ thống sẽ bảo trì vào lúc 2:00 AM ngày mai",
    image: "https://cdn.galaxycine.vn/media/2024/11/29/brand-gcxgp-1200x1800_1732877210672.jpg",
    date: new Date("2024-02-11T20:00:00"),
    type: "system"
  }
];

export default function Notification({ navigation }) {
  // Function to get icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "promotion":
        return "tago";
      case "booking":
        return "checkcircleo";
      case "loyalty":
        return "gift";
      case "movie_release":
        return "star";
      case "system":
        return "infocirlceo";
      default:
        return "notification";
    }
  };

  // Function to format date in a more readable way
  const formatDate = (date) => {
    return date.toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar/>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.navigate("MainTabs")}
          style={styles.backButton}
        >
          <AntDesign name="arrowleft" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông báo</Text>
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {notificationData.map((notification) => (
          <TouchableOpacity 
            key={notification.id} 
            style={styles.notificationCard}
          >
            <View style={styles.notificationHeader}>
              <View style={styles.notificationHeaderLeft}>
                <AntDesign
                  name={getNotificationIcon(notification.type)}
                  size={20}
                  color="#4A6CF7"
                />
                <Text style={styles.notificationTitle}>
                  {notification.title}
                </Text>
              </View>
              <Text style={styles.notificationDate}>
                {formatDate(notification.date)}
              </Text>
            </View>
            
            <View style={styles.notificationContent}>
              <Image
                source={{ uri: notification.image }}
                style={styles.notificationImage}
                resizeMode="cover"
              />
              <Text style={styles.notificationDescription}>
                {notification.content}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1.2,
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
    paddingVertical: 10
  },
  backButton: {
    marginRight: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
  },
  scrollViewContent: {
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  notificationCard: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  notificationHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
    color: "#333",
  },
  notificationDate: {
    fontSize: 12,
    color: "#888",
    width: 140,
  },
  notificationContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  notificationDescription: {
    flex: 1,
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
});