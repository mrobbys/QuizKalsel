// StackNavigator.js
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import QuizScreen from "./screens/QuizScreen";
import RulesScreen from "./screens/RulesScreen";
import HomeScreen from "./screens/HomeScreen";

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{
                        animation: "slide_from_bottom", // Animasi untuk Home ke Rules
                    }}
                />
                <Stack.Screen
                    name="Rules"
                    component={RulesScreen}
                    options={{
                        animation: "slide_from_right", // Animasi untuk Rules ke Quiz
                    }}
                />
                <Stack.Screen
                    name="Quiz"
                    component={QuizScreen}
                    options={{
                        animation: "fade", // Animasi untuk Quiz
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default StackNavigator;
