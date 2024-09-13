import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  Image,
  ScrollView,
  Dimensions,
  Modal,
  FlatList,
  Pressable,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { AntDesign } from "@expo/vector-icons";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import Icon1 from "react-native-vector-icons/AntDesign";
import Icon from "react-native-vector-icons/FontAwesome";
import { provinces } from "../data/provinces";
import HorizontalDatepicker from "@awrminkhodaei/react-native-horizontal-datepicker";
import malls from "../data/malls";
import axios from "axios"; // Import axios here

export default function TimeVenue({ route, navigation }) {
  const { movie } = route.params;
  console.log("Movie received:", movie);

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "showtimes", title: "Lịch chiếu" },
    { key: "infomation", title: "Thông tin" },
    { key: "new", title: "Tin tức" },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState("Toàn quốc");
  const [selectedProvinceIndex, setSelectedProvinceIndex] = useState(null);
  const [filteredCinemas, setFilteredCinemas] = useState([]); // Khởi tạo danh sách rạp phim

  const [mall, setMall] = useState([]);
  const mallsData = malls;
  const [showtimes, setShowtimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date("2024-08-15"));

  const [seatData, setSeatData] = useState([]);
  const [movieDetails, setMovieDetails] = useState({
    actors: [],
    directors: [],
    producers: [],
  });

  // Function to format date to "ngày/tháng/năm"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Fetch movie details
  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(
          `http://192.168.1.8:8080/api/v1/movies/${movie.slug}`
        );
        if (response.data.code === 200) {
          setMovieDetails(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    fetchMovieDetails();
  }, [movie.slug]);
  console.log("Movie details:", movieDetails);

  const handleDateChange = (date) => {
    console.log("Date received:", date);
    setSelectedDate(new Date(date)); // Đảm bảo date là đối tượng Date hợp lệ
  };

  const handleSelectProvince = (index) => {
    setSelectedProvince(provinces[index]);
    setSelectedProvinceIndex(index);
  };

  const handleConfirm = () => {
    // Lọc danh sách rạp phim dựa trên khu vực đã chọn
    const filtered = cinemas.filter((cinema) => {
      // Bạn có thể thêm logic để xác định khu vực cho các rạp phim
      return (
        selectedProvince === "Toàn quốc" ||
        cinema.address.includes(selectedProvince)
      );
    });
    setFilteredCinemas(filtered); // Cập nhật danh sách rạp phim đã lọc
    setModalVisible(false);
  };

  const Showtimes = () => (
    <FlatList
      data={mallsData}
      keyExtractor={(item) => item.name}
      ListHeaderComponent={() => (
        <View>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={styles.buttonNation}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.buttonTextNation}>{selectedProvince}</Text>
              <Icon1
                name="caretdown"
                size={12}
                color="gray"
                style={styles.buttonIcon}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonNation}>
              <Text style={styles.buttonTextNation}>Tất cả rạp</Text>
              <Icon1
                name="caretdown"
                size={12}
                color="gray"
                style={styles.buttonIcon}
              />
            </TouchableOpacity>
          </View>
          <View style={{ margin: 8 }}></View>
          <HorizontalDatepicker
            mode="gregorian"
            startDate={new Date("2024-08-10")}
            endDate={new Date("2024-08-17")}
            initialSelectedDate={selectedDate} // Sử dụng selectedDate làm initialSelectedDate
            onSelectedDateChange={handleDateChange}
            selectedItemWidth={170}
            unselectedItemWidth={38}
            itemHeight={38}
            itemRadius={10}
            selectedItemTextStyle={styles.selectedItemTextStyle}
            unselectedItemTextStyle={styles.selectedItemTextStyle}
            selectedItemBackgroundColor="#222831"
            unselectedItemBackgroundColor="#ececec"
            flatListContainerStyle={styles.flatListContainerStyle}
            selectedDate={selectedDate}
            scrollEnabled={true}
          />
        </View>
      )}
      renderItem={({ item }) => (
        <View style={{ margin: 10 }}>
          <Pressable
            onPress={() => {
              setMall(item.name);
              setSeatData(item.tableData);
            }}
            style={{ margin: 10 }}
            key={index}
          >
            <Text style={{ fontSize: 16, fontWeight: "500" }}>{item.name}</Text>
          </Pressable>
          {mall.includes(item.name) && (
            <FlatList
              numColumns={3}
              data={item.showtimes}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() =>
                    navigation.navigate("Theatre", {
                      mall: mall,
                      name: route.params.movie.title,
                      timeSelected: item,
                      tableSeats: seatData,
                      movie: route.params.movie,
                      selectedDate: selectedDate.toISOString(),
                    })
                  }
                  style={{
                    borderColor: "green",
                    padding: 10,
                    borderWidth: 0.5,
                    width: 90,
                    borderRadius: 3,
                    margin: 10,
                    padding: 5,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: "green",
                      fontWeight: "500",
                      textAlign: "center",
                    }}
                  >
                    {item}
                  </Text>
                </Pressable>
              )}
            />
          )}
        </View>
      )}
    />
  );

  const Infomation = ({ movie }) => {
    console.log("Infomation movie:", movie);

    return (
      <View style={styles.tabContent}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.contentInfomation}>
            <Text style={styles.contentthreeInformation}>Nội dung</Text>
            <Text style={{ color: "gray", marginTop: 10, lineHeight: 20 }}>
              Phim kể về một chàng trai trẻ tuổi, tài năng và nhiệt huyết, đang
              cố gắng tìm kiếm mục tiêu sống của mình. Anh đã phải đối mặt với
              nhiều khó khăn, thử thách và cả những người bạn không đáng tin
              cậy. Liệu anh có thể vượt qua tất cả để đạt được ước mơ của mình?
            </Text>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Xem tiếp</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.contentInfomation}>
            <Text style={styles.contentthreeInformation}>Diễn viên</Text>
            <View style={styles.actorList}>
              {movie.actors && movie.actors.length > 0 ? (
                movie.actors.map((actor) => (
                  <View key={actor.id} style={styles.actorItem}>
                    <Image
                      source={require("../img/user.png")} // Đặt ảnh mặc định cho diễn viên
                      style={styles.contentThreeImage}
                    />
                    <Text style={styles.contentThreeTextAcction}>
                      {actor.name}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={{ color: "gray" }}>Không có diễn viên</Text>
              )}
            </View>
          </View>
          <View style={styles.contentInfomation}>
            <Text style={styles.contentthreeInformation}>Đạo diễn</Text>
            <View style={styles.actorList}>
              {movie.producers && movie.producers.length > 0 ? (
                movie.producers.map((producers) => (
                  <View key={producers.id} style={styles.actorItem}>
                    <Image
                      source={require("../img/user.png")} // Đặt ảnh mặc định cho diễn viên
                      style={styles.contentThreeImage}
                    />
                    <Text style={styles.contentThreeTextAcction}>
                      {producers.name}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={{ color: "gray" }}>Không có đạo diễn</Text>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  };

  const New = () => (
    <View style={styles.tabContent}>
      <Image source={require("../img/flimicon.jpg")} style={styles.newImage} />
      <Text style={styles.noNewsText}>Hiện phim chưa có tin tức</Text>
    </View>
  );

  const renderScene = SceneMap({
    showtimes: Showtimes,
    infomation: () => <Infomation movie={movieDetails} />,
    new: New,
  });

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: "#0033CC" }}
      style={{ backgroundColor: "white" }}
      labelStyle={{ fontWeight: "bold", textAlign: "center" }}
      tabStyle={{ flex: 1, justifyContent: "center" }}
      renderLabel={({ route, focused }) => (
        <Text
          style={{
            color: focused ? "#0033CC" : "gray",
            fontSize: 16,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {route.title}
        </Text>
      )}
    />
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.contain}
    >
      <StatusBar />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.header}>
          <Image
            source={{ uri: movie.imagePortrait }}
            style={styles.movieImage}
          />
          <TouchableOpacity
            onPress={() => navigation.navigate("MainTabs")}
            style={styles.backLeft}
          >
            <AntDesign name="arrowleft" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          <Image
            source={require("../img/play.png")}
            style={styles.contentcenterImage}
          />
          <Image
            source={{ uri: movie.imagePortrait }}
            style={styles.movieImageAvata}
          />
          <Text style={styles.movieTitle}>{movie.title}</Text>

          <View style={{ flexDirection: "row" }}>
            <View style={styles.contentStar}>
              <Image
                source={require("../img/star.png")}
                style={styles.starImage}
              />
              <Text style={styles.starText}>{movie.rating}</Text>
            </View>
            <View style={styles.contentStartow}>
              <Image
                source={require("../img/editing.png")}
                style={styles.starImage}
              />
              <Text style={styles.starText}>Chấm điểm</Text>
            </View>
          </View>

          <View style={{ flexDirection: "row" }}>
            <View style={styles.contentStar1}>
              <TouchableOpacity style={styles.contentButtom}>
                <Text
                  style={{
                    color: "white",
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: 12,
                  }}
                >
                  {movie.age}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.contentStartow1}>
              <Image
                source={require("../img/time.png")}
                style={styles.starImage1}
              />
              <Text style={styles.starText1}>{movie.duration} phút</Text>
            </View>
            <View style={styles.contentTimeDate}>
              <Image
                source={require("../img/date.png")}
                style={styles.starImage1}
              />
              <Text style={styles.starText1}>
                {formatDate(movie.releaseDate)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.tabViewContainer}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: Dimensions.get("window").width }}
          renderTabBar={renderTabBar}
        />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Vị trí</Text>
          <FlatList
            data={provinces}
            keyExtractor={(item) => item}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={styles.provinceItem}
                onPress={() => handleSelectProvince(index)}
              >
                <View style={styles.radioButton}>
                  {selectedProvinceIndex === index ? (
                    <Icon name="circle" size={20} color="#0033CC" />
                  ) : (
                    <Icon name="circle-thin" size={20} color="#0033CC" />
                  )}
                </View>
                <Text style={styles.provinceText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
          <View style={styles.modalButton}>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.modalButtonClose}
            >
              <Text style={styles.modalButtonText}>Đóng</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleConfirm}
              style={styles.modalButtonClose}
            >
              <Text style={styles.modalButtonText}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  contain: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    backgroundColor: "white",
    flexDirection: "column",
    alignSelf: "flex-start",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 10,
    borderBottomColor: "lightgray",
    marginTop: -10,
  },
  movieImage: {
    width: "100%",
    height: "75%",
    resizeMode: "cover",
  },
  movieImageAvata: {
    width: 140,
    height: 170,
    resizeMode: "contain",
    borderRadius: 5,
    borderColor: "white",
    position: "absolute",
    left: 20,
    top: 200,
  },
  movieTitle: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    position: "absolute",
    left: 160,
    top: 200,
    right: 15,
    maxWidth: "70%",
    flexWrap: "wrap",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  backLeft: {
    position: "absolute",
    top: 40,
    left: 15,
  },
  contentcenterImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
    position: "absolute",
    top: 110,
    right: 180,
    resizeMode: "cover",
  },
  contentStar: {
    flexDirection: "row",
    position: "absolute",
    top: -35,
    left: 160,
    justifyContent: "center",
    alignItems: "center",
  },
  starImage: {
    width: 15,
    height: 15,
  },
  starText: {
    color: "black",
    paddingLeft: 6,
    fontWeight: "bold",
  },
  contentStartow: {
    flexDirection: "row",
    position: "absolute",
    top: -35,
    left: 230,
    justifyContent: "center",
    alignItems: "center",
  },
  contentStar1: {
    flexDirection: "row",
    position: "absolute",
    top: -70,
    marginTop: 20,
    left: 160,
    justifyContent: "center",
    alignItems: "center",
  },
  starImage1: {
    width: 15,
    height: 15,
  },
  starText1: {
    color: "gray",
    paddingLeft: 6,
    fontWeight: "bold",
  },
  contentStartow1: {
    flexDirection: "row",
    position: "absolute",
    top: -70,
    marginTop: 20,
    left: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  contentTimeDate: {
    flexDirection: "row",
    position: "absolute",
    top: -70,
    marginTop: 20,
    left: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  contentButtom: {
    backgroundColor: "#FF7F24",
    width: 30,
    height: 20,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "white",
    height: 30,
    borderRadius: 5,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#FF7F24",
    fontWeight: "bold",
  },
  tabContent: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 20,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  tabViewContainer: {
    flex: 1,
    marginTop: -120,
  },
  newImage: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
  },
  contentInfomation: {
    padding: 15,
    borderBottomWidth: 4,
    borderBottomColor: "#E8E8E8",
  },
  contentthreeInformation: {
    fontWeight: "bold",
    fontSize: 18,
  },
  actorList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  actorItem: {
    marginRight: 20,
    alignItems: "center",
  },
  contentThreeImage: {
    width: 70,
    height: 100,
    resizeMode: "contain",
  },
  contentThreeTextAcction: {
    color: "gray",
    marginTop: 10,
    lineHeight: 20,
    width: 70,
    textAlign: "center",
  },
  noNewsText: {
    fontSize: 15,
    textAlign: "center",
    marginTop: 10,
    color: "gray",
  },
  buttonNation: {
    backgroundColor: "white",
    height: 30,
    borderRadius: 5,
    marginTop: 10,
    justifyContent: "flex-start",
    alignItems: "center",
    width: 100,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: "#AAAAAA",
    flexDirection: "row",
    height: 50,
    width: 195,
  },
  buttonTextNation: {
    color: "gray",
    fontWeight: "bold",
    marginLeft: 10,
  },
  buttonIcon: {
    position: "absolute",
    right: 10,
  },

  modalView: {
    flex: 1,
    justifyContent: "center",
    width: "90%",
    left: "5%",
    bottom: "10%",
    top: "-3%",
    marginTop: 50,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  provinceItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
    width: "100%",
  },
  radioButton: {
    marginRight: 10,
  },
  provinceText: {
    fontSize: 18,
    textAlign: "left",
    flex: 1,
  },
  modalButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButtonClose: {
    backgroundColor: "#0033CC",
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
