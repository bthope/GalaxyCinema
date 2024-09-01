import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform, KeyboardAvoidingView, FlatList, Image, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Icon from "react-native-vector-icons/FontAwesome"; 
import { commentsData } from '../data/comment'; // Adjust the import path as needed
import { newsData } from '../data/news';
import { figuresData } from '../data/figures';

const Comments = () => (
  <View style={styles.tabContent}>
    <FlatList
      data={commentsData}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.commentItem}>
          <Image source={item.image} style={styles.commentImage} />
          <View style={styles.commentTextContainer}>
            <Text style={styles.commentTitle}>{item.title}</Text>
            <Text style={styles.readMore}>Đọc thêm</Text>
          </View>
        </View>
      )}
    />
  </View>
);

const News = () => (
  <View style={styles.tabContent}>
    <FlatList
      data={newsData}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.commentItem}>
          <Image source={item.image} style={styles.commentImage} />
          <View style={styles.commentTextContainer}>
            <Text style={styles.commentTitle}>{item.title}</Text>
            <Text style={styles.readMore}>Đọc thêm</Text>
          </View>
        </View>
      )}
    />
  </View>
);

const Characters = () => (
  <View style={styles.tabContent}>
    <FlatList
      data={figuresData}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.commentItem}>
          <Image source={item.image} style={styles.commentImage} />
          <View style={styles.commentTextContainer}>
            <Text style={styles.commentTitle}>{item.title}</Text>
            <Text style={styles.commentContent}>{item.content}</Text>
            <Text style={styles.readMore}>Đọc thêm</Text>
          </View>
        </View>
      )}
    />
  </View>
);

export default function Cinematography({ navigation }) {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'comments', title: 'Bình luận' },
    { key: 'news', title: 'Tin tức' },
    { key: 'characters', title: 'Nhân vật' },
  ]);

  const renderScene = SceneMap({
    comments: Comments,
    news: News,
    characters: Characters,
  });

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: '#0033CC' }}
      style={{ backgroundColor: 'white' }}
      labelStyle={{ fontWeight: 'bold', textAlign: 'center' }}
      tabStyle={{ flex: 1, justifyContent: 'center' }} // Center tab content
      renderLabel={({ route, focused }) => (
        <Text style={{ color: focused ? '#0033CC' : 'gray', fontSize: 16, width: 78 }}>
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
        <Text style={styles.headerText}>Điện Ảnh</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Setting")}>
          <Icon name="search" size={25} color="#0033CC" />
        </TouchableOpacity>
      </View>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get('window').width }}
        renderTabBar={renderTabBar}
        style={styles.tabContent}
      />
      
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  contain: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 35,
  },
  header: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignSelf: 'flex-start',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD',
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'black',
  },
  tabContent: {
    flex: 1,
    backgroundColor: '#DDDDDD',
  },
  commentItem: {
    marginBottom: 20,
    borderBottomWidth: 2,
    backgroundColor: 'white',
    borderBottomColor: '#DDDDDD',
    paddingBottom: 10,
    alignItems: 'flex-start', // Center items horizontally
    marginHorizontal: 23, // Add some margin to the sides of the item
    top: 20,
  },
  commentImage: {
    width: '100%',
    height: 270,
    marginBottom: 10, // Add some margin below the image
    resizeMode: 'cover', // Make sure the image covers the area
  },
  commentTextContainer: {
    alignItems: 'flex-start', // Center text container horizontally
    paddingHorizontal: 10, // Add padding for text content
  },
  commentTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'left', // Center text
    marginBottom: 5, // Add some margin below the title
  },
  readMore: {
    color: 'orange',
    textAlign: 'left',
    fontWeight: 'bold',
  },
  commentContent: {
    marginBottom: 8,
  },
});
