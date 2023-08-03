import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import CustomText from "./CustomText";
import { ActivityIndicator } from "react-native";

const Button = ({
  onPressCancel,
  title,
  isButtonFirst,
  isMultiButton,
  onPressOk,
  isSecondButton,
  title2,
  isLoading,
}) => {
  return (
    <>
      {isButtonFirst && (
        <TouchableOpacity
          style={styles.button}
          onPress={onPressOk}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator
              size="large"
              color="white"
              style={styles.spinner}
            />
          ) : (
            <CustomText style={styles.buttonText} bold={true}>
              {title}
            </CustomText>
          )}
        </TouchableOpacity>
      )}

      {isSecondButton && (
        <TouchableOpacity style={styles.cancelButton} onPress={onPressCancel}>
          <CustomText style={styles.cancelButtonText} bold={true}>
            {title}
          </CustomText>
        </TouchableOpacity>
      )}

      {isMultiButton && (
        <>
          <TouchableOpacity style={styles.button} onPress={onPressOk}>
            <CustomText style={styles.buttonText} bold={true}>
              {title}
            </CustomText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={onPressCancel}>
            <CustomText style={styles.cancelButtonText} bold={true}>
              {title2}
            </CustomText>
          </TouchableOpacity>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#C43E1A",
    paddingVertical: 15,
    borderRadius: 50,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },

  cancelButtonText: {
    color: "#C43E1A",
    fontSize: 16,
  },

  cancelButton: {
    backgroundColor: "white",
    paddingTop: 15,
    paddingBottom: 15,
    paddingRight: 100,
    paddingLeft: 100,
    borderWidth: 2, // Set the border width
    borderColor: "#C43E1A", // Set the border color
    borderRadius: 50,
    alignItems: "center",
  },
});

export default Button;
