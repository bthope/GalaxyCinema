import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  Image,
  Alert,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_CompleteOrder, API_DeleteDiscount, API_GetDiscount, API_VNPay, API_ZaloPay } from "../api/Api";
import { Modal } from "react-native-paper";
import { TextInput } from "react-native-gesture-handler";
import axios from "axios";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import WebView from 'react-native-webview';

// Thành phần RadioButton tùy chỉnh
const RadioButton = ({ selected, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      {selected ? (
        <MaterialIcons
          name="check-circle"
          size={24}
          color="#FFA500"
          style={{ top: 10 }}
        />
      ) : (
        <MaterialIcons
          name="radio-button-unchecked"
          size={24}
          color="gray"
          style={{ top: 10 }}
        />
      )}
    </TouchableOpacity>
  );
};

export default function PayMent({ navigation }) {
  const route = useRoute();
  const selectedDate = new Date(route.params.selectedDate);
  const day = String(selectedDate.getDate()).padStart(2, "0"); // Get day and pad with leading zero
  const month = String(selectedDate.getMonth() + 1).padStart(2, "0"); // Get month and pad with leading zero
  const year = selectedDate.getFullYear(); // Get full year

  const formattedDate = `${day}/${month}/${year}`;

  // Mở modal khuyến mãi
  const [isModalVisible, setModalVisible] = useState(false);
  const [showWebView, setShowWebView] = useState(false);
  const [webViewUrl, setWebViewUrl] = useState('');

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  // Trạng thái cho phương thức thanh toán được chọn
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    "ZaloPay",
    "vnPay",
  );
  // Lấy showtimeId từ route.params
  const showtimeId = route.params.showtimeId;
  console.log("showtimeId", showtimeId);
  const [accessToken, setAccessToken] = useState(null);
  const [seatIds, setSeatIds] = useState([0]);
  const [transId, setTransId] = useState(null);
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

  // Log accessToken
  useEffect(() => {
    console.log("accessToken:", accessToken);
  }, [accessToken]);

  // Gọi  await AsyncStorage.setItem("orderId", orderId.toString()); để lấy orderId
  const [orderId, setOrderId] = useState(null);
  useEffect(() => {
    const fetchOrderId = async () => {
      try {
        const orderId = await AsyncStorage.getItem("orderId");
        setOrderId(orderId);
        console.log("Fetched orderId:", orderId);
      } catch (error) {
        console.error("Error retrieving orderId:", error);
      }
    };

    fetchOrderId();
  }, []);
  // Log orderId
  useEffect(() => {
    console.log("orderId:", orderId);
  }, [orderId]);

   //ZaloPay payment handler
   const handleZaloPayPayment = async () => {
    try {
      const response = await axios.post(
         API_ZaloPay,
        {
          orderId: orderId
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          }
        }
      );
  
      console.log('ZaloPay response:', response.data);
  
      if (response.data.data && response.data.data.orderUrl) {
        setWebViewUrl(response.data.data.orderUrl);
        setTransId(response.data.data.transId);
        setShowWebView(true);
      } else {
        Alert.alert('Error', 'Failed to initialize ZaloPay payment');
      }
    } catch (error) {
      console.error('Error creating ZaloPay payment:', error);
      Alert.alert('Error', 'Failed to connect to ZaloPay payment service');
    }
  };

   // Add function to check ZaloPay payment status
