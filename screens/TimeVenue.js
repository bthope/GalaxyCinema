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
import HorizontalDatepicker from "@awrminkhodaei/react-native-horizontal-datepicker";
import axios from "axios"; // Import axios here
import { API_GetMovieSlug, API_GetCinema } from "../api/Api";
import YoutubePlayer from "react-native-youtube-iframe";

export default function TimeVenue({ route, navigation }) {
  const { movie } = route.params;
  console.log("Movie received:", movie);

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "showtimes", title: "Lịch chiếu" },
    { key: "infomation", title: "Thông tin" },
    { key: "new", title: "Tin tức" },
  ]);

  const [selectedCity, setSelectedCity] = useState(null); // Lưu thành phố đã chọn
  const [selectedAddress, setSelectedAddress] = useState(null); // Lưu địa chỉ đã chọn
  const [filteredAddresses, setFilteredAddresses] = useState([]); // Lưu địa chỉ theo thành phố
  const [modalVisible, setModalVisible] = useState(false); // Hiển thị modal chọn thành phố
  const [modalAddressVisible, setModalAddressVisible] = useState(false); // Hiển thị modal chọn địa chỉ

  const [movieDetails, setMovieDetails] = useState({
    actors: [],
    directors: [],
    producers: [],
  });

  const [modalVisibleTrailer, setModalVisibleTrailer] = useState(false);
  const [cinemas, setCinemas] = useState([]);
  const [selectedProvinceIndex, setSelectedProvinceIndex] = useState(null); // Khai báo state cho chỉ mục địa chỉ đã chọn
  const [selectedDate, setSelectedDate] = useState(new Date()); // Khai báo state cho ngày đã chọn
  const [showtimes, setShowtimes] = useState([]); // Khai báo state cho lịch chiếu
  // Function to format date in Vietnamese
  const formatDateInVietnamese = (date) => {
    return date.toLocaleDateString("vi-VN", {
      weekday: "long", // Hiển thị thứ
      day: "numeric", // Hiển thị ngày
      month: "numeric", // Hiển thị tháng
    });
  };
  // Function to handle date change
  const handleDateChange = (date) => {
    setSelectedDate(date); // Cập nhật ngày đã chọn
    console.log(formatDateInVietnamese(date)); // Log ngày tháng tiếng Việt để kiểm tra
  };

  // Tính toán endDate là một tuần sau ngày hiện tại
  const currentDate = new Date();
  const oneWeekLater = new Date(currentDate);
  oneWeekLater.setDate(currentDate.getDate() + 7);

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
          // `http://192.168.1.155:8080/api/v1/movies/${movie.slug}`
          API_GetMovieSlug + movie.slug
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

  // Lấy ra dữ liệu trailer từ API trong movieDetails
  const trailer = movieDetails.trailer;
  // Lấy ra ID video YouTube từ URL trailer
  const trailerId = trailer ? trailer.split("v=")[1]?.split("&")[0] : null;

  // Hiển thị modal trailer
  const handleOpenTrailer = () => {
    if (trailer) {
      setModalVisibleTrailer(true);
    } else {
      alert("Phim này không có trailer");
    }
  };

  // Đóng modal trailer
  const handleCloseTrailer = () => {
    setModalVisibleTrailer(false);
  };

  // Fetch API cinemas
  useEffect(() => {
    const fetchCinemas = async () => {
      try {
        const response = await axios.get(API_GetCinema);
        if (response.data.code === 200) {
          setCinemas(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching cinemas:", error);
      }
    };
    fetchCinemas();
  }, []);

  // Hiển thị cinema với dữ liệu là city.name
  const city = cinemas.map((cinema) => cinema.city.name);
  console.log("Thành phố:", city);

  // Hiển thị cinema với dữ liệu là address có tên name
  const address = cinemas.map((cinema) => cinema.name);
  console.log("Địa chỉ:", address);

  // Lấy danh sách các thành phố duy nhất
  const uniqueCities = [...new Set(cinemas.map((cinema) => cinema.city.name))];
  console.log("Unique Cities:", uniqueCities);

  // Xử lý chọn tỉnh thành phố và hiển thị trên modal city
  const handleSelectCity = (index) => {
    const cityName = uniqueCities[index]; // Lấy tên thành phố duy nhất
    setSelectedCity(cityName); // Cập nhật thành phố đã chọn

    // Lọc địa chỉ thuộc thành phố đã chọn
    const addressesForCity = cinemas.filter(
      (cinema) => cinema.city.name === cityName
    );
    setFilteredAddresses(addressesForCity); // Cập nhật địa chỉ tương ứng
    // setModalVisible(false); // Đóng modal thành phố
  };

  // Hiển thị movieId của movieDetails
  console.log("Movie ID:", movieDetails.id);
  // Hiển thị id theo name của rạp phim
  const cinemaIdflim = cinemas.find(
    (cinema) => cinema.name === selectedAddress
  )?.id;
  console.log("Cinema ID:", cinemaIdflim);

  // Hiển thị ngày đã chọn selectedDate định dạng theo "năm-tháng-ngày"
  const selectedDateFormatted = selectedDate.toISOString().split("T")[0];
  console.log("Selected Date:", selectedDateFormatted);

  // Fetch API showtimes
  useEffect(() => {
    const fetchShowtimes = async () => {
      // Kiểm tra sự tồn tại của movieId và cinemaId trước khi gọi API
      if (movieDetails?.id) {
        const movieId = movieDetails.id;
        const date = selectedDateFormatted;
        const cinemaId = cinemaIdflim;

        try {
          let response;
          if (date && cinemaId) {
            // Gọi API khi có đủ movieId, date và cinemaId
            response = await axios.get(
              `http://192.168.1.7:8080/api/v1/show-times?movieId=${movieId}&date=${date}&cinemaId=${cinemaId}`
            );
          } else {
            // Gọi API chỉ với movieId nếu thiếu date hoặc cinemaId
            response = await axios.get(
              `http://192.168.1.7:8080/api/v1/show-times?movieId=${movieId}`
            );
          }

          // Kiểm tra dữ liệu trả về
          if (response.data.data) {
            setShowtimes(response.data.data); // Lưu dữ liệu showtimes
          } else {
            console.warn("Không có dữ liệu showtimes");
            setShowtimes([]); // Xóa dữ liệu showtimes cũ nếu không có kết quả
          }
        } catch (error) {
          console.error("Error fetching showtimes:", error);
        }
      }
    };

    fetchShowtimes(); // Gọi hàm fetchShowtimes khi các dependency thay đổi
  }, [movieDetails, selectedDateFormatted, cinemaIdflim]); // Thêm các dependency để theo dõi

  // Hiển thị showtimes
  console.log("Showtimes:", showtimes);

  const handleConfirm = () => {
    if (selectedAddress) {
      // Thực hiện các thao tác với địa chỉ đã chọn
      setModalAddressVisible(false); // Đóng modal sau khi xác nhận
    } else {
      alert("Vui lòng chọn địa chỉ trước.");
    }
  };

  const handleConfirmCity = () => {
    if (selectedCity) {
      // Thực hiện các thao tác với thành phố đã chọn
      setModalVisible(false); // Đóng modal sau khi xác nhận
    }
  };

  const groupedShowtimes = showtimes.reduce((acc, showtime) => {
    const cinemaName = showtime.cinemaName;
    const roomName = showtime.room.name; // Lấy tên phòng chiếu

    // Nếu rạp chưa có, khởi tạo
    if (!acc[cinemaName]) {
      acc[cinemaName] = {};
    }

    // Nếu phòng chiếu chưa có, khởi tạo
    if (!acc[cinemaName][roomName]) {
      acc[cinemaName][roomName] = [];
    }

    // Thêm giờ chiếu vào phòng chiếu tương ứng
    acc[cinemaName][roomName].push(showtime);

    return acc;
  }, {});

  // State để lưu phòng đang được chọn
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Hàm chia nhỏ mảng thành các nhóm (6 phần tử mỗi nhóm)
  const chunkArray = (array, chunkSize) => {
    const result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }
    return result;
  };

  const Showtimes = () => (
    <FlatList
      keyExtractor={(item) => item.name}
      ListHeaderComponent={() => (
        <View>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={styles.buttonNation}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.buttonTextNation}>
                {selectedCity ? selectedCity : "Thành phố"}
              </Text>
              <Icon1
                name="caretdown"
                size={12}
                color="gray"
                style={styles.buttonIcon}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonNation}
              onPress={() => {
                if (selectedCity) {
                  setModalAddressVisible(true); // Mở modal địa chỉ nếu đã chọn thành phố
                } else {
                  alert("Vui lòng chọn thành phố trước."); // Cảnh báo nếu chưa chọn thành phố
                }
              }}
            >
              <Text style={styles.buttonTextNation}>
                {selectedAddress ? selectedAddress : "Rạp phim"}
              </Text>
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
            startDate={currentDate} // Ngày bắt đầu là ngày hiện tại
            endDate={oneWeekLater} // Ngày kết thúc là một tuần sau
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

          {/* Hiển thị danh sách các rạp */}

          {Object.keys(groupedShowtimes).map((cinemaName) => (
            <View key={cinemaName} style={styles.cinemaRowContainer}>
              {/* Bên trái: Hiển thị tên rạp */}
              <View style={styles.cinemaNameContainer}>
                <TouchableOpacity
                  onPress={() =>
                    setSelectedCinema(
                      selectedCinema === cinemaName ? null : cinemaName
                    )
                  } // Nhấn vào để chọn hoặc bỏ chọn rạp
                  style={styles.cinemaButton}
                >
                  <Text style={styles.cinemaText}>{cinemaName}</Text>
                </TouchableOpacity>
              </View>

              {/* Bên phải: Hiển thị danh sách phòng chiếu và giờ chiếu khi nhấn vào rạp */}
              {selectedCinema === cinemaName && (
                <View style={styles.showtimeContainer}>
                  {Object.keys(groupedShowtimes[cinemaName]).map((roomName) => (
                    <View key={roomName} style={styles.roomContainer}>
                      {/* Hiển thị tên phòng chiếu */}
                      <TouchableOpacity
                        onPress={() =>
                          setSelectedRoom(
                            selectedRoom === roomName ? null : roomName
                          )
                        } // Nhấn vào để chọn hoặc bỏ chọn phòng
                        style={styles.roomButton}
                      >
                        <Text style={styles.roomText}>{roomName}</Text>
                      </TouchableOpacity>

                      {/* Hiển thị danh sách giờ chiếu khi nhấn vào phòng */}
                      {selectedRoom === roomName && (
                        <FlatList
                          data={chunkArray(
                            groupedShowtimes[cinemaName][roomName],
                            6
                          )} // Chia thành nhóm 6 giờ chiếu
                          keyExtractor={(item, index) =>
                            `${cinemaName}-${roomName}-${index}`
                          }
                          renderItem={({ item }) => (
                            <View style={styles.rowContainer}>
                              {item.map((showtime) => (
                                <TouchableOpacity
                                  key={showtime.id}
                                  style={styles.showtimeButton}
                                  onPress={() =>
                                    navigation.navigate("Theatre", {
                                      showtimeId: showtime.id,                                   
                                      movieTitle: movie.title,
                                      cinemaName: cinemaName,
                                      // Tên phòng chiếu
                                      roomName: roomName,
                                      room: showtime.room.id,
                                      // Thêm giờ chiếu đã chọn vào props chỉ hiển 
                                      startTime: showtime.startTime,
                                      // THêm endTime
                                      endTime: showtime.endTime,
                                      // Thêm hình ảnh phim
                                      movieImage: movie.imagePortrait,
                                      // Hiển thị age
                                      age: movie.age,
                                      //   selectedDateFormatted
                                      selectedDate: selectedDateFormatted,
                                   
                                                      
                                    })
                                  }
                                  
                                >
                                  {/* Hiển thị giờ chiếu */}
                                  <Text style={styles.showtimeText}>
                                    {showtime.startTime.substring(0, 5)}{" "}
                                    {/* Giờ và phút */}
                                  </Text>
                                </TouchableOpacity>
                              ))}
                            </View>
                          )}
                        />
                      )}
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
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
              {movie.summary}
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
          <Pressable
            onPress={handleOpenTrailer}
            style={styles.contentPressablecenterImage}
          >
            <Image
              source={require("../img/play.png")}
              style={{ width: 50, height: 50, resizeMode: "contain" }}
            />
          </Pressable>

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
                  T{movie.age}
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

      {/* Modal chọn thành phố */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Chọn thành phố</Text>
          <FlatList
            data={[...new Set(city)]} // Chỉ lấy các thành phố duy nhất
            keyExtractor={(item) => item}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={styles.provinceItem}
                onPress={() => {
                  handleSelectCity(index); // Cập nhật thành phố đã chọn
                  setSelectedProvinceIndex(index); // Cập nhật index đã chọn để hiển thị radio button
                }}
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
          <View style={styles.modalButtons}>
            <TouchableOpacity
              onPress={() => setModalVisible(false)} // Đóng modal
              style={styles.modalButtonCloses}
            >
              <Text style={styles.modalButtonTexts}>Đóng</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButtonCloses}
              onPress={handleConfirmCity} // Gọi hàm xác nhận khi nhấn nút
            >
              <Text style={styles.modalButtonTexts}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal chọn rạp phim */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalAddressVisible}
        onRequestClose={() => {
          setModalAddressVisible(!modalAddressVisible);
        }}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Chọn Rạp Phim</Text>
          <FlatList
            data={cinemas.filter((cinema) => cinema.city.name === selectedCity)} // Lọc địa chỉ theo thành phố đã chọn
            keyExtractor={(item) => item.name}
            renderItem={(
              { item, index } // Thêm index vào tham số destructuring
            ) => (
              <TouchableOpacity
                style={styles.provinceItem}
                onPress={() => {
                  setSelectedAddress(item.name); // Cập nhật địa chỉ đã chọn
                  setSelectedProvinceIndex(index); // Cập nhật index đã chọn để hiển thị radio button
                }}
              >
                <View style={styles.radioButton}>
                  {selectedProvinceIndex === index ? (
                    <Icon name="circle" size={20} color="#0033CC" />
                  ) : (
                    <Icon name="circle-thin" size={20} color="#0033CC" />
                  )}
                </View>
                <Text style={styles.provinceText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity
              onPress={() => setModalAddressVisible(false)} // Đóng modal địa chỉ
              style={styles.modalButtonCloses}
            >
              <Text style={styles.modalButtonTexts}>Đóng</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleConfirm} // Gọi hàm xác nhận khi nhấn nút
              style={styles.modalButtonCloses}
            >
              <Text style={styles.modalButtonTexts}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal để hiển thị trailer */}
      <Modal
        visible={modalVisibleTrailer}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalTrailer}>
          <View style={styles.modalContent}>
            <Pressable
              onPress={handleCloseTrailer}
              style={styles.modalButtonClose}
            >
              <Icon name="times" size={20} color="white" />
            </Pressable>
            <YoutubePlayer
              height={600}
              width={400}
              play={true}
              videoId={trailerId} // ID của video YouTube
              style={styles.modalVideoTrailer} // Style của video trailer
            />
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
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end", // Đặt các nút ở phía bên phải
    alignItems: "center", // Căn giữa các nút theo chiều dọc
    marginTop: 20,
  },
  modalButtonCloses: {
    backgroundColor: "#0033CC", // Màu nền xanh
    padding: 10,
    borderRadius: 5,
    width: 100, // Đặt chiều rộng của nút
    marginLeft: 10, // Khoảng cách giữa các nút
  },
  modalButtonTexts: {
    color: "white", // Đặt màu chữ là trắng để nổi bật trên nền xanh
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  contentPressablecenterImage: {
    position: "absolute",
    top: 120,
    left: 180,
  },
  modalTrailer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalVideoTrailer: {
    width: "90%",
    height: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    position: "relative",
    width: "100%", // Đặt chiều rộng video đầy modal
    height: "100%", // Đặt chiều cao video đầy modal
  },
  modalButtonClose: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  cinemaButton: {
    padding: 10,
    backgroundColor: "white",
    borderBottomColor: "#ccc",
  },
  cinemaText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  rowContainer: {
    flexDirection: "row",
    flexWrap: "wrap", // Cho phép các button xuống dòng
    justifyContent: "flex-start",
  },
  showtimeButton: {
    padding: 10,
    margin: 5,
    backgroundColor: "#0000DD",
    color: "white",
    borderRadius: 5,
    width: "20%", // Mỗi button chiếm khoảng 15% chiều ngang
    alignItems: "center",
    height: 40,
    // hover màu xanh dương khi click vào
  },
  showtimeText: {
    fontSize: 14,
    color: "white",
  },
  roomText: {
    fontSize: 16,
    color: "#555",
    fontWeight: "bold",
    left: 10,
  },
  roomContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});
