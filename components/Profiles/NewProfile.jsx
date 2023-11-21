import React from "react";
import {
  Box,
  Text,
  Center,
  Flex,
  Image,
  Select,
  Button,
  Header,
} from "@chakra-ui/react";

import Link from "next/link";

import { useDispatch, useSelector } from "../../store/store";
import { getUserState, setImages } from "../../store/slices/imageSlices";
import { MinusIcon } from "@chakra-ui/icons";
import { nearStore } from "../../store/near";
import CircleList from "./CircleList";
import LogOut from "./LogOut";

function NewProfile(props) {
  const [isCircle, setCircle] = React.useState(false);
  const [isLogout, setLogout] = React.useState(false);

  const { ellipse4, ellipse5 } = useSelector(getUserState);
  const nearState = nearStore((state) => state);

  const switchCircle = (props) => {
    setCircle((prevState) => !prevState);
  };
  const logOutUser = () => {
    setLogout((prevState) => !prevState)
  }


  let zIndex;

  isLogout ? (zIndex = 1) : (zIndex = -6)

  let profileImage
  nearState.profile.profileImg == "" ? profileImage = "../resources/Rectangle 321a.png" : profileImage = nearState.profile.profileImg

  return isCircle ? (
    <CircleList toggle={props.wallet} />
  ) : (
    <Box w="257.56px" h="739.8px" bgColor="#191919"


    >
      {/* main profile */}
      <Box
        h="428.81px"
        w="257.56px"
        // bgColor="rgba(0, 0, 0, 0.1)"
        // bgColor="#191919"
        bgImage={
          !nearState.profile.profileImg.includes(".glb")
            ? `url('${nearState.profile.profileImg}')`
            : "none"
        }
        fontFamily="Poppins"
        bgRepeat="no-repeat"
        bgSize="257.56px 378.12px"
        top="0"

      // bgPosition="top center"
      >
        <Image
          src={"../resources/Group 14756.png"}
          w="27.4px"
          mt="16.44px"
          ml="16.44px"
          cursor="pointer"
          onClick={() => props.toggle()}
        />
        <Flex
          position="absolute"
          flexDirection="column"
          top="16.44px"
          right="16.44px"
          bgColor="#FFFFFF26"
          w="38.36px"
          h="332.91px"
          borderRadius="6.85px"
          gap="16.44px"
          pt="10.96px"
          px="5.48px"
        >
          <Image src={"../resources/Frame 140a.png"} cursor="pointer" />
          <Image src={"../resources/Group a.png"} cursor="pointer" />
        </Flex>
        <Center
          display="flex"
          flexDirection="column"
          mt="310.27px"
          bgGradient="linear(to-b, #1f1f1f 0%, #191919 100%)"
        >
          <Text fontSize="21.92px" color="#ffffff" fontWeight="700">
            {nearState.profile.fullName}
          </Text>
          <Text
            fontSize="12.33px"
            fontWeight="500"
            mb="5.48px"
            fontStyle="italic"
            color="#FFFFFFB2"
          >
            {nearState.profile.username}
          </Text>
          <Flex justifyContent="center" gap="5.48px">
            <Image src={"../resources/Ellipse 702a.png"} />
            <Text
              fontSize="9.59px"
              fontWeight="400"
              color="rgba(255, 255, 255, 0.5)"
            >
              Aura: 2k
            </Text>
          </Flex>
        </Center>
      </Box>

      {/* images carousel */}

      <Box
        bgColor="#1F1F1F;"
        width="257.56px"
        position="absolute"
        h="295.92px"
        borderTopRadius="34.25px"
        top="443.88px"
      >
        <Center>
          <div
            className="m cursor-pointer  hover:bg-[#ffffff39]  flex flex-col
        background-#1F1F1F
        gap-0.5
  
        mt-2
       "
            onClick={switchCircle}
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
        >
          Circles
        </Text>
        <Flex
          justifyContent="space-between"
          // flexGrow="2"
          flexDirection="row"
          marginLeft="18.495px"
          mt={4}
          overflow="hidden"
          flex="auto"
          cursor="pointer"
        >
          <Flex
            flexDirection="column"
            alignItems="center"
            width="auto"
            onDoubleClick={(e) => props.doubleClick(e)}
          >
            <Image
              src={ellipse4}
              width="32.88px"
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

          <Flex flexDirection="column" alignItems="center" width="auto">
            <Image
              src={ellipse5}
              width="32.88px"
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
          <Flex flexDirection="column" alignItems="center" width="auto">
            <Image
              src={ellipse4}
              width="32.88px"
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
          <Flex flexDirection="column" alignItems="center" width="auto">
            <Image
              src={ellipse4}
              width="32.88px"
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
          <Flex flexDirection="column" alignItems="center" width="autonp">
            <Image
              src={ellipse4}
              width="32.88px"
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
          </Flex>
        </Flex>
      </Box>

      {/* Wallet */}

      <Box
        bgColor="#242424"
        width="257.56px"
        marginLeft="0"
        borderTopRadius="34.25px"
        position="absolute"
        h="180.84px"
        top="558.96px"
      >
        <Center>
          <div
            className="m cursor-pointer  hover:bg-[#ffffff39]  flex flex-col
        background-#1F1F1F
        gap-0.5
        mt-2
        "
            onClick={props.wallet}
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
          fontFamily="Poppins"
          color="rgba(255, 255, 255, 0.3);"
        >
          Wallet
        </Text>
        <Flex ml="16.44px" mt="10.96px" alignItems="center" gap="42.47px">
          <Text
            fontSize="16.44px"
            fontWeight="700"
            color="#ffffff"
            fontFamily="Poppins"
            cursor="pointer"
          >
            {nearState.aexBalance} AEX
          </Text>
          <Flex>
            <div
              className="cursor-pointer  hover:bg-[#ffffff39]
        background-#1F1F1F
        w-[16.44px]
        h-[16.44px]
        mr-[10.275px]

       "
            >
              <Image
                src={"resources/Download.png"}
                alt="download"
                w="16.44px"
                h="16.44px"
              />
            </div>
            <div
              className="cursor-pointer  hover:bg-[#ffffff39]
        background-#1F1F1F
        w-[16.44px]
        h-[16.44px]
        mr-[10.275px]

       "
              onClick={props.wallet}
            >
              <Image
                src={"resources/Upload.png"}
                alt="upload"
                w="16.44px"
                h="16.44px"
                mr="10.275px"
              />
            </div>
            <div
              className="cursor-pointer  hover:bg-[#ffffff39]
        background-#1F1F1F
        w-[16.44px]
        h-[16.44px]
        mr-[10.275px]

       "
              onClick={props.wallet}
            >
              <Image
                src={"resources/Frame 5556.png"}
                alt="upload"
                w="16.44px"
                h="16.44px"
                mr="10.275px"
              />
            </div>
            <div
              className="cursor-pointer  hover:bg-[#ffffff39]
        background-#1F1F1F
        w-[16.44px]
        h-[16.44px]
        mr-[10.275px]

       "
              onClick={props.wallet}
            >
              <Image
                src={"resources/plant 1.png"}
                alt="upload"
                w="16.44px"
                h="16.44px"
                mr="10.275px"
              />
            </div>
          </Flex>
        </Flex>

        <Flex mt="16.44px" gap="5.48px" mx="16.44px">
          <Flex
            gap="5.48px"
            justifyContent="center"
            alignItems="center"
            w="71.24px"
            h="32.88px"
            bgColor="#FFFFFF08"
            borderRadius="10.275px"
            fontFamily="Poppins"
            cursor="pointer"
          >
            <Image
              src={"../resources/Ticket Star.png"}
              w="16.44px"
              h="16.44px"
            />
            <Text color="#ffffff" fontSize="10.96px" fontWeight="274">
              Art
            </Text>
          </Flex>

          <Flex
            gap="5.48px"
            justifyContent="center"
            alignItems="center"
            w="71.24px"
            h="32.88px"
            bgColor="#FFFFFF08"
            borderRadius="10.275px"
            fontFamily="Poppins"
            cursor="pointer"
          >
            <Image src={"../resources/Ticket11.png"} w="16.44px" h="16.44px" />
            <Text color="#ffffff" fontSize="10.96px" fontWeight="274">
              Ticket
            </Text>
          </Flex>

          <Flex
            gap="5.48px"
            justifyContent="center"
            alignItems="center"
            w="71.24px"
            h="32.88px"
            bgColor="#FFFFFF08"
            borderRadius="10.275px"
            fontFamily="Poppins"
            cursor="pointer"
          >
            <Image src={"../resources/Star11.png"} w="16.44px" h="16.44px" />
            <Text color="#ffffff" fontSize="10.96px" fontWeight="274">
              Other
            </Text>
          </Flex>
        </Flex>
        <Flex mt="21.92px" mx="57.54px" gap="21.92px">
          <Flex
            alignItems="center"
            justifyContent="center"
            w="32.88px"
            h="32.88px"
            border="1px solid rgba(255, 255, 255, 0.1)"
            borderRadius="100px"
            boxSizing="border-box"
            cursor="pointer"
          >
            <Image src={"../resources/Setting.png"} w="21.92px" h="21.92px" />
          </Flex>

          <Flex
            alignItems="center"
            justifyContent="center"
            w="32.88px"
            h="32.88px"
            border="1px solid rgba(255, 255, 255, 0.1)"
            borderRadius="100px"
            boxSizing="border-box"
            cursor="pointer"
          >
            <Text
              color="#ffffff"
              marginTop={-5}
              marginLeft={5}
              position="absolute"
              backgroundColor="red"
              px="6px"
              py="2px"
              borderRadius="100%"
              fontFamily="Poppins"
              fontWeight="500"
              fontSize="9.59px"
            >
              {" "}
              3
            </Text>
            <Image
              src={"../resources/Notification.png"}
              w="21.92px"
              h="21.92px"
            />
          </Flex>

          <Flex
            alignItems="center"
            justifyContent="center"
            w="32.88px"
            h="32.88px"
            border="1px solid rgba(255, 255, 255, 0.1)"
            borderRadius="100px"
            boxSizing="border-box"
            cursor="pointer"
            onClick={logOutUser}
          >
            <Image src={"../resources/Logout.png"} w="21.92px" h="21.92px" />
          </Flex>
        </Flex>
      </Box>
      <LogOut zIndex={zIndex} revert={logOutUser} />
    </Box>
  );
}

export default NewProfile;
