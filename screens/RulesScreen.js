import {
    Text, View, SafeAreaView, Dimensions, Platform,
    TouchableOpacity, Animated, Easing,
    FlatList
} from "react-native";
import React, { useState, useEffect } from "react";
import { Audio } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import tw from "twrnc";
import BgImage from "../components/bgImage";
import rules from "../data/RulesData";

const RulesScreen = () => {
    const screenWidth = Dimensions.get("window").width;
    const screenHeight = Dimensions.get("window").height;

    const { width } = Dimensions.get("window");
    const { height } = Dimensions.get("window");
    const isSmallScreen = screenWidth < 385;
    const isBigScreen = screenWidth > 651;
    const isSmallHeight = screenHeight < 700;

    const navigation = useNavigation();

    const [bounceAnim] = useState(new Animated.Value(1)); // Inisialisasi Animated.Value untuk kontrol skala tombol

    useEffect(() => {
        // Membuat animasi bouncing terus menerus
        Animated.loop(
            Animated.sequence([
                Animated.timing(bounceAnim, {
                    toValue: 1.07, // Meningkatkan ukuran tombol
                    duration: 450,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.timing(bounceAnim, {
                    toValue: 1, // Kembali ke ukuran asli tombol
                    duration: 450,
                    easing: Easing.linear,
                    useNativeDriver: true,
                })
            ])
        ).start(); // Mulai animasi looping
    }, [bounceAnim]);

    const playSound = async (soundFile) => {
        const { sound } = await Audio.Sound.createAsync(
            soundFile
        );
        await sound.playAsync();  // Play the sound
    };

    const handleNext = () => {
        playSound(require("../assets/bubble-pop.mp3"));
        navigation.reset({
            index: 0,  // Reset stack dan set index ke 0
            routes: [{ name: "Quiz" }] // Hanya arahkan ke QuizScreen
        });
    }

    return (
        <SafeAreaView
            style={[
                tw`flex-1 bg-[#AD652B]`,
                { paddingTop: Platform.OS === "android" ? 35 : 30 },
            ]}
        >
            <View style={tw`flex-1 px-5 relative`}>
                {/* <Text
                    style={[
                        tw`text-white text-2xl`,
                        tw`${isSmallScreen ? "text-2xl" : ""}`,
                        tw`${isBigScreen ? "text-3xl" : ""}`,
                    ]}
                >
                    Lebar : {screenWidth} & Tinggi : {screenHeight}
                </Text> */}

                {/* Panel Rules */}
                <View style={tw`w-full bg-slate-500 rounded-3xl my-auto z-10 p-5 items-center`}>
                    <Text style={[tw`text-white text-4xl font-bold text-center mb-5`,
                    tw`${isSmallScreen ? "text-3xl" : ""}`
                    ]}>Peraturan</Text>
                    <FlatList
                        data={rules}
                        renderItem={({ item, index }) => (
                            <Text style={[tw`text-lg text-white font-normal mb-2 text-left `,
                            tw`${isSmallScreen ? "text-base" : ""}`
                            ]}>
                                {index + 1}. {item}  {/* Menampilkan nomor urut dan teks peraturan */}
                            </Text>
                        )}
                        keyExtractor={(item, index) => index.toString()} // Key berdasarkan index
                        scrollEnabled={false}
                    />
                    <Animated.View
                        style={{
                            transform: [{ scale: bounceAnim }],
                            width: "100%"
                        }}
                    >
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={handleNext}
                            style={[tw`w-full h-15 bg-orange-900 rounded-2xl items-center justify-center my-5`,
                            tw`${isSmallScreen ? "h-12" : ""}`
                            ]}>
                            <Text style={[tw`text-center text-white font-bold text-2xl`,
                            tw`${isSmallScreen ? "text-xl" : ""}`
                            ]}>Lanjut</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>




            </View>
            {/* Background Image */}
            <BgImage />
        </SafeAreaView>
    )
}

export default RulesScreen
