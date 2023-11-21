import React from "react";
import { Box, Image, Text, Heading, Flex,Button } from "@chakra-ui/react";
import { useDispatch, useSelector } from "../../store/store";
import { getUserState, setImages } from "../../store/slices/imageSlices";
import { nearStore } from "../../store/near";
import LogOut from "./LogOut";

// type Props = {};

const ProfileSection = (props) => {
  const nearState = nearStore((state) => state);

  const dispatch = useDispatch();
  const { ellipse3, logoP, frameP1, frameP2 } = useSelector(getUserState);

  return (
    
    <Flex
      id=""
      bgImage={`url('${nearState.profile.profileImg}')`}
      bgRepeat="no-repeat"
      bgPosition="30 0"
      // bgSize="contain"
      onDoubleClick={(e) => props.doubleClick(e)}
      // bgGradient=" linear-gradient(to bottom, rgba(245, 246, 252, 0.52), rgba(117, 19, 93, 0.73))"
      cursor="pointer"
      bgColor="#191919;
      "
        backgroundSize="100% 100%"

      w="257.56px"
      height="150%"
      top="0"
      // position="absolute"
      zIndex="2"
      className="profileSection"
      // bgColor="white"
    >
      {/* <Image src={'../resources/Rectangle 3212.png'} position="absolute" zIndex="-2" /> */}
      <Flex
        flexDirection="column"
        gap="10.96px"
        ml="16.44px"
        mt="21.92px"
        cursor="pointer"
      >
        <Box
          color="#6054F0"
          width="27.4px"
          height="27.4px"
          border="2px solid"
        bgColor="#FFFFFF"
        borderColor="#FFFFFF"
          borderRadius="6.85px"
          onClick={() => props.toggle()}
        >
          <Image
            src="../resources/Frame 14290.svg"
            w="18px"
            py="5px"
            px="auto"
            pl="4px"
          />
        </Box>
        {/*        
        <Box
          width="27.4px"
          height="27.4px"
          border="2px solid"
          borderColor="white"
          padding="2px"
          borderRadius="100%"
        >
          <Image
            src={"../resources/1.png"}
            position="relative"
            zIndex="2"
            top="5.48px"
            left="6.85px"
            w="6.85px"
            h="10.96px"
            boxShadow="xl"
          />

          <Image
            src={"../resources/Ellipse 7.png"}
            position="relative"
            top="-10.96px"
          />
        </Box>

        <Box>
          <Image
            width="27.4px"
            height="27.4px"
            padding="2px"
            border="2px solid"
            borderColor="white"
            borderRadius="100%"
            src={"../resources/Ellipse 2.png"}
          />
        </Box>

        <Box
          width="27.4px"
          height="27.4px"
          border="2px solid"
          borderColor="white"
          padding="2px"
          borderRadius="100%"
        >
          <Image
            src={"../resources/1.png"}
            position="relative"
            zIndex="2"
            top="5.48px"
            left="6.85px"
            w="6.85px"
            h="10.96px"
            boxShadow="xl"
          />

          <Image
            src={"../resources/Ellipse 3.png"}
            position="relative"
            top="-10.96px"
          />
        </Box>

        <Box
          width="27.4px"
          height="27.4px"
          border="2px solid"
          borderColor="white"
          padding="2px"
          borderRadius="100%"
        >
          <Image src={"../resources/Ellipse 4.svg"} />
        </Box> */}
      </Flex>
      {/* end */}
   
      <Flex flexDirection="column" alignItems="center" mx="auto" >
        <Image width="42.47px" height="15.755px" src={logoP} mt="21.92px" />

        <Box  h="235px" >
          <Heading
            fontSize="21.92px"
            color="#FFFFFF"
            fontFamily="Poppins"
            fontWeight="700"
            fontStyle="normal"
            lineHeight="100%"
            textAlign="center"
            letterSpacing="-0.02em"
            mt="25px"
          >
            {nearState.profile.fullName}
          </Heading>

          <Flex
            alignItems="center"
            justifyContent="center"
            gap="16px"
            // mt="55px"
          >
            <Text
              fontSize="12.33px"
              fontFamily="Poppins"
              fontStyle="italic"
              color="#FFFFFFB2"
              fontWeight="400"
              letterSpacing="-0.02em"
              marginTop="5.48px"
              mb="11.645px"
              mt="12px"
              lineHeight=" 100%"
    /* identical to box height, or 18px */

 
            >
              {nearState.profile.username}
            </Text>

            <Flex
            // boxShadow = "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px"
            // boxShadow = "rgba(0, 0, 0, 0.25) 30px 154px 155px,  10px -212px 130px, rgba(0, 0, 0, 0.12) 10px 24px 6px, rgba(0, 0, 0, 0.17) 12px 12px 13px, rgba(0, 0, 0, 0.09) 10px -13px 65px"
            >
              <Image src={ellipse3} marginRight={2} w="10.96px" />
              <Text
                color="#FFFFFF80"
                fontFamily="Poppins"
                fontWeight="500"
                fontSize="9.59px"
                lineHeight="100%"
/* identical to box height, or 14px */

                letterSpacin="-0.02em"
              >
                Aura: 2k
              </Text>
            </Flex>
            <Box
              // bgGradient="linear(to-b, #1f1f1f 0%, #191919 100%)"
              w="261.56px"
              position="absolute"
              top="295px"
              h="34px"
            >
              .
            </Box>
          </Flex>
        </Box>
      </Flex>
      {/* end */}

      <Flex flexDirection="column" gap="10.96px" mr="14.385px" mt="21.92px">
      <Image src={frameP1} w="28.88px" h="28.88px" position="absolute" mt="2%" ml="1%" />
        <Box 
        bgColor="#5A5A5A"
        p="1px"
        borderRadius="8px"
        opacity="15%"
        w="34px"
        h="34px"
        >
        </Box>
        <Image src={frameP2} w="24.88px" h="24.88px"  position="absolute" mt="20%" ml="2%"/>
        <Box 
        bgColor="#5A5A5A"
        p="4px"
        borderRadius="8px"
        opacity="15%"
        w="34px"
        h="34px"
        >
        </Box>
        <Image src="../resources/Frame 14281.png" w="22.88px" h="22.88px" position="absolute" mt="37%" ml="2%" />
        <Box 
        bgColor="#5A5A5A"
        p="4px"
        borderRadius="8px"
        w="34px"
        h="34px"
        opacity="15%"

        >
        </Box>
      </Flex>
    </Flex>

    //    end
  );
};

export default ProfileSection;
