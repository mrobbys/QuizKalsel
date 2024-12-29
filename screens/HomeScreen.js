import {
    Text, View, Image, SafeAreaView, Dimensions, Platform,
    TouchableOpacity, Modal, Animated, Easing
} from "react-native";
import React, { useState, useEffect } from "react";
import { Audio } from 'expo-av';
import { useMusic } from '../contexts/MusicContext';
import { useNavigation } from '@react-navigation/native';
import tw from "twrnc";
import Fontisto from '@expo/vector-icons/Fontisto';
import BgImage from "../components/bgImage";

const HomeScreen = () => {
    const screenWidth = Dimensions.get("window").width;
    const screenHeight = Dimensions.get("window").height;

    const { width } = Dimensions.get("window");
    const { height } = Dimensions.get("window");
    const isSmallScreen = screenWidth < 385;
    const isBigScreen = screenWidth > 651;
    const isSmallHeight = screenHeight < 700;

    const navigation = useNavigation();

    const [showAboutModal, setShowAboutModal] = useState(false);

    const { backgroundMusic, isMusicPlaying, pauseMusic, resumeMusic } = useMusic(); // Mendapatkan state dan fungsi dari MusicContext
    const [isMusicOff, setIsMusicOff] = useState(false);

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

    // Fungsi untuk toggle musik
    const toggleMusic = () => {
        if (isMusicPlaying) {
            pauseMusic();
            setIsMusicOff(true);
        } else {
            resumeMusic();
            setIsMusicOff(false);
        }
        playSound(require("../assets/bubble-pop.mp3"));
    };


    const playSound = async (soundFile) => {
        const { sound } = await Audio.Sound.createAsync(
            soundFile
        );
        await sound.playAsync();  // Play the sound
    };

    const handleStartClick = () => {
        playSound(require("../assets/bubble-pop.mp3"));
        navigation.navigate("Rules");
    };

    const handleInfoClick = () => {
        playSound(require("../assets/bubble-pop.mp3"));  // Add your own about sound
        setShowAboutModal(true);
    };

    const handleCloseInfoModal = () => {
        playSound(require("../assets/bubble-pop.mp3"));
        setShowAboutModal(false);
    };

    const renderBtnHeader = () => {
        return (
            <View style={tw`flex-row justify-between`}>
                {/* btn info */}
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={handleInfoClick}
                    style={tw``}
                >
                    <Image
                        source={require("../assets/info.png")}
                        style={[
                            tw`w-20 h-20`,
                            tw`${isSmallScreen ? "w-17 h-17" : ""}`,
                        ]}
                    />
                </TouchableOpacity>
                {/* btn music */}
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={toggleMusic}
                    style={tw``}
                >
                    <Image
                        source={isMusicOff ? require('../assets/music_off.png') : require('../assets/music_on.png')}
                        style={[
                            tw`w-20 h-20`,
                            tw`${isSmallScreen ? "w-17 h-17" : ""}`,
                        ]}
                    />
                </TouchableOpacity>

            </View>
        );
    };

    const renderHeader = () => {
        return (
            <View style={tw`items-center justify-center mt-25 z-10`}>
                <Text style={[
                    tw`text-white text-7xl font-extrabold`,
                    tw`${isSmallScreen ? "text-6xl" : ""}`,
                ]}>QuizKalsel</Text>
            </View>
        );
    };

    const renderBtnMain = () => {
        return (
            <View style={tw`flex-1 justify-end my-45`}>
                <Animated.View
                    style={{
                        transform: [{ scale: bounceAnim }], 
                        zIndex: 10
                    }}
                >
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={handleStartClick}
                        style={[tw`items-center justify-center w-full h-15 rounded-2xl z-10 bg-orange-900`,
                        tw`${isSmallScreen ? "h-13" : ""}`
                        ]}
                    >
                        <Text style={[tw`text-white text-4xl font-black`,
                        tw`${isSmallScreen ? "text-3xl" : ""}`
                        ]}>Mulai</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        );
    };

    const renderInfo = () => {
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={showAboutModal}
                onRequestClose={() => setShowAboutModal(false)}
            >
                <View style={tw`flex-1 bg-orange-700 items-center justify-center`}>
                    <View style={tw`bg-stone-500 w-90% rounded-20px items-center p-5`}>
                        <View style={tw`flex-col items-center justify-center`}>
                            <Text style={[tw`text-white text-4xl font-bold`,
                            tw`${isSmallScreen ? "text-2xl" : ""}`
                            ]}>Kelompok 1</Text>
                            <Text style={[tw`text-white text-xl font-semibold mb-2.5`,
                            tw`${isSmallScreen ? "text-base" : ""}`
                            ]}>5A SI REG BJB</Text>
                        </View>
                        <View style={tw`w-full h-1.3 bg-slate-700 rounded`}></View>
                        <View style={[tw`w-full my-5 gap-4`,
                        tw`${isSmallScreen ? "gap-3" : ""}`
                        ]}>
                            <View style={[tw`flex-row bg-stone-700 rounded-xl w-full h-30 items-center p-4 border-2 border-gray-400`,

                            ]}>
                                <View style={tw`bg-white p-3 items-center justify-center rounded-full`}>
                                    <Fontisto name="male" size={40} color="black"
                                    />
                                </View>
                                <View style={[tw`flex-col ml-5 w-55 h-22 justify-evenly gap-1`,
                                tw`${isSmallScreen ? "w-45" : ""}`
                                ]}>
                                    <Text style={[tw`text-lg text-white font-semibold`,
                                    tw`${isSmallScreen ? "text-base" : ""}`
                                    ]}>M. Robby Setiawan</Text>
                                    <Text style={[tw`text-lg text-white font-semibold`,
                                    tw`${isSmallScreen ? "text-base" : ""}`
                                    ]}>2210020085</Text>
                                </View>
                            </View>
                            <View style={[tw`flex-row bg-stone-700 rounded-xl w-full h-30 items-center p-4 border-2 border-gray-400`,

                            ]}>
                                <View style={tw`bg-white p-3 items-center justify-center rounded-full`}>
                                    <Fontisto name="male" size={40} color="black"
                                    />
                                </View>
                                <View style={[tw`flex-col ml-5 w-55 h-22 justify-evenly gap-1`,
                                tw`${isSmallScreen ? "w-45" : ""}`
                                ]}>
                                    <Text style={[tw`text-lg text-white font-semibold`,
                                    tw`${isSmallScreen ? "text-base" : ""}`
                                    ]}>Muhammad Satria Renal Fauzi</Text>
                                    <Text style={[tw`text-lg text-white font-semibold`,
                                    tw`${isSmallScreen ? "text-base" : ""}`
                                    ]}>2210020106</Text>
                                </View>
                            </View>
                            <View style={[tw`flex-row bg-stone-700 rounded-xl w-full h-30 items-center p-4 border-2 border-gray-400`,

                            ]}>
                                <View style={tw`bg-white p-3 items-center justify-center rounded-full`}>
                                    <Fontisto name="female" size={40} color="black"
                                    />
                                </View>
                                <View style={[tw`flex-col ml-5 w-55 h-22 justify-evenly gap-1`,
                                tw`${isSmallScreen ? "w-45" : ""}`
                                ]}>
                                    <Text style={[tw`text-lg text-white font-semibold`,
                                    tw`${isSmallScreen ? "text-base" : ""}`
                                    ]}>Azka Kiranaia Adefa</Text>
                                    <Text style={[tw`text-lg text-white font-semibold`,
                                    tw`${isSmallScreen ? "text-base" : ""}`
                                    ]}>2210020035</Text>
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={handleCloseInfoModal}
                            style={[tw`border-2 border-neutral-800 w-full items-center justify-center p-4 mt-2 rounded-2xl bg-zinc-500`,
                            tw`${isSmallScreen ? "p-3" : ""}`
                            ]}
                        >
                            <Text style={[tw`text-gray-100 text-2xl font-extrabold`,
                            tw`${isSmallScreen ? "text-xl" : ""}`
                            ]}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    };

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

                {/* Render Btn Info dan Music */}
                {renderBtnHeader()}

                {/* Header Quiz */}
                {renderHeader()}

                {/* Button */}
                {renderBtnMain()}

                {/* Modal Info */}
                {renderInfo()}
            </View>

            {/* Background Image */}
            <BgImage />
        </SafeAreaView>
    );
};

export default HomeScreen;
