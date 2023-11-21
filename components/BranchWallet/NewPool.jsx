import React from "react";
import {
  Box,
  Text,
  Center,
  Flex,
  Image,
  FormControl,
  Select,
  Button,
  Input,
  NumberInputField,
  NumberInput,
} from "@chakra-ui/react";
import { MinusIcon } from "@chakra-ui/icons";

function NewPool(props) {
  const [poolFee, setPoolFee] = React.useState(0.30);
  const [token, setToken] = React.useState('');
  const [pair, setPair] = React.useState('');
  
  const ChargePool = (fee) => {
      setPoolFee(fee)
  }
  const ChargePoolInput = (event) => {
    setPoolFee((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
    console.log(poolFee)
  
  }
  const SelectToken = (event) => {
    setPoolFee((prevState) => ({
      prevState,
      [event.target.name]: event.target.value,
    }));
    console.log(token)
  
  }
  const SelectPair = (event) => {
    setPoolFee((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
    console.log(token)
  
  }





  let color1Bg = "";
  let color2Bg = "";
  let color3Bg = "";
  let color1 = "#ffffff4d";
  let color2 = "#ffffff4d";
  let color3 = "#ffffff4d";
  if (poolFee === 0.30) {
    color1Bg = "#6054F0";
    color1 = "#ffffff";

  }
  if (poolFee === 0.50) {
    color2Bg = "#6054F0";
    color2 = "#ffffff";

  }
  if (poolFee === 0.70) {
    color3Bg = "#6054F0";
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
            <Center borderRadius="50px 50px 0px 0px" zIndex={6} >
            <Button
              onClick={props.toggleWallet}
              cursor="pointer"
              background="none"
              w="21.92px"
              bgColor="rgba(255, 255, 255, 0.3);"
              height="12px"
              mt="2"
              px="0"
              flexDirection="column"
              gap="2px"
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
            </Button>
          </Center>

      <Box
        mb="137px"
        mx="16.44px"
        fontFamily="Poppins"
        fontSize="10.96px"
        fontWeight="400"
      >
        <Flex
          gap="5.48px"
          alignItems="center"
          mb="137px"
          onClick={() => props.addPool()}
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
      </Box>

      <Center mb="27.4px">
        <Text
          fontFamily="Poppins"
          fontSize="12.33px"
          fontWeight="500"
          color="#ffffff"
        >
          Create new pool
        </Text>
      </Center>

      <Flex
        mb="10.96px"
        fontFamily="Poppins"
        fontWeight="400"
        fontSize="9.59px"
        lineHeight="14.385px"
        gap="91.79px"
        justifyContent="center"
      >
        <Text color="#FFFFFF4D;">Token</Text>

        <Text
          color="#FFFFFF4D;
"
        >
          Pair
        </Text>
      </Flex>

      <Flex mb="21.92px" gap="5.48px" mx="16.44px">
        <Box
          w="109.6px"
          h="38.36px"
          bgColor="#1A1B1B;"
          borderRadius="10.275px"
          fontFamily="Poppins"
          fontWeight="400"
          fontSize="10.96px"
          color="#ffffff"
        >
          <FormControl>
            <Select
              color="#ffffff"
              fontWeight="400"
              fontSize="10.96px"
              placeholder="AEX"
              border="none"
              onChange={(e) => SelectToken(e)}
            >
              <option value="AEX">AEX</option>
              <option value="NEAR">NEAR</option>
            </Select>
          </FormControl>
        </Box>
        <Box
          w="109.6px"
          h="38.36px"
          bgColor="#1A1B1B;"
          borderRadius="10.275px"
          fontFamily="Poppins"
          fontWeight="400"
          fontSize="10.96px"
          color="#ffffff"
        >
          <FormControl>
            <Select
              color="#ffffff"
              fontWeight="400"
              fontSize="10.96px"
              placeholder="NEAR-AEX"
              border="none"
              onChange={(e) => SelectPair(e)}

            >
              <option value="AEX-NEAR">AEX-NEAR</option>
              <option value="NEAR-AEX">NEAR-AEX</option>
            </Select>
          </FormControl>
        </Box>
      </Flex>

      <Text
        mb="10.96px"
        textAlign="center"
        color="#ffffff4d"
        fontFamily="Poppins"
        fontWeight="400"
        fontSize="9.56px"
      >
        Total fee
      </Text>

      <Flex
        mb="21.92px"
        mx="16.44px"
        alignItems="center"
        gap="16.44px"
        fontFamily="Poppins"
        fontWeight="500"
        fontSize="10.96px"
      >
        <Flex bgColor="#1a1b1b" borderRadius="10.275px">
          <Text
            bgColor={color1Bg}
            color={color1}
            borderRadius="10.275px"
            py="10.96px"
            px="13.7px"
            onClick={() => ChargePool(0.30)}
            cursor="pointer"
          >
            0.30%
          </Text>
          <Text
            bgColor={color2Bg}
            color={color2}
            borderRadius="10.275px"
            py="10.96px"
            px="13.7px"
            onClick={() => ChargePool(0.50)}
            cursor="pointer"
          >
            0.50%
          </Text>
          <Text
            bgColor={color3Bg}
            color={color3}
            borderRadius="10.275px"
            py="10.96px"
            px="13.7px"
            onClick={() => ChargePool(0.70)}
            cursor="pointer"
          >
            0.70%
          </Text>
       
          <Input
              color="#ffffff"
              fontSize="10.96px"
              bgColor="#191A1B;"
              border="2px"
              borderRadius="10.275px"
              ml="2%"
              
            w="61.56px"
            onChange={(e) => ChargePoolInput(e)}

             
            >
            </Input>
        </Flex>
       
       
      </Flex>
    
      <Flex
        mb="27.4px"
        mx="16.44px"
        borderRadius="10.275px"
        bgColor="#1a1b1b"
        flexDirection="column"
        gap="10.96px"
        mr="16.44px"
        fontFamily="Poppins"
        fontWeight="400"
        fontSize="9.59px"
        p="10.96px"
      >
        <Flex justifyContent="space-between">
          <Text color="#ffffff4d">I.P fee</Text>
          <Text color="#ffffff">0%</Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text color="#ffffff4d">Protocol fee</Text>
          <Text color="#ffffff">0%</Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text color="#ffffff4d">Referral fee</Text>
          <Text color="#ffffff">0%</Text>
        </Flex>
      </Flex>

      <Center>
        <Button
          fontFamily="Poppins"
          fontSize="10.96px"
          color="#ffffff"
          fontWeight="600"
          bgColor="#6054F0;"
          w="224.68px"
          h="38.36px"
        >
          Create
        </Button>
      </Center>
    </Box>
  );
}

export default NewPool;
