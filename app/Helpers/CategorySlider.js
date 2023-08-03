import React, { useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import CustomText from "./CustomText";

const CategorySlider = ({ categories, onCategoryChange }) => {
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    onCategoryChange(category);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          style={[
            styles.category,
            activeCategory === category && styles.activeCategory,
          ]}
          onPress={() => handleCategoryChange(category)}
        >
          <CustomText
            style={[
              styles.categoryText,
              activeCategory === category && styles.activeCategoryText,
            ]}
          >
            {category}
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
