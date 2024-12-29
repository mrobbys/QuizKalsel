import { View, Image, Dimensions } from 'react-native'
import React from 'react'
import tw from 'twrnc'

const bgImage = () => {
    const screenWidth = Dimensions.get("window").width;
    const screenHeight = Dimensions.get("window").height;

    const { width } = Dimensions.get("window");
    const { height } = Dimensions.get("window");
    const isSmallScreen = screenWidth < 385;
    const isBigScreen = screenWidth > 651;
    const isSmallHeight = screenHeight < 700;

    return (
        
            <Image
                source={require("../assets/Group1.png")}
                style={[
                    tw`absolute w-auto h-150 bottom-0 left-0 right-0`,
                    tw`${isSmallHeight ? "h-125" : ""}`,
                ]}
                resizeMode="stretch"
            />
        
    )
}

export default bgImage
