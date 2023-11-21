import React, { useEffect } from "react";
import {
  Box,
  Image,
  Text,
  Center,
  Flex,
  Button,
  Container,
} from "@chakra-ui/react";
import { logout } from "../../lib/auth";
import { nearStore } from "../../store/near";

function LogOut(props) {
  const nearState = nearStore((state) => state);
  const handleLogout = () => {
    console.log("Yes on logout button clicked");
    logout(nearState);
  };


  let index = props.log ? 4 : "none";
  let width = props.log ? 655 : "none";
  return (
    <Box
      display={props.show ? "block" : "none"}
      position="fixed"
      top="284.275px"
      left="21.92px"
      bgColor="#191919"
      // width="257.56"
      height="147.96px"
      borderRadius="13.7px"
      zIndex={1} 
    >
      <Flex cursor="pointer" onClick={props.revert} mr="4">
        <Image
          src="resources/Group 14018.png"
          w="11.645px"
          h="11.645px"
          ml="190.44px"
          mt="15.08px"
        />
      </Flex>
      <Flex flexDirection="column" alignItems="center">
        <Text
          fontWeight="500"
          fontSize="12.33px"
          fontFamily="Poppins"
          lineHeight="18.495px"
          color="#FFFFFF"
          mb="10.96px"
        >
          Sign out
        </Text>
        <Text
          fontWeight="400"
          fontSize="10.96px"
          fontFamily="Poppins"
          lineHeight="18.495px"
          color="#FFFFFFB2
          "
          mb="16.44px"
        >
          Do you want to sign out?
        </Text>
        <Box
          w="169.88px"
          h="38.36px"
          bgColor="#FFFFFF0D"
          borderRadius="10.96px"
          cursor="pointer"
          onClick=""
        >
          <Flex
            justifyContent="center"
            pt="8.7px"
            gap="6.85"
            alignItems="center"
            onClick={() => handleLogout()}
          >
            <Image src={"../resources/Logout.png"} w="9.59px" h="13.7px" />
            <Text
              fontWeight="600"
              fontSize="10.96px"
              fontFamily="Poppins"
              lineHeight="18.495px"
              color="#FFFFFF
               "
            >
              Yes
            </Text>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}

export default LogOut;
