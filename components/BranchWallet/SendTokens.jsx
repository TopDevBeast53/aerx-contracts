import React from "react";
import {
  Box,
  Text,
  Center,
  Flex,
  Image,
  Input,
  Button,
  NumberInput,
  NumberInputField,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInputStepper,
} from "@chakra-ui/react";
import SendingTokens from "./SendingTokens";
import { MinusIcon } from '@chakra-ui/icons'
import { nearStore } from "../../store/near";

function SendTokens(props) {
  const nearState = nearStore((state) => state);

  const [amount, setAmount] = React.useState("")
  const [receiver, setReceiver] = React.useState("")
  const [isProceed, setProceed] = React.useState(false)

  const handleAmount = (event) => {
    setAmount(event.target.value)
    console.log(amount)
  }
  const handleUser = (event) => {
    const value = event.target.value
    try {
      nearState.pnftContract.has_registered({
        user_id:value
      })
    } catch (error) {
      console.log("error body :" ,error.body)
      console.log("error" ,error)

    }
    setReceiver(value)

  
  }
    
    const transferAex = async () => {
      console.log("Send button clicked")
      console.log("Details: ", amount,receiver)
      try {
        await nearState.tokenContract.ft_transfer({
          receiver_id: receiver,
          amount: amount + "000000000000000000000000" ,
          memo: "AEX Transfer",
        },
          "300000000000000",
          "1",
        )
        nearState.setSuccessfulTransfer(true);
        console.log("Transfer successful")
        //show successful page
      } catch (error) {
        console.log("Transfer not successful: ", error)
        //show error page
      }
  
    }




  const handleClick = () => {
    setProceed((prevState) => !prevState)
  }
  let bgColor
  let disabled
  const propsColor = amount.length  < 1  ? bgColor = "#FFFFFF1D;" : bgColor = "#6054F0"
  const propsDisabled = amount.length < 1 ? disabled = true : disabled = false

  return (
    isProceed ? <SendingTokens click={handleClick} amount={amount} toggle={props.toggleWallet} /> :
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
        onClick={() => {
          props.toggleWallet
          props.upload(false)
        }}
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

        <Box
          mb="202.76px"
          mx="16.44px"
          fontFamily="Poppins"
          fontSize="10.96px"
          fontWeight="400"
        >
          <Flex gap="5.48px" alignItems="center" onClick={props.upload} cursor="pointer">
            <Image
              src={"../resources/Arrow - Right1.png"}
              color="#FFFFFF4D;"
              w="8.25425px"
              h="10.275px"
            />
            <Text color="#FFFFFF4D;">Back</Text>
          </Flex>
        </Box>

        <Center mb="32.88px">
          <Text
            fontFamily="Poppins"
            fontSize="12.33px"
            fontWeight="500"
            color="#ffffff"
          >
            Send Tokens
          </Text>
        </Center>

        <Center mb="5.48px">
          <Flex w="257.56px" justifyContent="center">
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
              onChange={(e) => handleAmount(e)}
            />
            <NumberInputStepper>
              <NumberIncrementStepper pr="16px" children="MAX" color="#ffffff4d" border="none" />
            </NumberInputStepper>
          </NumberInput>
          </Flex>
        </Center>
        <Center mb="10.96px">
          <Text
           fontFamily="Poppins"
           fontSize="9.59px"
           fontWeight="400"
           lineHeight="8.22px"
           color="#FFFFFF4D
           "
          >
          ≈ $155.13 USD
          </Text>
        </Center>

        <Input
          type="text"
          py="13.7px"
          mx="32.88px"
          w="191.8px"
          h="38.36px"
          mb="16.44px"
          bgColor="#1B1B1B;"
          border="none"
          borderRadius="10.275px"
          placeholder="User"
          fontFamily="Poppins"
          fontSize="10.96px"
          fontWeight="400"
          color="#ffffff4d"
          onChange={handleUser(e)}
        />

        <Center mb="21.92px">
          <Button
            disabled={disabled}
       
            fontFamily="Poppins"
            fontSize="10.96px"
            color="#ffffff"
            // opacity="0.3"
            fontWeight="600"
            bgColor={bgColor}
            w="191.8px"
            h="38.36px"
            onClick={transferAex}
          >
            <Image src={"../resources/Arrow - Right.png"} w="8.25425px" h="10.275px" mr="5.48px" />
            Send
          </Button>
        </Center>

        <Flex alignItems="center" flexDirection="column" gap="5.48px" fontFamily="Poppins"
          fontSize="9.59px"

          fontWeight="400">
          <Text color="#ffffff4d" >Available to send</Text>
          <Text color="#ffffff4d">{nearState.aexBalance} AEX</Text>
        </Flex>
      </Box>
  );
}

export default SendTokens;
