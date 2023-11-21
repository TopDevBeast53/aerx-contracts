import React from "react";
import {
  Box,
  Text,
  Center,
  Flex,
  Image,
  FormControl,
  Input,
  Select,
  Button,
  NumberInput,
  NumberInputField,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInputStepper,
} from "@chakra-ui/react";
import { MinusIcon } from '@chakra-ui/icons'


function Liquidity(props) {
  return (
    <Box
      height="100%"
      w="257.56px"
      bgColor="#1f1f1f"
      position="absolute"
      top="0"
    >
      <div
        className="m cursor-pointer  hover:bg-[#ffffff39]  flex flex-col
        background-#1F1F1F
        gap-0.5
        mb-[26.825px]
        mt-2
        "
        onClick={props.toggleWallet}
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

      <Box
        mb="137px"
        mx="16.44px"
        fontFamily="Poppins"
        fontSize="10.96px"
        fontWeight="400"
      >
        <Flex gap="5.48px" alignItems="center" mb="202.075px">
          <Image
            src={"../resources/Arrow - Right1.png"}
            color="#FFFFFF4D;"
            w="8.25425px"
            h="10.275px"
          />
          <Text color="#FFFFFF4D;">Back</Text>
        </Flex>
      </Box>

      <Center mb="27.4px">
        <Text
          fontFamily="Poppins"
          fontSize="12.33px"
          fontWeight="500"
          color="#ffffff"
        >
          Add liquidity
        </Text>
      </Center>

      <Flex
        mx="32.88px"
        flexDirection="column"
        gap="0px"
        fontFamily="Poppins"
        fontWeight="500"
        justifyItems="center"
        mb="21.92px"
      >
        <Flex  justifyContent="space-between" alignItems="center">
          <Flex gap="10.96px" alignItems="center">
            <Image src={"../resources/Group 14030.png"} />
            <Text color="#ffffff" fontSize="10.96px">
              NEAR
            </Text>
          </Flex>

          {/* I'll probably change this code because of the max placeholder from here*/}
          <NumberInput
            defaultValue={0.0}
            min={0.0}
            max={20}
            w="113.71px"
            h="38.36px"
          >
            <NumberInputField
              color="#ffffff4d"
              fontSize="10.96px"
              bgColor="#191A1B;"
              border="none"
              borderRadius="10.275px"
              
            />
            <NumberInputStepper>
              <NumberIncrementStepper pr="16px" children="MAX" color="#ffffff4d" border="none"/>
              {/* <NumberDecrementStepper /> */}
            </NumberInputStepper>
          </NumberInput>
            {/* to here */}
        </Flex>
        <Text color="#ffffff4d" fontSize="9.59px" fontWeight="400">
          Balance: 0
        </Text>
      </Flex>

      <Flex
        mx="32.88px"
        flexDirection="column"
        gap="0px"
        fontFamily="Poppins"
        fontWeight="500"
        justifyItems="center"
        mb="27.4px"
      >
        <Flex  justifyContent="space-between" alignItems="center">
          <Flex gap="10.96px" alignItems="center">
            <Image src={"../resources/Group 14031.png"} />
            <Text color="#ffffff" fontSize="10.96px">
              AEX
            </Text>
          </Flex>

          {/* I'll probably change this code because of the max placeholder from here*/}
          <NumberInput
            defaultValue={0.0}
            min={0.0}
            max={20}
            w="113.71px"
            h="38.36px"
          >
            <NumberInputField
              color="#ffffff4d"
              fontSize="10.96px"
              bgColor="#191A1B;"
              border="none"
              borderRadius="10.275px"
              
            />
            <NumberInputStepper>
              <NumberIncrementStepper pr="16px" children="MAX" color="#ffffff4d" border="none"/>
              {/* <NumberDecrementStepper /> */}
            </NumberInputStepper>
          </NumberInput>
            {/* to here */}
        </Flex>
        <Text color="#ffffff4d" fontSize="9.59px" fontWeight="400">
          Balance: 0
        </Text>
      </Flex>

      <Center mb="21.92px">
        <Button
          fontFamily="Poppins"
          fontSize="10.96px"
          color="#ffffff4d"
          fontWeight="600"
          bgColor="#FFFFFF0D"
          w="191.8px"
          h="38.36px"
        >
          
          Add Liquidity
        </Button>
        </Center>
    </Box>
  );
}

export default Liquidity;