const checkZaloPayStatus = async (transId) => {
  try {
    const response = await axios.get(
        API_ZaloPay + `?transId=${transId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error checking ZaloPay status:', error);
    throw error;
  }
};


  //VnPay payment handler
  const handleVNPayPayment = async () => {
    try {
      const response = await fetch(
        // `http://192.168.1.5:8080/api/v1/payment/create_payment/${orderId}`
        API_VNPay + orderId,
        {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log('VNPay response:', data);

      if (data.status === 'OK' && data.url) {
        setWebViewUrl(data.url);
        setShowWebView(true);
      } else {
        Alert.alert('Error', 'Failed to initialize VNPay payment');
      }
    } catch (error) {
      console.error('Error creating VNPay payment:', error);
      Alert.alert('Error', 'Failed to connect to payment service');
    }
  };

  // Xử lý khi WebView navigate
  // Cập nhật hàm xử lý WebView navigation
  const handleNavigationStateChange = async (navState) => {
    const currentUrl = navState?.url;
    if (!currentUrl) {
      console.log('No URL in navigation state');
      return;
    }
  
    try {
      // Xử lý callback từ VNPay
      if (currentUrl.includes('payment_infor')) {
        setShowWebView(false);
        
        const urlParams = new URLSearchParams(currentUrl.split('?')[1]);
        const status = urlParams.get('vnp_ResponseCode');
        
        if (status === '00') {
          confirmPayment().then(() => {
            navigation.navigate('DetailedInvoice', {
              ...route.params,
              finalAmount: finalAmount || route.params.total,
            });
          }).catch((error) => {
            console.error('Error confirming payment:', error);
            Alert.alert('Error', 'Payment was successful but confirmation failed. Please contact support.');
          });
        } else {
          Alert.alert('Failed', 'VNPay payment was not successful');
        }
      }
      
      // Xử lý callback từ ZaloPay
      if (currentUrl.includes('close')) { // Adjust this based on ZaloPay's actual return URL pattern
        setShowWebView(false);
        
        if (transId) {
          try {
            // Kiểm tra trạng thái thanh toán ZaloPay
            const statusResponse = await checkZaloPayStatus(transId);
            
            if (statusResponse.returncode === 1) { // Assume 1 is success code, adjust as needed
              confirmPayment().then(() => {
                navigation.navigate('DetailedInvoice', {
                  ...route.params,
                  finalAmount: finalAmount || route.params.total,
                });
              }).catch((error) => {
                console.error('Error confirming ZaloPay payment:', error);
                Alert.alert('Error', 'Payment was successful but confirmation failed. Please contact support.');
              });
            } else {
              Alert.alert('Failed', 'ZaloPay payment was not successful');
            }
          } catch (error) {
            console.error('Error checking ZaloPay payment status:', error);
            Alert.alert('Error', 'Failed to verify payment status. Please contact support.');
          }
        }
      }
    } catch (error) {
      console.error('Error processing navigation:', error);
      Alert.alert('Error', 'An error occurred while processing the payment.');
    } finally {
      // Reset transId after processing
      setTransId(null);
    }
  };
  


  // Hàm hủy voucher code
  const cancelVoucher = async () => {
    if (!accessToken || !orderId) {
      Alert.alert("Error", "Access token or order ID is missing.");
      return;
    }

    // const url = `http://192.168.1.8:8080/api/v1/orders/${orderId}/discounts/clear`;

    try {
      const response = await fetch(API_DeleteDiscount + orderId + "/discounts/clear", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        console.log("Voucher cleared thành công.");
        // Thông báo thành công và quay lại trang trước
        Alert.alert("Thông báo", "Voucher cleared thành công.", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        const errorData = await response.json();
        console.error("Failed to clear voucher:", errorData);
        Alert.alert("Error", "Failed to clear voucher.");
      }
    } catch (error) {
      console.error("Error clearing voucher:", error);
      Alert.alert("Error", "An error occurred while clearing the voucher.");
    }
  };

  // Hàm xử lý mã voucher
  // Hàm gọi API giảm giá
  const [voucherCode, setVoucherCode] = useState("");
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [discountedProducts, setDiscountedProducts] = useState([]);
  const [finalAmount, setFinalAmount] = useState(0);

  const applyDiscount = async () => {
    if (!orderId || !accessToken || !voucherCode) {
      console.error("Missing orderId, accessToken, or voucherCode");
      return;
    }

    try {
      const response = await axios.put(
        // `http://192.168.1.8:8080/api/v1/orders/${orderId}/discounts`,
        API_GetDiscount + orderId + "/discounts",
        { code: voucherCode },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Sử dụng accessToken cho xác thực
          },
        }
      );

      console.log("Discount applied successfully:", response.data);
      // toggleModal(); // Đóng modal sau khi thành công
      const { totalDiscount, orderDetails } = response.data.data;
      const freeGifts = orderDetails.filter(
        (item) => item.type === "PRODUCT" && item.price === 0.0
      );
      setTotalDiscount(totalDiscount);
      setDiscountedProducts(freeGifts);

      // Tính tổng tiền sau khi giảm giá
      const appliedDiscount = response.data.data.finalAmount;
      setFinalAmount(appliedDiscount);
    } catch (error) {
      console.error("Error applying discount:", error);
    }
  };

  // fetch API để gửi thông tin thanh toán
  const confirmPayment  = async () => {
    // Ensure the access token and orderId are available
    if (selectedPaymentMethod === 'vnPay') {
      await handleVNPayPayment();
    }
    if (!accessToken) {
      Alert.alert("Error", "Access token is missing.");
      return;
    }

    if (!orderId) {
      Alert.alert("Error", "Order ID is missing.");
      return;
    }
    // Prepare the payment data
    const paymentData = {
      showTimeId: showtimeId, 
      seatIds: [0],
    };

    try {
      // Make the PUT request to complete the order
      const response = await fetch(API_CompleteOrder + orderId + "/complete", {
        method: "PUT", 
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, 
        },
        body: JSON.stringify(paymentData), 
      });

      // Check if the response is okay
      if (!response.ok) {
        // Handle non-200 responses
        const errorMessage = await response.text(); 
        console.error("Payment error response:", errorMessage); 
        throw new Error("Payment failed: " + errorMessage); 
      }

      // Parse the JSON response
      const result = await response.json();
      console.log("Payment result:", result); // Log the payment result
      // Xóa AsyncStorage orderId
      await AsyncStorage.removeItem("orderId");
      // Xóa AsyncStorage timeLeft
      await AsyncStorage.removeItem("timeLeft");
      // Xóa đi thông tin đếm ngược
      setTimeLeft(null);

      // Chuyển hướng sang trang DetailedInvoice
      navigation.navigate("DetailedInvoice",{
       
          movieImage: route.params.movieImage,
         
          startTime: route.params.startTime,
          selectedCombos: route.params.selectedCombos,
          ageRating: route.params.ageRating,
          cinemaName: route.params.cinemaName,
          selectedDate: route.params.selectedDate,
          seats: route.params.seats,
          total: route.params.total,
          name: route.params.name,
          mall: route.params.mall,
          timeSelected: route.params.timeSelected,
          tableSeats: route.params.tableSeats,
          getSelectedSeats: route.params.getSelectedSeats,
          rating: route.params.rating,
          // Hiển thị giá finalAmount
          finalAmount: finalAmount !== null && finalAmount !== 0
            ? finalAmount
            : route.params.total,
      });
    } catch (error) {
      console.error("Payment error:", error); // Log the error
      Alert.alert("Error", "Payment could not be processed. Please try again."); // Show error alert
    }
  };

  // Hàm xử lý thanh toán chính
