import React from "react";
import {
  Box,
  Spacer,
  Image,
  Text,
  Heading,
  SimpleGrid,
  extendTheme,
  Center,
  Flex,
  Container,
} from "@chakra-ui/react";

import { useDispatch, useSelector } from "../../store/store";
import { getUserState, setImages } from "../../store/slices/imageSlices";
import { MinusIcon } from "@chakra-ui/icons";

const ImagesCarousel = (props) => {
  const dispatch = useDispatch();
  const { ellipse4, ellipse5 } = useSelector(getUserState);

  return (
    <Box
      bgColor="#1F1F1F;
      "
      // borderTopRadius="34.25px"
      width="257.56px"
      position="absolute"
      h="35%"
      top="46%"
      borderRadius="50px 50px 0px 0px"
      
    >
      <Center>
        <div
          className="m cursor-pointer  hover:bg-[#ffffff39]  flex flex-col
        background-#1F1F1F
        gap-0.5
  
        mt-2
       "
          onClick={props.switch}
        >
          <MinusIcon
            w="21.92px"
            bgColor="rgba(255, 255, 255, 0.3);"
            height="2px"
          />
          <MinusIcon
            w="21.92px"
            bgColor="rgba(255, 255, 255, 0.3);"
            height="2px"
          />
        </div>
      </Center>

      <Text
        marginLeft="16.44px"
        marginTop="8.22px"
        fontWeight="500"
        fontSize="10.96px"
        color="rgba(255, 255, 255, 0.3);"
        // height={21}
        fontFamily="Poppins"
        overflow="hidden"
      >
        Circles
      </Text>
      <Flex
        justifyContent="space-around"
        // flexGrow="2"
        flexDirection="row"
        marginLeft="18.495px"
        mt={4}
        overflow="hidden"
        flex="auto"
        alignItems="center"
        ml="8px"
        // justifyContent="center"
      >
        <Flex
          flexDirection="column"
          alignItems="center"
          width="auto"
          onDoubleClick={(e) => props.doubleClick(e)}
          cursor="pointer"
          onClick={props.remove}
        >
          <Image
            src={ellipse4}
            width="43.84px"
            borderRadius="100%"
            mb="5.48px"
          />
          <Text
            fontSize="10.96px"
            fontFamily="Poppins"
            h="32.88px"
            fontWeight="400"
            color="#ffffff"
          >
            Work
          </Text>
        </Flex>

        <Flex
          flexDirection="column"
          alignItems="center"
          width="auto"
          cursor="pointer"
          onDoubleClick={(e) => props.doubleClick(e)}
          onClick={props.remove}
        >
          <Image
            src={ellipse5}
            width="43.84px"
            borderRadius="100%"
            mb="5.48px"
          />
          <Text
            fontSize="10.96px"
            fontFamily="Poppins"
            h="32.88px"
            fontWeight="400"
            color="#ffffff"
          >
            Family
          </Text>
        </Flex>
        <Flex
          flexDirection="column"
          alignItems="center"
          width="auto"
          cursor="pointer"
          onDoubleClick={(e) => props.doubleClick(e)}
          onClick={(e) => props.remove(e)}
        >
          <Image
            src={ellipse4}
            width="43.84px"
            borderRadius="100%"
            mb="5.48px"
          />
          <Text
            fontSize="10.96px"
            fontFamily="Poppins"
            h="32.88px"
            fontWeight="400"
            color="#ffffff"
          >
            Friends
          </Text>
        </Flex>
        <Flex
          flexDirection="column"
          alignItems="center"
          width="auto"
          cursor="pointer"
          onDoubleClick={(e) => props.doubleClick(e)}
          onClick={props.remove}
        >
          <Image
            src={ellipse4}
            width="43.84px"
            borderRadius="100%"
            mb="5.48px"
          />
          <Text
            fontSize="10.96px"
            fontFamily="Poppins"
            h="32.88px"
            fontWeight="400"
            color="#ffffff"
          >
            Followers
          </Text>
        </Flex>
        {/* <Flex flexDirection="column" alignItems="center" width="autonp">
            <Image
              src={ellipse4}
              width="43.84px"
              borderRadius="100%"
              mb="5.48px"
            />
            <Text
              fontSize="10.96px"
              fontFamily="Poppins"
              h="32.88px"
              fontWeight="400"
              color="#ffffff"
            >
              Following
            </Text>
          </Flex> */}
      </Flex>
    </Box>
  );
};

export default ImagesCarousel;
