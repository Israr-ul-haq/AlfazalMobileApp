import React, { useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import CustomText from "./CustomText";

const CategorySlider = ({
  categories,

  activeCategory,
  handleCategoryChange,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category._id} // Assuming each category object has a unique identifier like '_id'
          style={[
            styles.category,
            activeCategory._id === category._id && styles.activeCategory,
          ]}
          onPress={() => handleCategoryChange(category)}
        >
          <CustomText
            style={[
              styles.categoryText,
              activeCategory._id === category._id && styles.activeCategoryText,
            ]}
          >
            {category.Name}
          </CustomText>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  category: {
    paddingVertical: 8,
    marginRight: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 50,
    borderColor: "#B22310",
  },
  activeCategory: {
    backgroundColor: "#B22310",
  },
  categoryText: {
    fontSize: 10,
    color: "#B22310",
  },
  activeCategoryText: {
    color: "#FFFFFF",
  },
});

export default CategorySlider;
