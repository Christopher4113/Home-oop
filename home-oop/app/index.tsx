import { Text, View, TouchableOpacity, ImageBackground } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "@/constants/images"; // Ensure this points to the correct image import

export default function Index() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground source={images.court} style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 20 }}>
          <Text className="font-bold text-2xl text-white mb-10">Welcome to Home OOP</Text>
          <Link href="/landing" asChild>
            <TouchableOpacity style={{
              backgroundColor: "#FFA500",
              paddingVertical: 15,
              paddingHorizontal: 30,
              borderRadius: 10,
              elevation: 5,
              shadowColor: "black",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
            }}>
              <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>Go to Landing</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}