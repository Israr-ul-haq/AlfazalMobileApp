import React, { memo, useEffect, useRef, useState, useContext } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  TextInput,
  Text,
  BackHandler,
  Button,
  StatusBar,
} from "react-native";
import Header from "../Helpers/Header";
import CustomText from "../Helpers/CustomText";
import CategorySlider from "../Helpers/CategorySlider";
import CardTag from "../Helpers/Card";
import { ArrowMenu, Search } from "../Helpers/SVGs";
import { get, getCategories } from "../Services/ProdunctsService";
import { ActivityIndicator } from "react-native-paper";
import { Animated } from "react-native";
import { TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import SkeletonPlaceholder from "../Helpers/SkeletonLoaders";
import AppContext from "../Helpers/UseContextStorage";
import CakeImage from "../assets/icons8-birthday-cake.gif";
import { Image } from "react-native";

function Home() {
  const [showDropdown, setShowDropdown] = useState(false);

  const { user, data, setData } = useContext(AppContext);
  const rotationAngle = useState(new Animated.Value(0))[0];
  const initialScrollPosition = useRef(0);
  const [isHasNext, setIsHasNext] = useState();

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
    Animated.timing(rotationAngle, {
      toValue: showDropdown ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const rotateArrow = rotationAngle.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "90deg"],
  });

  const [loader, setLoader] = useState(false);
  const [searchLoader, setSearchLoader] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [categoryData, setCategoryData] = useState();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState();
  const scrollViewRef = useRef(null);
  const handleScroll = (event) => {
    initialScrollPosition.current = event.nativeEvent.contentOffset.y;
  };

  useEffect(() => {
    scrollViewRef.current.scrollTo({
      y: initialScrollPosition.current,
      animated: false,
    });

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        // Do nothing when the user is on the Home screen (or the desired logged-in screen)
        // You can add logic here to prompt the user to log out, if needed.
        return true; // Return true to prevent the default back button behavior
      }
    );

    return () => {
      backHandler.remove(); // Clean up the event listener when the component unmounts
    };
  }, []); // Scroll to the initial position when the component mounts

  useFocusEffect(
    React.useCallback(() => {
      getData();
    }, [])
  );
  const getData = async () => {
    setSearchLoader(true);
    try {
      const response = await get(pageNumber, 20, "", user && user?._id);
      const categoryResponse = await getCategories(null, null, "");
      const newData = response.data.data;
      if (response.status === 200) {
        setData(newData);
        setIsHasNext(response.data.hasNextPage);
        setSearchLoader(false);
      } else {
        setSearchLoader(false);
      }

      if (categoryResponse.status === 200) {
        const allCategory = { id: "1", Name: "All" }; // Creating a new category object
        const categoriesWithAll = [allCategory, ...categoryResponse.data.data]; // Adding the new category to the list

        setCategoryData(categoriesWithAll);
        setActiveCategory(allCategory); // Set the selected category to "All"
        setSearchLoader(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setSearchLoader(false);
    }
  };

  const handleLoadMore = async (scrollPosition) => {
    setLoader(true);
    setPageNumber((prevPageNumber) => prevPageNumber + 1);

    try {
      const response = await get(pageNumber + 1, 20, search);
      const newData = response.data.data;

      setData((prevData) => [...prevData, ...newData]);

      setLoader(false);
      scrollViewRef.current.scrollTo({ y: scrollPosition, animated: false });
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoader(false);
    }
  };

  const searchInput = async (search) => {
    setSearchLoader(true);
    setSearch(search);
    try {
      const response = await get(1, 10, search, user._id);
      if (response.status === 200) {
        setData(response.data.data);
        setSearchLoader(false);
      } else {
        setSearchLoader(false);
      }
    } catch (error) {
      console.log(error);
      setSearchLoader(false);
    }
  };

  const CardMemo = memo(CardTag);

  const handleCategoryChange = async (category) => {
    console.log(category);
    setSearchLoader(true);
    try {
      const response = await get(
        1,
        20,
        category.id === "1" ? "" : category._id,
        user && user?._id
      );

      console.log(response);
      if (response.status === 200) {
        setData(response.data.data);
        setActiveCategory(category);

        setSearchLoader(false);
      } else {
        setSearchLoader(false);
      }
    } catch (error) {
      console.log(error);
      setSearchLoader(false);
    }
  };

  return (
    <ImageBackground
      style={styles.background}
      source={require("../assets/backgroundImage.png")}
    >
      <Header text={"Home"} />

      <View style={styles.main_contains}>
        {/* <TouchableOpacity onPress={toggleDropdown}> */}
        <View style={styles.text_contain}>
          <View style={styles.category_slider}>
            <CustomText style={styles.category_main_text} bold={true}>
              Categories
            </CustomText>
          </View>
          {/* <Animated.View
            style={[
              styles.arrowContainer,
              { transform: [{ rotate: rotateArrow }] },
            ]}
          >
            <ArrowMenu />
          </Animated.View> */}
        </View>
        {/* {showDropdown && ( */}
        <CategorySlider
          categories={categoryData}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          handleCategoryChange={handleCategoryChange}
        />
        {/* )} */}
        {/* </TouchableOpacity> */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            onChangeText={searchInput}
            placeholder="Search"
            autoCapitalize="none"
            autoCorrect={false}
            placeholderTextColor="#C43E1A"
          />
          <View style={styles.border_contains}>
            <View style={styles.verticalBorder} />
            <View style={styles.search}>
              <Search />
            </View>
          </View>
        </View>
      </View>

      <View style={styles.scroller_flatlist}>
        <ScrollView
          style={styles.scrollView}
          scrollEventThrottle={16}
          ref={scrollViewRef}
          onScroll={handleScroll}
        >
          <View style={styles.card_container}>
            {searchLoader ? (
              <SkeletonPlaceholder />
            ) : data?.length === 0 ? (
              <>
                <Text style={styles.buttonText}>No product found</Text>
              </>
            ) : (
              data?.map((item, index) => {
                return (
                  <CardMemo
                    data={item}
                    key={`card_${index}`}
                    setData={setData}
                  />
                );
              })
            )}
          </View>
          {loader &&
            data?.length > 0 && ( // Show loader only when data is populated
              <View style={styles.load_contains}>
                <ActivityIndicator size="large" color="red" />
              </View>
            )}

          {isHasNext && !loader && (
            <View style={styles.load_contains}>
              <TouchableOpacity
                style={styles.load_section}
                onPress={() => handleLoadMore(initialScrollPosition.current)}
              >
                <CustomText style={styles.handle_loadmore}>
                  Load More
                </CustomText>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
      {/* 
      <View style={styles.gif_cakeImage_contains}>
        <View style={styles.gif_cake_back}>
          <Image source={CakeImage} style={styles.gif_cakeImage} />
        </View>
      </View> */}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  load_contains: {
    width: "100%",
    justifyContent: "center",
    verticalAlign: "middle",
    alignItems: "center",
  },

  gif_cakeImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  gif_cake_back: {
    position: "absolute",
    bottom: 80,
    right: 30,
    borderWidth: 1,
    borderColor: "red",
    borderStyle: "dashed",
  },

  gif_cakeImage_contains: {
    position: "relative",
  },

  background: {
    flex: 1,
    backgroundColor: "white",
  },

  buttonText: {
    textAlign: "center",
    alignItems: "center",
    width: "100%",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },

  scroller_flatlist: {
    flex: 1,
    paddingBottom: 80, // Add the desired padding at the bottom
  },

  HeaderText: {
    fontSize: 20,
    color: "#FFFFFF",
    fontWeight: 600,
    paddingLeft: 20,
  },

  header_wrap: {
    paddingTop: 55,
    alignItems: "center",
    width: "100%",
    backgroundColor: "#B22310",
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    zIndex: 1000,
    paddingBottom: 20,
    height: 100,
  },
  header_Image: {
    width: 50,
    height: 50,
    borderRadius: 100,
    marginRight: 20,
  },

  arrow_btn: {
    paddingTop: 10,
    marginLeft: 20,
    width: 35,
    height: 35,
  },

  loaderContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },

  container: {
    flex: 1,
  },
  cardItemContainer: {
    flex: 1,
    paddingHorizontal: 5,
    width: "100%", // Adjust this width as needed to show 2 cards in each row
  },

  fixedSection: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    // Additional styles for the fixed section
    // ...
  },
  fixedSectionFixed: {
    position: "fixed", // Change the position to 'fixed' when it should be fixed
    // Additional styles for the fixed section when it is fixed
    // ...
  },

  handle_loadmore: {
    fontSize: 13,
    color: "#C43E1A",
  },

  category_main_text: {
    fontSize: 15,
    alignItems: "flex-start",
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 5,
    paddingBottom: 5,
  },

  product_text: {
    fontSize: 15,
    alignItems: "flex-start",
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  category_slider: {
    width: "100%",
  },

  text_contain: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingRight: 30,
    alignItems: "center",
  },

  inputContainer: {
    paddingTop: 5,
    width: "100%",
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  input: {
    height: 40,
    borderColor: "#C43E1A",
    borderWidth: 1,
    borderRadius: 50,
    paddingHorizontal: 30,
    backgroundColor: "#FFFFFF",
  },

  verticalBorder: {
    position: "absolute",
    width: 1,
    height: 30,
    bottom: 5,
    right: 60,
    backgroundColor: "#D2D2D2",
  },
  search: {
    position: "absolute",

    bottom: 10,
    right: 20,
  },

  border_contains: {
    width: "100%",
    alignItems: "flex-end",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    elevation: 1,
  },

  main_contains: {
    width: "100%",
  },

  load_section: {
    width: 120,
    justifyContent: "center",
    borderColor: "#C43E1A",
    borderWidth: 1,
    borderRadius: 50,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    marginBottom: 50,
  },

  card_container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
});

export default Home;
