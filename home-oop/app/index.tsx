import { Text, View, TouchableOpacity, ImageBackground, StyleSheet } from "react-native";
import { Link, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "@/constants/images";

export default function Index() {
  return (
    <ImageBackground source={images.court} style={StyleSheet.absoluteFillObject} resizeMode="cover">
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text className="font-bold text-2xl text-white mb-10">Welcome to Home OOP</Text>
          <Link href="/signin" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Go to SignIn</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "#FFA500",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    elevation: 5,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
