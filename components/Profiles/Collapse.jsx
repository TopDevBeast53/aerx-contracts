import { useState } from "react";
import { Box, Image, Text, Center, Flex, Button } from "@chakra-ui/react";
import WalletHead from "./WalletsHead";
import { ChevronRightIcon } from '@chakra-ui/icons'



function Collapse(props) {
  // {/* <Wallets toggle={props.toggle} left={props.left} /> */}
  let zIndex

  return (
    <Flex
      h="100vh"
      w="41.1px"
      justifyItems="center"
      flexDirection="column"
      bgColor="#232323;"
      top="0"
      pt="20.55px"
      pb="16.44px"
      zIndex={props.index}
    >
      <Flex
        flexDirection="column"
        mb="169.21255px"
        justifyItems="center"
        alignItems="center"
      >
        <Image src="../resources/æ.png"  w="21.92px" h="14.385px"mb="59.865px"/>
       
        {/* <Image src={"../resources/Frame 5449.png"} w="21.92px" mb="19.865px" /> */}
        {/* <Text fontFamily="Open Sans" fontWeight="800" color="white" w="21.92px" h="21px">æ</Text> */}
        <Image
          src={"../resources/Vector 38.png"}
          bgColor="rgba(255, 255, 255, 0.05);"
          py="5.48px"
          px="9.59px"
          borderRadius="10.275px"
          w="32px"
          h="32px"
          mb="4.11px"
        />

        <Image
          src={"../resources/Frame 14042.png"}
          bgColor="rgba(255, 255, 255, 0.05);"
          py="6.48px"
          px="7.59px"
          borderRadius="10.275px"
          w="32px"
          h="32px"
          mb="4.11px"
        />

        <Image
          src={"../resources/Frame 14289.png"}
          bgColor="rgba(255, 255, 255, 0.05);"
          py="6.48px"
          px="7.59px"
          borderRadius="10.275px"
          w="32px"
          h="32px"
          mb="19.865px"
        />
        {/* <Image src={"../resources/Frame 14046.png"} w="21.92px" h="21.92px" /> */}
      </Flex>

      <div
        className=" color-[white]  rounded-[10.275px] cursor-pointer mx-auto  flex items-center bg-[#ffffff16] hover:bg-[#ffffff39] w-[24.66px] h-[77.13px] "
        onClick={props.toggle}
      >
        <Image
          src="resources/Frame 14290.png" w="8px" h="16px" ml="8px"
             
        />
        {/* <ChevronRightIcon 
       
          width="36.44px"
          height="36.44px"
          ml="-5px"
          color="#FFFFFF"
          /> */}
      </div>

      <Flex flexDirection="column" gap="10.96px" alignItems="center" mt="451%">
        <Box
          border="1px solid rgba(255, 255, 255, 0.1)"
          borderRadius="100%"
          p="4px"
        >
          <Text
            color="#ffffff"
            marginTop={-2}
            marginLeft={2}
            position="absolute"
            backgroundColor="red"
            px="3.5px"
            borderRadius="100%"
            fontFamily="Poppins"
            fontWeight="500"
            fontSize="9.59px"
          >
            3
          </Text>
          <Image
            src={"../resources/Notification22.png"}
            w="11.64px"
            h="13.7px" 
          />
        </Box>
        <Box
          border="1px solid rgba(255, 255, 255, 0.1)"
          borderRadius="100%"
          p="4px"
        >
          <Image src={"../resources/Frame 5450.png"} w="13.015px" h="13.7px" />
        </Box>
      </Flex>
    </Flex>
  );
}

export default Collapse;
