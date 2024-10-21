import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Platform,
    KeyboardAvoidingView,
    Image,
    FlatList,
    ActivityIndicator,
    Dimensions,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import { AntDesign } from "@expo/vector-icons";
  import { StatusBar } from "expo-status-bar";
  import { TabView, TabBar } from "react-native-tab-view";
  import { API_GetMovies } from "../api/Api";
  import { LogBox } from "react-native"; // Import LogBox

  LogBox.ignoreLogs(["VirtualizedList: Encountered an error while measuring a list's offset from its containing VirtualizedList."]);
  
  const screenWidth = Dimensions.get("window").width;
  
  const MovieCard = ({ item, navigation }) => {
    const handleMoviePress = () => {
      navigation.navigate("TimeVenue", { movie: item });
    };
  
    return (
      <TouchableOpacity onPress={handleMoviePress} style={styles.movieItemWrapper}>
        <View style={styles.movieItemContainer}>
          <View style={styles.ImageHinder}>
            <Image source={{ uri: item.imagePortrait }} style={styles.movieImage} />
          </View>
          <Text style={styles.movieTitle}>{item.title}</Text>
          <View style={styles.movieStarAge}>
            <View style={styles.ratingContainer}>
              <Image source={require("../img/star.png")} style={styles.starImage} />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
            <View style={styles.buttonContainerAge}>
              <TouchableOpacity style={styles.buttonTextAge}>
                <Text style={styles.movieAge}>T{item.age}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  
  const RenderNowShowing = ({ navigation, movies }) => {
    if (!movies.length) {
      return <Text>No movies available</Text>;
    }
  
    return (
      <FlatList
        data={movies}
        renderItem={({ item }) => <MovieCard item={item} navigation={navigation} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={{ paddingBottom: 100 }}
        removeClippedSubviews={false}
        getItemLayout={(data, index) => ({
          length: 250,
          offset: 250 * index,
          index,
        })}
      />
    );
  };
  
  const RenderComingSoon = ({ navigation, movies }) => {
    if (!movies.length) {
      return <Text>No movies available</Text>;
    }
  
    return (
      <FlatList
        data={movies}
        renderItem={({ item }) => <MovieCard item={item} navigation={navigation} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={{ paddingBottom: 100 }}
        removeClippedSubviews={false}
        getItemLayout={(data, index) => ({
          length: 250,
          offset: 250 * index,
          index,
        })}
      />
    );
  };
  
  export default function MovieDetail({ navigation }) {
    const [index, setIndex] = useState(0);
    const [routes] = useState([
      { key: "nowShow", title: "Đang chiếu" },
      { key: "comingSoon", title: "Sắp chiếu" },
    ]);
  
    const [moviesDetail, setMoviesDetail] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchMovies = async () => {
        setLoading(true);
        try {
          const response = await fetch(API_GetMovies);
          const result = await response.json();
  
          // Ensure the result's structure is correct before updating state
          if (result?.data?.content) {
            setMoviesDetail(result.data.content); 
          } else {
            console.error("Unexpected data structure:", result);
          }
        } catch (error) {
          console.error("Error fetching movies:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchMovies();
    }, []); // Empty dependency array to only run once on mount
  
    const nowShowingMovies = moviesDetail.filter((movie) => movie.status === "ACTIVE");
    const comingSoonMovies = moviesDetail.filter((movie) => movie.status !== "ACTIVE");
  
    const displayTabContent = ({ route }) => {
      switch (route.key) {
        case "nowShow":
          return <RenderNowShowing navigation={navigation} movies={nowShowingMovies} />;
        case "comingSoon":
          return <RenderComingSoon navigation={navigation} movies={comingSoonMovies} />;
        default:
          return null;
      }
    };
  
    const renderTabBar = (props) => (
      <TabBar
        {...props}
        indicatorStyle={{ backgroundColor: "#0033CC", height: 0 }}
        style={{
          backgroundColor: "white",
          justifyContent: "flex-start",
          borderBottomWidth: 0,
        }}
        labelStyle={{ fontWeight: "bold", textAlign: "left", marginLeft: 16 }}
        tabStyle={{ width: "auto" }}
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
        </View>
  
        <View style={styles.tabContent}>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <TabView
              navigationState={{ index, routes }}
              renderScene={displayTabContent}
              onIndexChange={setIndex}
              initialLayout={{ width: screenWidth }}
              renderTabBar={renderTabBar}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    );
  }
  
  
  const styles = StyleSheet.create({
    contain: {
      flex: 1,
      backgroundColor: "white",
      paddingTop: 45,
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
    tabContent: {
      flex: 1,
      backgroundColor: "white",
      width: "100%",
      alignContent: "center",
    },
    movieItemWrapper: {
      flex: 1,
      padding: 8,
    },
    movieItemContainer: {
      backgroundColor: "white",
      borderRadius: 5,
      overflow: "hidden",
      width: screenWidth / 2 - 24,
      top: 20,
    },
    ImageHinder: {
        width: "100%",
        height: 250, // Fixed height for the container
        borderRadius: 5,
        overflow: "hidden",
    },
    movieImage: {
      width: "100%",
      height: "100%",
      borderRadius: 5,
      resizeMode: "cover",
    },
    movieTitle: {
      marginTop: 10,
      fontSize: 12,
      fontWeight: "bold",
      textAlign: "left",
      width: "100%",
      // Không bị xuống dòng
      overflow: "hidden",    
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
    movieAge: {
      color: "white",
      fontSize: 14,
      fontWeight: "bold",
    },
    movieStarAge: {
      position: "absolute",
      bottom: 90,
      right: -2,
      padding: 2,
      color: "white",
    },
  });
  