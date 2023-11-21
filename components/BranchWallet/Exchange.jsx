import React from "react";
import {
  Box,
  Text,
  Center,
  Flex,
  Image,
  Button,
  Input,
  PseudoBox,
  NumberInputField,
  NumberInput
} from "@chakra-ui/react";
import { MinusIcon } from "@chakra-ui/icons";

function Exchange(props) {
  const [isExchange, setExchange] = React.useState(false);
  const [swapValue, setSwapValue] = React.useState({
    near: "",
    aex: "",
  });

  const swap = () => {
    setExchange((prevState) => !prevState);
  };
  const handleSwap = (event) => {
    setSwapValue((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
    console.log(swapValue);
  };

  const [tolerance, setTolerance] = React.useState(0.1);

  const slipPage = (tolerance) => {
    setTolerance(tolerance);
  };
  const swapToken = () => {
    console.log("Swap button has been clicked");
    console.log("minimum Aex: ", minimumAex);
    console.log("minimum Near: ", minimumNear);
  };

  const calculatedAexOutput = swapValue.aex / 111;
  const calculatedNearOutput = 111 * swapValue.near;
  const tolerancePercentage = tolerance / 100;
  const calcDifferenceAex = tolerancePercentage * calculatedAexOutput;
  const calcDifferenceNear = tolerancePercentage * calculatedNearOutput;
  const minimumAex = calculatedAexOutput - calcDifferenceAex;
  const minimumNear = calculatedNearOutput - calcDifferenceNear;

 
  let color1 = "#FFFFFF4D;";
  let color2 = "#FFFFFF4D;";
  let color3 = "#FFFFFF4D;";
  if (tolerance === 0.1) {
    color1 = "#ffffff";
  }
  if (tolerance === 0.5) {
    color2 = "#ffffff";
  }
  if (tolerance === 1) {
    color3 = "#ffffff";
  }

  return (
    <Box
      height="100%"
      w="257.56px"
      bgColor="#1f1f1f"
      position="absolute"
      top="0"
    >
      <Center>
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
      </Center>

      <Flex
        mb="136.315px"
        mx="16.44px"
        gap="160.29px"
        alignItems="center"
        fontFamily="Poppins"
        fontSize="10.96px"
        fontWeight="400"
      >
        <Flex
          gap="5.48px"
          alignItems="center"
          onClick={() => props.exchange()}
          cursor="pointer"
        >
          <Image
            src={"../resources/Arrow - Right1.png"}
            color="#FFFFFF4D;"
            w="8.25425px"
            h="10.275px"
          />
          <Text color="#FFFFFF4D;">Back</Text>
        </Flex>
        <Text color="#FFFFFF4D;">Pool</Text>
      </Flex>

      <Text
        textAlign="center"
        fontWeight="500"
        fontSize="12.33px"
        fontFamily="Poppins"
        color="#ffffff"
        mb="27.4px"
      >
        Exchange tokens
      </Text>

      <Flex
        mb="10.96px"
        mx="32.88px"
        bgColor="#1B1B1B;"
        borderRadius="10.275px"
        gap="102.75px"
        fontFamily="Poppins"
        alignItems="center"
      >
        {isExchange ? (
          <Flex>
            <div className="w-[191px]">
              <Input
                type="number"
                name="near"
                onChange={handleSwap}
                className="
          h-[28.36px] border-color-white color-white border-black text-white"
              />
            </div>

            <Flex gap="5.48px" ml="-55px" mt="12px">
              <Text color="#FFFFFF33;" fontWeight="400" fontSize="10.96px">
                NEAR
              </Text>

              <Image
                src={"../resources/Group 14030.png"}
                w="16.44px"
                h="16.44px"
              />
            </Flex>
          </Flex>
        ) : (
          <Flex>
            <div className="w-[191px]">
              <Input
                type="number"
                name="aex"
                onChange={handleSwap}
                className="
        h-[28.36px] border-color-white color-white border-black text-white placeholder"
              />
            </div>
            <Flex gap="5.48px" ml="-55px" mt="12px" s>
              <Text color="#FFFFFF33;" fontWeight="400" fontSize="10.96px">
                AEX
              </Text>
              <Image
                src={"../resources/Group 14031.png"}
                w="16.44px"
                h="16.44px"
              />
            </Flex>
          </Flex>
        )}
      </Flex>

      <Text
        mb="10.96px"
        textAlign="center"
        fontFamily="Poppins"
        fontWeight="400"
        fontSize="9.59"
        color="#FFFFFF4D"
      >
        Available: 102.4 NEAR
      </Text>

      <Flex
        mb="10.96px"
        mx="32.88px"
        bgColor="#1B1B1B;"
        borderRadius="10.275px"
        justifyItems="center"
        fontFamily="Poppins"
        alignItems="center"
        fontSize="10.96px"
        fontWeight="500"
        py="14.385px"
        px="16.44"
        gap="23px"
      >
        <Text color={color1} cursor="pointer" onClick={() => slipPage(0.1)}>
          0.1%
        </Text>

        <Text color={color2} cursor="pointer" onClick={() => slipPage(0.5)}>
          0.5%
        </Text>

        <Text color={color3} cursor="pointer" onClick={() => slipPage(1)}>
          1%
        </Text>

      
            <NumberInput
            min={0.0}
            max={20}
            w="257.56"
            h="38.36px"
          >
          <NumberInputField
              color="#ffffff"
              fontSize="10.96px"
              bgColor="#191A1B;"
              border="none"
              borderRadius="10.275px"
              placeholder='111'
             
            />
            </NumberInput>
      </Flex>

      <Text
        mb="27.4px"
        textAlign="center"
        fontFamily="Poppins"
        fontWeight="400"
        fontSize="9.59"
        color="#FFFFFF4D;"
      >
        Slippage Tolerance
      </Text>

      <Flex mb="27.4px" mx="32.88px" gap="9.03515px" alignItems="center">
        <Box
          w="82.85px"
          bgColor="rgba(255, 255, 255, 0.3);"
          height="1px"
          borderRadius="6.85px"
        ></Box>

        <Image
          src={"../resources/Group 1.png"}
          w="16.44px"
          h="16.44px"
          cursor="pointer"
          onClick={() => swap()}
        />

        <Box
          w="82.85px"
          bgColor="rgba(255, 255, 255, 0.3);"
          height="1px"
          borderRadius="3.425px"
        ></Box>
      </Flex>
      <Flex
        mb="10.96px"
        mx="32.88px"
        bgColor="#1B1B1B;"
        borderRadius="10.275px"
        gap="102.75px"
        fontFamily="Poppins"
        alignItems="center"
      >
        {!isExchange ? (
          <Flex>
            <div className="w-[191px]">
              <Input
                disabled
                placeholder={calculatedAexOutput}
                name="near"
                onChange={handleSwap}
                className="
          h-[28.36px] border-color-white  border-black text-white"
              />
            </div>

            <Flex gap="5.48px" ml="-55px" mt="12px">
              <Text color="#FFFFFF33;" fontWeight="400" fontSize="10.96px">
                NEAR
              </Text>

              <Image
                src={"../resources/Group 14030.png"}
                w="16.44px"
                h="16.44px"
              />
            </Flex>
          </Flex>
        ) : (
          <Flex>
            <div className="w-[191px]">
              <Input
                disabled
                placeholder={calculatedNearOutput}
                name="aex"
                onChange={handleSwap}
                className="
        h-[28.36px] border-color-white  border-black text-white "
              />
            </div>
            <Flex gap="5.48px" ml="-55px" mt="12px">
              <Text color="#FFFFFF33;" fontWeight="400" fontSize="10.96px">
                AEX
              </Text>
              <Image
                src={"../resources/Group 14031.png"}
                w="16.44px"
                h="16.44px"
              />
            </Flex>
          </Flex>
        )}
      </Flex>

      <Text
        mb="27.4px"
        textAlign="center"
        fontFamily="Poppins"
        fontWeight="400"
        fontSize="9.59"
        color="#FFFFFF4D;"
      >
        1 NEAR = 3.9 AEX
      </Text>

      <Center>
        <Button
          fontFamily="Poppins"
          fontSize="10.96px"
          color="#ffffff"
          fontWeight="600"
          bgColor="#6054F0;"
          w="191.8px"
          h="38.36px"
          onClick={swapToken}
          cursor="pointer"
        >
          <Image src={"../resources/Frame 5556.png"} mr="5.48px" />
          Change
        </Button>
      </Center>
      <Center mt="5px">
        {!isExchange ? (
          <Text
            fontFamily="Poppins"
            fontWeight="400"
            fontSize="9.59"
            color="#FFFFFF4D"
          >
            minimuim near recieved :{minimumNear}
          </Text>
        ) : (
          <Text
            fontFamily="Poppins"
            fontWeight="400"
            fontSize="9.59"
            color="#FFFFFF4D"
          >
            minimuim aex recieved :{minimumAex}
          </Text>
        )}
      </Center>
    </Box>
  );
}

export default Exchange;
