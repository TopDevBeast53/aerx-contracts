import React from "react";
import {
  Box,
  Text,
  Center,
  Flex,
  Image,
  Input,
  Button,
} from "@chakra-ui/react";
import { MinusIcon } from '@chakra-ui/icons'
import { nearStore } from "../../store/near";
import { transferAexDetailsType } from "../../lib/aexContract";
import { useState } from "react";

function SendingTokens(props) {
  const [transferAexDetails, setTransferAexDetails] = useState({
    receiver: "",
    amount: "",
  });
  const nearState = nearStore((state) => state);
  const getReceiver = (e) => {
    let val = e.target.value;
    setTransferAexDetails({
      receiver: val,
      amount: props.amount + "000000000000000000000000",
    })
  }

  const transferAex = async () => {
    console.log("Send button clicked")
    console.log("Details: ", transferAexDetails)
    try {
      await nearState.tokenContract.ft_transfer({
        receiver_id: transferAexDetails.receiver,
        amount: transferAexDetails.amount,
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
      <Box
        mb="158.235px"
        mx="16.44px"
        fontFamily="Poppins"
        fontSize="10.96px"
        fontWeight="400"
      >
        <Flex gap="5.48px" alignItems="center" mb="202.075px" ml="16.44px" onClick={props.click} cursor="pointer" >
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

      <Center mb="27.4px">
        <Text
          fontFamily="Poppins"
          fontSize="24.66px"
          fontWeight="700"
          color="#ffffff"
        >
          {props.amount}
        </Text>
      </Center >

      <Input
        py="13.7px"
        mx="32.88px"
        w="191.8px"
        h="38.36px"
        mb="10.96px"
        bgColor="#1B1B1B;"
        border="none"
        borderRadius="10.275px"
        placeholder="pashhq.testnet"
        fontFamily="Poppins"
        fontSize="10.96px"
        fontWeight="500"
        color="white"
        onChange={getReceiver}
      />

      <Center mb="21.92px">
        <Button
          fontFamily="Poppins"
          fontSize="10.96px"
          color="#ffffff"
          fontWeight="600"
          bgColor="#6054F0;"
          w="191.8px"
          h="38.36px"
          onClick={transferAex}
        >
          <Image
            src={"../resources/Arrow - Right.png"}
            w="8.25425px"
            h="10.275px"
            mr="5.48px"
          />
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

export default SendingTokens;
