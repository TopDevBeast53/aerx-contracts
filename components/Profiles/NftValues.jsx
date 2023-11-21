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
import { MinusIcon } from '@chakra-ui/icons'

// type Props = {};

const NftValues = () => {
  const dispatch = useDispatch();
  const {
    rectangle,
    groupP1,
    groupP2,
    ellipse1,
    ellipse2,
    ellipse3,
    ellipse4,
    logoP,
    frameP1,
    frameP2,
    dot,
    ticketStar,
    groupLp3,
    rectangleP2,
    rectangleP3,
    rectangleP4,
    ellipse5,
  } = useSelector(getUserState);
  return (
    <Box
      bgColor="#242424"
      width="257.56px"
      marginLeft="0"
      // borderTopRadius="34.25px"
      position="absolute"
      h="23%"
      top="74%"

    >
      <Center>
     {/* <div
        className="m cursor-pointer  hover:bg-[#ffffff39]  flex flex-col
        background-#1F1F1F
        gap-0.5
      
        mt-2
       "
        onClick=""
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
      </div> */}
      </Center>

      <Flex  ml="16.44px" alignItems="center">
        {/* <Text
          fontWeight="500"
          fontSize="10.96px"
          color="rgba(255, 255, 255, 0.3);"
          mr="160.29px"
          fontFamily="Poppins"
        >
          Values
        </Text> */}
        {/* <Flex>
          <Image src={dot} alt="" w="5.48px" h="5.48px" mr="5.48px" />
          <Image
            src={" resources/Rectangle blank.png"}
            alt=""
            w="5.48px"
            h="5.48px"
            mr="5.48px"
          />
          <Image
            src={" resources/Rectangle blank.png "}
            w="5.48px"
            h="5.48px"
            mr="5.48px"
          />
        </Flex> */}
      </Flex>

      <Flex mt="" ml="16.44px" overflow="hidden">
        <Box marginRight="10.96px" position="relative">
          <Flex position="absolute" left="30.825px" top="28.77px">
            <Image src={"resources/Ticket Star.png"} w="13.7px" h="12.33px" />
            <Text
              fontWeight="400"
              fontSize="10.96px"
              marginLeft="21.92px"
              color="#ffffff"
              position="absolute"
              fontFamily="Poppins"
            >
              Art
            </Text>
          </Flex>
          <Text
            position="absolute"
            color="#ffffff"
            top="48.633px"
            left="17.125px"
            fontSize="12.33px"
            fontWeight={600}
            fontFamily="Poppins"
          >
            NFT Name
          </Text>
          <Text
            position="absolute"
            top="63.705px"
            left="26.03px"
            color="#ffffff"
            fontWeight={400}
            fontSize="10.96px"
            fontFamily="Poppins"
          >
            24,6 aex
          </Text>
          <Image
            src={"resources/Rectangle 3421.png"}
            maxWidth="95.9px"
            height="100%"
          />
        </Box>

        <Box marginRight="16px" position="relative">
          <Flex position="absolute" left="30.825px" top="28.77px">
            <Image src={"resources/Fill 1.png"} w="13.7px" h="12.33px" />
            <Text

              fontWeight="400"
              color="#ffffff"
              fontSize="10.96px"
              marginLeft="21.92px"
              position="absolute"
              fontFamily="Poppins"
            >
              Ticket
            </Text>
          </Flex>
          <Text
            position="absolute"
            color="#ffffff"
            top="48.633px"
            left="17.125px"
            fontSize="12.33px"
            fontWeight={600}
            fontFamily="Poppins"
          >
            NFT Name
          </Text>
          <Text
            position="absolute"
            top="63.705px"
            left="26.03px"
            color="#ffffff"
            fontWeight={400}
            fontSize="10.96px"
            fontFamily="Poppins"
          >
            24,6 aex
          </Text>
          <Image
            src={"resources/Rectangle 3527.png"}
            maxWidth="95.9px"
            height="100%"
          />
        </Box>

        <Box marginRight="16px" position="relative">
          <Flex position="absolute" left="30.825px" top="28.77px">
            <Image src={"resources/Ticket Star.png"} w="13.7px" h="12.33px" />
            <Text
              fontWeight="400"
              fontSize="10.96px"
              marginLeft="21.92px"
              color="#ffffff"
              position="absolute"
              fontFamily="Poppins"
            >
              Art
            </Text>
          </Flex>
          <Text
            position="absolute"
            color="#ffffff"
            top="48.633px"
            left="17.125px"
            fontSize="12.33px"
            fontFamily="Poppins"
          >
            NFT Name
          </Text>
          <Text
            position="absolute"
            top="63.705px"
            left="26.03px"
            color="#ffffff"
            fontWeight={400}
            fontSize="10.96px"
            fontFamily="Poppins"
          >
            24,6 aex
          </Text>
          <Image
            src={"resources/Rectangle 3421.png"}
            maxWidth="95.9px"
            height="100%"
          />
        </Box>
      </Flex>
    </Box>
  );
};

export default NftValues;
