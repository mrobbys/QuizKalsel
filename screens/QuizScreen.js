import {
    Text, View, Image, SafeAreaView, Dimensions, Platform,
    TouchableOpacity, Modal, Animated
} from "react-native";
import React, { useState, useEffect } from "react";
import { Audio } from 'expo-av';
import { useMusic } from '../contexts/MusicContext';
import { useNavigation } from '@react-navigation/native';
import tw from "twrnc";
import data from "../data/QuizData";
import BgImage from "../components/bgImage";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const QuizScreen = () => {
    const screenWidth = Dimensions.get("window").width;
    const screenHeight = Dimensions.get("window").height;

    const { width } = Dimensions.get("window");
    const { height } = Dimensions.get("window");
    const isSmallScreen = screenWidth < 385;
    const isBigScreen = screenWidth > 651;
    const isSmallHeight = screenHeight < 700;

    const navigation = useNavigation();

    const allQuestions = data;
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentOptionSelected, setCurrentOptionSelected] = useState(null);
    const [correctOption, setCorrectOption] = useState(null);
    const [isOptionsDisabled, setIsOptionsDisabled] = useState(false);
    const [score, setScore] = useState(0);
    const [showNextButton, setShowNextButton] = useState(false);
    const [showScoreModal, setShowScoreModal] = useState(false);

    // Audio state and ref for loading and playing sounds
    const [tickSound, setTickSound] = useState(); // For Tick.mov
    const [bubblePopSound, setBubblePopSound] = useState(); // For bubble-pop.mp3

    // Load and play sound effect
    const playSound = async (soundFile, soundType) => {
        const { sound } = await Audio.Sound.createAsync(
            soundFile
        );
        if (soundType === 'tick') {
            setTickSound(sound);
        } else if (soundType === 'bubble') {
            setBubblePopSound(sound);
        }
        await sound.playAsync();  // Play the sound
    };

    // Stop the Tick.mov sound when the modal appears
    useEffect(() => {
        if (showScoreModal && tickSound) {
            tickSound.stopAsync();  // Stop the ticking sound when modal is visible
        }
    }, [showScoreModal, tickSound]);

    const [progress, setProgress] = useState(new Animated.Value(0));
    const progressAnim = progress.interpolate({
        inputRange: [0, allQuestions.length],
        outputRange: ['0%', '100%']
    })

    const renderProgressBar = () => {
        return (
            <View style={[tw`w-full h-20px bg-amber-800 rounded-20 mb-5`,
            tw`${isSmallScreen ? "h-10px mb-4" : ""}`
            ]}>
                <Animated.View
                    style={[
                        { height: isSmallScreen ? 10 : 20, borderRadius: 20, backgroundColor: "#C6A969" },
                        { width: progressAnim },
                    ]}
                />

            </View>
        )
    }

    const [counter, setCounter] = useState(15);
    const [timerRunning, setTimerRunning] = useState(true); // State untuk mengatur apakah timer sedang berjalan

    // Timer effect
    useEffect(() => {
        if (counter === 0 && currentOptionSelected === null) {
            // Jika timer habis dan belum ada jawaban, langsung lanjut ke soal berikutnya
            anotherHandleNext();
            return;
        }

        if (counter > 0 && timerRunning) {
            const timer = setInterval(() => {
                playSound(require("../assets/Tick.mov"), 'tick');
                setCounter((prevCounter) => prevCounter - 1); // Decrease counter every second
            }, 1000);

            // Clear interval when counter reaches 0 or when timerRunning is false
            return () => clearInterval(timer);
        }
    }, [counter, timerRunning]);

    // Menghentikan interval timer ketika modal muncul
    useEffect(() => {
        if (showScoreModal) {
            setTimerRunning(false);  // Stop the timer
        }
    }, [showScoreModal]);

    const renderQuestion = () => {
        return (
            <View>
                {/* Question Counter */}
                <View style={tw`flex-row items-end justify-between`}>
                    <View style={tw`flex-row items-end justify-center`}>
                        <Text style={[tw`mr-1 text-2xl opacity-80 text-white`,
                        tw`${isSmallScreen ? "text-xl" : ""}`
                        ]

                        }>
                            Level {currentQuestionIndex + 1}
                        </Text>
                        <Text style={[tw`text-xl opacity-80 text-white`,
                        tw`${isSmallScreen ? "text-base" : ""}`
                        ]}>/ {allQuestions.length}</Text>
                    </View>
                    <View style={tw`flex-row items-center justify-center`}>
                        <MaterialCommunityIcons name="timer-outline" size={isSmallScreen ? 35 : 40} color="white" style={[tw`absolute right-8`, tw`${isSmallScreen ? "right-6" : ""}`]} />
                        <Text style={[tw`text-white font-bold text-2xl`,
                        tw`${isSmallScreen ? "text-lg" : ""}`
                        ]}>{counter}</Text>
                    </View>
                </View>


                {/* Question */}
                <View style={[tw`absolute left-0 right-0 top-15`,
                tw`${isSmallScreen ? "top-13" : ""}`
                ]}>
                    <Text style={[tw`text-4xl text-white text-start tracking-tight`,
                    tw`${isSmallScreen ? "text-3xl" : ""}`
                    ]}>
                        {allQuestions[currentQuestionIndex]?.question}
                    </Text>
                </View>

            </View>
        );
    };


    const validateAnswer = (selectedOption) => {
        let correct_option = allQuestions[currentQuestionIndex]['correct_option'];
        setCurrentOptionSelected(selectedOption);
        setCorrectOption(correct_option);
        setIsOptionsDisabled(true);  // Disable the options after selecting an answer
        setTimerRunning(false); // Stop the timer when an option is selected
        if (selectedOption === correct_option) {
            setScore(score + 1);
        }
        playSound(require("../assets/bubble-pop.mp3"), 'bubble');
        setShowNextButton(true); // Show the "Next" button after selecting an option
    };

    const renderOptions = () => {
        return (
            <View style={[tw`mt-55`, tw`${isSmallScreen ? "mt-50" : ""}`]}>
                {allQuestions[currentQuestionIndex]?.options.map((option) => (
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => validateAnswer(option)}
                        disabled={isOptionsDisabled}
                        key={option}
                        style={[
                            tw`h-75px rounded-20px flex-row items-center justify-between px-5 my-2.5 z-10`,
                            tw`${isSmallScreen ? "h-60px my-1.5" : ""}`,
                            {
                                borderWidth: 3,
                                borderColor:
                                    option === correctOption
                                        ? '#00C851'
                                        : option === currentOptionSelected
                                            ? "#ff4444"
                                            : '#4F200D',
                                backgroundColor:
                                    option === correctOption
                                        ? '#00C851'
                                        : option === currentOptionSelected
                                            ? "#ff4444"
                                            : '#4F200D',
                            },
                        ]}
                    >
                        <Text style={[tw`text-2xl text-white font-medium`,
                        tw`${isSmallScreen ? "text-lg fot" : ""}`
                        ]}>{option}</Text>

                        {/* Show Check or Cross Icon based on correct answer */}
                        {option === correctOption ? (
                            <View
                                style={[tw`w-30px h-30px rounded-2xl bg-[#ffffff] justify-center items-center`,
                                tw`${isSmallScreen ? "w-25px h-25px" : ""}`
                                ]}
                            >
                                <MaterialCommunityIcons name="check" style={{ color: "#00C851", fontSize: 20 }} />
                            </View>
                        ) : option === currentOptionSelected ? (
                            <View
                                style={[tw`w-30px h-30px rounded-2xl bg-[#ffffff] justify-center items-center`,
                                tw`${isSmallScreen ? "w-25px h-25px" : ""}`
                                ]}
                            >
                                <MaterialCommunityIcons name="close" style={{ color: "#ff4444", fontSize: 20 }} />
                            </View>
                        ) : null}
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    const renderNextButton = () => {
        if (showNextButton) {
            return (
                <TouchableOpacity
                    onPress={handleNext}
                    style={[tw`mt-50px w-full bg-gray-400 p-20px rounded-3xl z-30`,
                    tw`${isSmallScreen ? "p-13px rounded-2xl" : ""}`
                    ]}
                >
                    <Text style={[tw`text-2xl font-bold text-white text-center`,
                    tw`${isSmallScreen ? "text-xl" : ""}`
                    ]}>Next</Text>
                </TouchableOpacity>
            );
        } else {
            return null;
        }
    };

    const handleNext = () => {
        // Reset the counter to 15 seconds for the next question
        setCounter(15);
        setTimerRunning(true);  // Start the timer again

        if (currentQuestionIndex === allQuestions.length - 1) {
            setShowScoreModal(true); // Show score modal when all questions are answered
        } else {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setCurrentOptionSelected(null);
            setCorrectOption(null);
            setIsOptionsDisabled(false);
            setShowNextButton(false);
        }
        Animated.timing(progress, {
            toValue: currentQuestionIndex + 1,
            duration: 1000,
            useNativeDriver: false
        }).start();
        playSound(require("../assets/bubble-pop.mp3"), 'bubble');
    };

    const anotherHandleNext = () => {
        setCounter(15);
        setTimerRunning(true);  // Start the timer again

        if (currentQuestionIndex === allQuestions.length - 1) {
            setShowScoreModal(true); // Show score modal when all questions are answered
        } else {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setCurrentOptionSelected(null);
            setCorrectOption(null);
            setIsOptionsDisabled(false);
            setShowNextButton(false);
        }
        Animated.timing(progress, {
            toValue: currentQuestionIndex + 1,
            duration: 1000,
            useNativeDriver: false
        }).start();
    };

    const handleBackToHome = () => {
        playSound(require("../assets/bubble-pop.mp3"));
        navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
        });
    };

    // Hitung skor berdasarkan jumlah jawaban yang benar
    const calculateScore = () => {
        return (score / allQuestions.length) * 100;
    };

    const restartQuiz = () => {
        setShowScoreModal(false);
        setCurrentQuestionIndex(0);
        setScore(0);
        setCurrentOptionSelected(null);
        setCorrectOption(null);
        setIsOptionsDisabled(false);
        setShowNextButton(false);
        setCounter(15); // Reset timer for the new quiz
        setTimerRunning(true); // Restart the timer
        Animated.timing(progress, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: false
        }).start();
        playSound(require("../assets/bubble-pop.mp3"), 'bubble');
    };

    return (
        <SafeAreaView style={[
            tw`flex-1 bg-[#AD652B]`,
            { paddingTop: Platform.OS === "android" ? 35 : 30 },
        ]}>
            <View style={tw`flex-1 p-5 relative`}>
                {/* Progress Bar */}
                {renderProgressBar()}

                {/* Question */}
                {renderQuestion()}

                {/* Options */}
                {renderOptions()}

                {/* Next Button */}
                {renderNextButton()}

                {/* Score Modal */}
                <Modal animationType="slide" transparent={true} visible={showScoreModal}>
                    <View style={tw`flex-1 bg-[#AD652B] items-center justify-center`}>

                        <View style={[tw`rounded-20px p-5 items-center w-90% bg-[#FFFBE9]`,
                        tw`${isSmallScreen ? "p-3" : ""}`
                        ]}>
                            <Text style={[tw`font-bold text-4xl`,
                            tw`${isSmallScreen ? "text-[27px]" : ""}`
                            ]}>
                                {score > allQuestions.length / 2 ? "Congratulations!" : "Oops!"}
                            </Text>
                            <View style={[tw`flex-row justify-start items-center mt-5`,
                            tw`${isSmallScreen ? "mt-4" : ""}`
                            ]}>
                                <Text style={[tw`text-xl text-black mr-3`,
                                tw`${isSmallScreen ? "text-lg" : ""}`
                                ]}>Your Answer</Text>
                                <Text
                                    style={{
                                        fontSize: isSmallScreen ? 24 : 28,
                                        color: score > allQuestions.length / 2 ? "#00C851" : "#ff4444",
                                    }}
                                >
                                    {score}
                                </Text>
                                <Text style={[tw`text-xl text-black`,
                                tw`${isSmallScreen ? "text-lg" : ""}`
                                ]}> / {allQuestions.length}</Text>
                            </View>

                            <View style={[tw`mb-3`,
                            ]}>
                                <Text style={[tw`text-xl text-black font-bold`,
                                tw`${isSmallScreen ? "text-lg" : ""}`
                                ]}> Score : {Math.round(calculateScore())}</Text>
                            </View>

                            {/* Retry Quiz button */}
                            <TouchableOpacity
                                onPress={restartQuiz}
                                activeOpacity={0.7}
                                style={[tw`bg-[#632626] p-5 w-full rounded-3xl mb-15px`,
                                tw`${isSmallScreen ? "p-3.5 rounded-2xl" : ""}`
                                ]}
                            >
                                <Text style={[tw`text-center font-bold text-white text-xl`,
                                tw`${isSmallScreen ? "text-lg" : ""}`
                                ]}>
                                    Retry Quiz
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleBackToHome}
                                activeOpacity={0.7}
                                style={[tw`bg-[#632626] p-5 w-full rounded-3xl`,
                                tw`${isSmallScreen ? "p-3.5 rounded-2xl" : ""}`
                                ]}
                            >
                                <Text style={[tw`text-center font-bold text-white text-xl`,
                                tw`${isSmallScreen ? "text-lg" : ""}`
                                ]}>Back To Home</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>

            {/* Background Image */}
            <BgImage />
        </SafeAreaView>
    )
}

export default QuizScreen
