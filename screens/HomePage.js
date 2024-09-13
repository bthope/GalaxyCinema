import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { images } from "../data/imageData"; // Adjust the path as needed
// import { moviesData } from '../data/movies';
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { imageDataFooter } from "../data/imageDataFooter";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width * 0.75;
const SIDE_ITEM_WIDTH = (width - ITEM_WIDTH) / 2;
const ITEM_WIDTH_CONTENT = width / 2;

const MovieItem = ({ item, navigation }) => (
  <TouchableOpacity
    onPress={() => navigation.navigate("TimeVenue", { movie: item })}
  >
    <View style={styles.movieItemContainer}>
      <Image source={{ uri: item.imagePortrait }} style={styles.movieImage} />
      <Text style={styles.movieTitle}>{item.title}</Text>
      <View style={styles.movieStarAge}>
        <View style={styles.ratingContainer}>
          <Image source={require("../img/star.png")} style={styles.starImage} />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
        <View style={styles.buttonContainerAge}>
          <TouchableOpacity style={styles.buttonTextAge}>
            <Text style={styles.movieAge}>{item.age}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

// Component để hiển thị danh sách phim đang chiếu
const NowShow = ({ navigation, movies }) => {
  const displayedMovies = movies.slice(0, 6); // Hiển thị 6 phim đầu

  return (
    <FlatList
      data={displayedMovies}
      renderItem={({ item }) => (
        <MovieItem item={item} navigation={navigation} />
      )}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
    />
  );
};
// Component để hiển thị danh sách phim sắp chiếu
const ComingSoon = ({ navigation, movies }) => {
  const displayedMovies = movies.slice(0, 6);

  return (
    <FlatList
      data={displayedMovies}
      renderItem={({ item }) => (
        <MovieItem item={item} navigation={navigation} />
      )}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
    />
  );
};

export default function HomePage({ navigation }) {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "nowShow", title: "Đang chiếu" },
    { key: "comingSoon", title: "Sắp chiếu" },
  ]);

  // Gọi API để lấy dữ liệu phim
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("http://192.168.1.8:8080/api/v1/movies");
        const result = await response.json();

        // Kiểm tra cấu trúc dữ liệu trả về
        if (result && result.data && result.data.content) {
          setMovies(result.data.content); // Lưu trữ danh sách phim từ API
        } else {
          console.error("Data structure not as expected:", result);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Phân loại phim thành "Đang chiếu" và "Sắp chiếu"
  const nowShowingMovies = movies.filter((movie) => movie.status === "ACTIVE");
  const comingSoonMovies = movies.filter((movie) => movie.status === "ACTIVE");

  // Hàm render scene cho TabView
  const renderScene = ({ route }) => {
    switch (route.key) {
      case "nowShow":
        return <NowShow navigation={navigation} movies={nowShowingMovies} />;
      case "comingSoon":
        return <ComingSoon navigation={navigation} movies={comingSoonMovies} />;
      default:
        return null;
    }
  };

  // Custom TabBar
  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: "#0033CC", height: 0 }} // Remove indicator
      style={{
        backgroundColor: "white",
        justifyContent: "flex-start",
        borderBottomWidth: 0,
      }} // Align tabs to the left and remove bottom border
      labelStyle={{ fontWeight: "bold", textAlign: "left", marginLeft: 16 }} // Align text to the left with some margin
      tabStyle={{ width: "auto" }} // Adjust tab width
      renderLabel={({ route, focused }) => (
        <Text
          style={{
            color: focused ? "#0033CC" : "gray",
            fontSize: 16,
            width: 100,
          }}
        >
          {route.title}
        </Text>
      )}
    />
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [footerIndex, setFooterIndex] = useState(0);
  const flatListRef = useRef(null);
  const footerFlatListRef = useRef(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % images.length;
        flatListRef.current?.scrollToIndex({
          animated: true,
          index: nextIndex,
        });
        return nextIndex;
      });
    }, 10000); // 10000ms = 10s

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setFooterIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % imageDataFooter.length;
        footerFlatListRef.current?.scrollToIndex({
          animated: true,
          index: nextIndex,
        });
        return nextIndex;
      });
    }, 10000); // 10000ms = 10s

    return () => clearInterval(intervalId);
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={item} style={styles.image} />
    </View>
  );

  const renderFooterItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.footerTitle}>{item.title}</Text>
    </View>
  );

  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / ITEM_WIDTH);
    setCurrentIndex(index);
  };

  const handleFooterScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / ITEM_WIDTH);
    setFooterIndex(index);
  };

  const getItemLayout = (data, index) => ({
    length: ITEM_WIDTH,
    offset: ITEM_WIDTH * index,
    index,
  });

  return (
    <FlatList
      ListHeaderComponent={
        <>
          <StatusBar />
          <FlatList
            ref={flatListRef}
            data={images}
            renderItem={renderItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToAlignment="start"
            snapToInterval={ITEM_WIDTH}
            decelerationRate="fast"
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ paddingHorizontal: SIDE_ITEM_WIDTH }}
            onScroll={handleScroll}
            getItemLayout={getItemLayout}
            onScrollToIndexFailed={(error) => {
              flatListRef.current?.scrollToOffset({
                offset: error.averageItemLength * error.index,
                animated: true,
              });
            }}
          />
          <View style={styles.indicatorContainer}>
            {images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  currentIndex === index
                    ? styles.activeIndicator
                    : styles.inactiveIndicator,
                ]}
              />
            ))}
          </View>

          <View style={styles.tabContent}>
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: Dimensions.get("window").width }}
                renderTabBar={renderTabBar}
              />
            )}
          </View>

          <View style={{ flex: 10, top: 10 }}>
            <TouchableOpacity
              style={{
                borderColor: "#FF7F24",
                borderWidth: 2,
                width: "95%",
                height: 40,
                borderRadius: 5,
                alignSelf: "center",
                flex: 1,
              }}
            >
              <Text
                style={{ color: "#FF7F24", textAlign: "center", marginTop: 5 }}
              >
                Xem Tiếp
              </Text>
              <Image
                source={require("../img/next_cam.png")}
                style={{
                  width: 15,
                  height: 10,
                  position: "absolute",
                  right: 145,
                  top: 12,
                }}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              borderBottomWidth: 4,
              marginTop: 50,
              borderBottomColor: "gainsboro",
            }}
          ></View>
        </>
      }
      ListFooterComponent={
        <View style={{ width: "100%", height: 340, top: 20 }}>
          <FlatList
            ref={footerFlatListRef}
            data={imageDataFooter}
            renderItem={renderFooterItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToAlignment="start"
            snapToInterval={ITEM_WIDTH}
            decelerationRate="fast"
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingHorizontal: SIDE_ITEM_WIDTH }}
            onScroll={handleFooterScroll}
            getItemLayout={getItemLayout}
            onScrollToIndexFailed={(error) => {
              footerFlatListRef.current?.scrollToOffset({
                offset: error.averageItemLength * error.index,
                animated: true,
              });
            }}
          />
        </View>
      }
      style={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 35,
  },
  itemContainer: {
    width: ITEM_WIDTH,
    marginHorizontal: SIDE_ITEM_WIDTH / 27,
    padding: 15,
  },
  image: {
    width: "105%",
    height: 200,
    borderRadius: 5,
  },
  footerTitle: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "bold",
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeIndicator: {
    backgroundColor: "blue",
  },
  inactiveIndicator: {
    backgroundColor: "gainsboro",
  },
  tabContent: {
    flex: 1,
    backgroundColor: "white",
    width: "100%",
    alignContent: "center",
  },
  movieItemContainer: {
    width: ITEM_WIDTH_CONTENT,
    padding: 12,
  },
  movieImage: {
    width: "100%",
    height: 250,
    borderRadius: 5,
  },
  movieTitle: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "bold",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    gap: 2,
    paddingHorizontal: 4,
    height: 40,
  },
  starImage: {
    width: 16,
    height: 16,
    marginRight: 8,
    marginLeft: 12,
  },
  ratingText: {
    fontSize: 17,
    fontWeight: "bold",
    marginRight: 8,
    color: "white",
  },
  buttonContainerAge: {
    position: "absolute",
    bottom: -40,
    right: 10,
    padding: 2,
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
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    width: 30,
  },
  movieStarAge: {
    position: "absolute",
    bottom: 90,
    right: 10,
    padding: 2,
    color: "white",
  },
  movieAge: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});