const handlePayment = async () => {
  if (!accessToken) {
    Alert.alert("Error", "Access token is missing.");
    return;
  }

  if (!orderId) {
    Alert.alert("Error", "Order ID is missing.");
    return;
  }

  if (selectedPaymentMethod === 'vnPay') {
    await handleVNPayPayment();
    return;
  }

  if (selectedPaymentMethod === 'ZaloPay') {
    await handleZaloPayPayment();
    return;
  }

  // Nếu không phải VNPay, thực hiện xác nhận thanh toán ngay
  try {
    await confirmPayment();
    Alert.alert("Thành công", "Thanh toán hoàn tất!");
  } catch (error) {
    console.error("Payment error:", error);
    Alert.alert("Error", "Payment could not be processed. Please try again.");
  }
};

  // // Lưu giá trị của Tổng cộng và ghế đã chọn và AsyncStorage  {route.params.total.toLocaleString("vi-VN")}đ và {route.params.getSelectedSeats} vào AsyncStorage
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
  // }, []);

  // Lấy giá trị timeLeft  timeLeft: timeLeft, từ route.params
  const [timeLeft, setTimeLeft] = useState(route.params?.timeLeft);

    // Load giá trị thời gian đã lưu từ AsyncStorage (nếu cần)
    const loadTimeLeft = async () => {
      try {
        const savedTime = await AsyncStorage.getItem("timeLeft");
        if (savedTime !== null) {
          setTimeLeft(parseInt(savedTime, 10)); // Chuyển đổi chuỗi sang số
        }
      } catch (error) {
        console.error("Error loading time left:", error);
      }
    };
  
    // Lưu giá trị thời gian còn lại vào AsyncStorage
    const saveTimeLeft = async (time) => {
      try {
        await AsyncStorage.setItem("timeLeft", time.toString());
      } catch (error) {
        console.error("Error saving time left:", error);
      }
    };
  
    // Effect để load giá trị timeLeft khi component mount
    useEffect(() => {
      if (!route.params?.timeLeft) {
        loadTimeLeft(); // Chỉ load từ AsyncStorage nếu không có giá trị từ params
      }
    }, []);
  
    // Effect đếm ngược thời gian
    useEffect(() => {
      if (timeLeft === 0) {
        navigation.navigate("MainTabs"); // Điều hướng khi hết thời gian
        return;
      }
  
      // Đếm ngược mỗi giây
      const timer = setTimeout(() => {
        setTimeLeft((prevTime) => prevTime - 1); // Giảm thời gian
      }, 1000);
  
      return () => clearTimeout(timer); // Hủy timer khi component unmount
    }, [timeLeft]);
  
    // Lưu giá trị timeLeft vào AsyncStorage khi có sự thay đổi
    useEffect(() => {
      if (timeLeft !== null) {
        saveTimeLeft(timeLeft);
      }
    }, [timeLeft]);
  
    // Hàm format thời gian
    const formatTime = (seconds) => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
    };
  return (
    <KeyboardAvoidingView
      contentContainerStyle={styles.contain}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.contain}
    >
      <StatusBar />
      <View style={styles.header}>
        <TouchableOpacity onPress={cancelVoucher}>
          <AntDesign name="arrowleft" size={28} color="#0000DD" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Thanh toán</Text>
      </View>
      <View style={styles.heaerTime}>
        <Text style={styles.headerTextTime}>Thời gian giữ ghế: {" "}
          {formatTime(timeLeft)}
        </Text>
      </View>
      <View style={styles.contentTitle}>
        <View>
          {/* movieImage */}
          <Image
            source={{ uri: route.params.movieImage }}
            style={styles.movieImage}
          />
        </View>
        <View>
          <Text style={styles.infoText}>{route.params.name}</Text>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.infoText}>2D phụ đề</Text>
            {/* age */}
            <TouchableOpacity style={styles.buttonTextAge}>
              <Text style={styles.movieAge}>{route.params.ageRating}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.infoText}>{route.params.mall} -</Text>
            <Text style={styles.infoText}>{route.params.tableSeats}</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.infoText}>{route.params.timeSelected} -</Text>
            {/* initialSelectedDate: route.params.initialSelectedDate, */}
            <Text style={styles.infoText}>{formattedDate}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.infoTextInfomation}>Thông tin giao dịch</Text>
      <View style={styles.contentInformation}>
        <View style={styles.contentSeat}>
          <Text style={styles.infoText}> {" "}
              {`${route.params.seats.length}x ghế ${route.params.seats.join(
                ", "
              )}`}</Text>
          <Text style={styles.infoText}>
            {route.params.total.toLocaleString("vi-VN")}đ
          </Text>
        </View>
        <View>
          <Text>
            ------------------------------------------------------------------------------------------
          </Text>
        </View>
        <View style={styles.contentSeat}>
          <TouchableOpacity style={styles.button} onPress={toggleModal}>
            <Text style={styles.buttonText}>Khuyến Mãi</Text>
            <AntDesign name="right" size={16} color="#FFA500" />
          </TouchableOpacity>

          <Text style={styles.infoText}>Tổng cộng:</Text>
          <Text style={styles.infoText1}>
            {finalAmount !== null  && finalAmount !== 0
              ? `${finalAmount.toLocaleString("vi-VN")}đ`
              : `${route.params.total.toLocaleString("vi-VN")}đ`}
          </Text>
        </View>
      </View>
      <Text style={styles.infoTextInfomation}>Phương thức thanh toán</Text>
      <View style={styles.contentPayMent}>
        {/* <View style={styles.contentTabPayMent}>
          <View style={styles.contentTab2PayMent}>
            <Image source={require("../img/zalopay.png")} style={styles.logo} />
            <Text style={styles.textPayMent}>ZaloPay</Text>
          </View>
          <View>
            <RadioButton
              selected={selectedPaymentMethod === "ZaloPay"}
              onPress={() => setSelectedPaymentMethod("ZaloPay")}
            />
          </View>
        </View> */}

        <View style={styles.contentTabPayMent}>
          <View style={styles.contentTab2PayMent}>
            <Image source={require("../img/VNPay.jpg")} style={styles.logo} />
            <Text style={styles.textPayMent}>VNPay</Text>
          </View>
          <View>
            <RadioButton
              selected={selectedPaymentMethod === "vnPay"}
              onPress={() => setSelectedPaymentMethod("vnPay")}
            />
          </View>
        </View>

        <View style={styles.contentFooter}>
          <View style={styles.contentFooterLeft}>
            <Text style={styles.infoText}>Tổng cộng:</Text>
            <Text style={styles.infoText1}>
              {finalAmount !== null  && finalAmount !== 0
                ? `${finalAmount.toLocaleString("vi-VN")}đ`
                : `${route.params.total.toLocaleString("vi-VN")}đ`}
            </Text>
          </View>
          <TouchableOpacity style={styles.button1} onPress={handlePayment}>
            <Text style={styles.buttonText1}>Thanh toán</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
        hardwareAccelerated={true}
        onShow={() => console.log("Modal is shown")}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{route.params.mall}</Text>
            <View style={styles.voucherRowCode}>
              <TextInput
                placeholder="Nhập mã voucher của Shop"
                style={styles.voucherInput}
                value={voucherCode} // Liên kết với state voucherCode
                onChangeText={setVoucherCode} // Cập nhật state khi thay đổi
              />
              <TouchableOpacity
                style={styles.applyButton}
                onPress={applyDiscount} // Gọi hàm áp dụng giảm giá
              >
                <Text style={styles.applyButtonText}>Áp Dụng</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.infoTextButom}>
              <Text style={styles.infoText}>
                Tổng giảm giá: {totalDiscount.toLocaleString("vi-VN")}đ
              </Text>

              {/* List free gifts */}
              {discountedProducts.length > 0 && (
                <View>
                  <Text style={styles.infoText}>Quà tặng:</Text>
                  {discountedProducts.map((item, index) => (
                    <View key={index} style={styles.giftItem}>
                      <Image
                        source={{ uri: item.product.image }}
                        style={styles.giftImage}
                      />
                      <Text style={styles.giftDescription}>
                        {item.product.description}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={toggleModal}
            >
              <Text style={styles.confirmButtonText}>Đồng ý</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Giao diện thanh toán VNPay */}
      {/* WebView Modal */}
      {showWebView && webViewUrl ? (
        <View style={styles.webViewContainer}>
          <View style={styles.header}>
            <TouchableOpacity 
              onPress={() => setShowWebView(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Payment</Text>
          </View>

          <WebView
            source={{ uri: webViewUrl }}
            style={styles.webView}
            onNavigationStateChange={handleNavigationStateChange}
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.warn('WebView error:', nativeEvent);
              Alert.alert('Error', 'Failed to load payment page');
            }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            scalesPageToFit={true}
          />
        </View>
      ) : null}


    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  contain: {
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
    paddingVertical: 10,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 18,
    marginLeft: 15,
  },
  contentTitle: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 10,
    top: 10,
    flexDirection: "row",
    height: 130,
    justifyContent: "space-around",
    alignItems: "center",
  },
  movieImage: {
    width: 80,
    height: 105,
    borderRadius: 7,
    left: 10,
    resizeMode: "cover",
  },
  infoText: {
    fontSize: 14,
    padding: 5,
    fontWeight: "bold",
    
  },
  infoTextInfomation: {
    fontSize: 14,
    fontWeight: "bold",
    padding: 10,
    top: 5,
  },
  contentInformation: {
    backgroundColor: "white",
    padding: 10,
    top: 5,
  },
  contentSeat: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    height: 35,
    justifyContent: "space-around",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "#fff",
    width: 130,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#FFA500",
  },
  buttonText: {
    color: "#FFA500",
    fontSize: 14,
    fontWeight: "bold",
  },
  infoText1: {
    fontSize: 16,
    padding: 5,
    fontWeight: "bold",
    color: "#FFA500",
    top: -2,

  },
  contentPayMent: {
    backgroundColor: "white",
    padding: 10,
    top: 5,
    height: 330,
  },
  contentTabPayMent: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  contentTab2PayMent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  textPayMent: {
    fontSize: 16,
    fontWeight: "bold",
    padding: 10,
    flexWrap: "wrap",
    width: 310,
  },
  contentFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    top: 280,
    backgroundColor: "white",
    height: 80,
    left: -10,
    width: 420,
    alignItems: "center",
  },
  contentFooterLeft: {
    flexDirection: "row",
  },
  button1: {
    height: 40,
    justifyContent: "space-around",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "#fff",
    width: 130,
    flexDirection: "row",
    backgroundColor: "#FFA500",
  },
  buttonText1: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  buttonTextAge: {
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF8C00",
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    width: 45,
    left: 10,
  },
  movieAge: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: "end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", 
  },
  modalContent: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    height: 500,
    elevation: 5, 
    flexDirection: "column",
  },
  voucherRowCode: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  voucherInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 7,
    marginBottom: 15,
    width: "70%",
    textAlignVertical: "center",
  },
  applyButton: {
    backgroundColor: "#28A745",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 15,
  },
  applyButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  confirmButton: {
    backgroundColor: "#FF8C00",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    top: 100,
  },
  confirmButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  giftItem: {
    flexDirection: "row",
    marginVertical: 5,
    alignItems: "center",
  },
  giftImage: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 5,
  },
  giftDescription: {
    fontSize: 14,
  },
  infoText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  infoTextButom: {
    top: 80,
  },
  heaerTime: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  headerTextTime: {
    fontWeight: "bold",
    fontSize: 16,
    color: "red",
  },
  webViewContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    zIndex: 999,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#000',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 40,
  },
  webView: {
    flex: 1,
  },
  paymentButton: {
    backgroundColor: '#FFA500',
    padding: 15,
    margin: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  paymentButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },


});