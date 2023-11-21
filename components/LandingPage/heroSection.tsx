import React from "react"
import {
  Box,
  Button,
  Image,
  Text,
  Heading,
  Container,
  Flex,
} from "@chakra-ui/react"
import WithStar from "./WithStars"
import WithDots from "./WithDots"
import { useDispatch, useSelector } from "../../store/store"
import { getUserState, setImages } from "../../store/slices/imageSlices"
import { nearStore } from "../../store/near"
import { loginToken } from "../../lib/auth"

const HeroSection: React.FC = () => {
  const { saly, group1 } = useSelector(getUserState)
  const state = nearStore((state: any) => state)

  function authentication() {
    console.log("Get Started Button")
    loginToken(state).then(() => {
      //
    })
  }
  return (
    <Container maxWidth="container.xlg">
      <Box
        w="1920"
        h="743"
        bgImage="url('../resources/Frame 22415.png') "
        bgRepeat="no-repeat"
        bgPosition="100%  1%"
        bgSize="contain"
      >
        <Box
          bgColor="#8D00FF"
          className="button hover:bg-[#891ae4]"
          fontFamily="Poppins"
          borderRadius={50}
          fontWeight="600"
          color="white"
          onClick={authentication}
          top="77%"
          left="16%"
          cursor="pointer"
          w="159.605px"
          h="46.58"
          // justifyContent="center"
          pt="13px"
          pl="32.88"
          position="absolute"
        >
          <Text
            fontFamily="Poppins"
            fontStyle="normal"
            fontWeight="600"
            fontSize="16.44px"
            lineHeight="24.66px"
            // justifyContent="center"
            pt="-4%"
            className="relative -left-[3px] bottom-[2.5px]"
            color="#FFFFFF"
            pl="1%"
          >
            Get started
          </Text>
        </Box>
      </Box>
    </Container>
  )
}
export default HeroSection
