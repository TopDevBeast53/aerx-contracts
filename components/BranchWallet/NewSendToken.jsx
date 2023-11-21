import React from "react";
import {
  Box,
  Text,
  Center,
  Flex,
  Image,
  Select,
  Input,
  Button,
  color,
} from "@chakra-ui/react";
import { MinusIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { nearStore } from "../../store/near";
import { Big } from "big.js";
import { initNear, loadOtherContract } from "../../lib/otherContracts";

function SendTokens(props) {
  const nearState = nearStore((state) => state);

  const [amount, setAmount] = React.useState("");
  const [receiver, setReceiver] = React.useState("");
  const [isProceed, setProceed] = React.useState(false);
  const [coins, setCoins] = React.useState("AEX");
  const [isCoins, isSetCoins] = React.useState("false");
  const [amountColor, setAmountColor] = React.useState("rgba(255, 255, 255, 0.3)");



  const handleCoin = (coin) => {
    setCoins(coin)
    isSetCoins((prevState) => !prevState)
    console.log(coins)
  }

  const handleAmount = (event) => {
    const value = event.target.value;
    if (value > 0 && value <= nearState.aexBalance) {
      setAmountColor("rgba(255, 255, 255, 0.3)")
      const inputBigN = new Big(value || 0);
      const formattedInput = inputBigN.mul("10e23").toFixed(0);
      setAmount(formattedInput);
    } else {
      setAmountColor("#DB3333")
    }
  };
  const conversion = (amount / 111) * 4.16
  const handleUser = async (event) => {
    const value = event.target.value;
    const isRegistered = await nearState.pnftContract.has_registered({
      user_id: value,
    });
    if (isRegistered) {
      setProceed(true);
      setReceiver(value);
    } else {
      setProceed(false);
    }
  };

  const transferAex = async () => {
    console.log("Send button clicked");
    if (coins == "NEAR") {
      await initNear();
      console.log(nearState.nearAccount)
      // console.log("Details: ", amount, receiver);
      // try {
      //   await nearState.nearAccount.sendMoney(
      //     {
      //       receiverId: `${receiver}`, // receiver account
      //       amount: `${amount}` // amount in yoctoNEAR
      //     }

      //   );

      // } catch (err) {
      //   console.error("Unable to send Near", err)

      // }

    }
    if (coins == "AEX") {
      console.log("Details: ", amount, receiver);

      try {
        await nearState.tokenContract.ft_transfer({
          receiver_id: receiver,
          amount: amount,
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
  };

  let bgColor;
  let disabled;
  let colorChange

  // amount.length < 1 ? (bgColor = "#FFFFFF1D;") : (bgColor = "#6054F0");
  amount.length < 1 ? (disabled = true) : (disabled = false);



  if (isProceed) {
    colorChange = "#19C486";
    disabled = false
    if (amount == "") {
      disabled = true
    }
    if (amountColor == "#DB3333") {
      disabled = true;
    }
    if (receiver == nearState.accountId) {
      disabled = true;
    }
  } else {
    colorChange = "#DB3333";
    disabled = true

  }



  return (
    <Box
      height="100%"
      w="257.56px"
      bgColor="#1f1f1f;"
      position="absolute"
      top="0"
    >
      <Center borderRadius="50px 50px 0px 0px" zIndex={6} >
        <Button
          onClick={() => {
            props.toggleWallet
            props.upload(false)
          }}
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
        mb="204.13px"
        mx="16.44px"
        fontFamily="Poppins"
        fontSize="10.96px"
        fontWeight="400"
      >
        <Flex
          gap="5.48px"
          alignItems="center"
          onClick={props.upload}
          cursor="pointer"
          mb="204.13px"
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
          Send Tokens
        </Text>
      </Center>
      <Flex
        mb="5.48px"
        w="191.8px"
        h="38.36px"
        bgColor="#191A1B"
        borderRadius="10.275px"
        mx="32.88px"
        p="8.22px"
        alignItems="center"
        fontSize="10.96px"
        color="white"
        fontFamily="Poppins"
        fontWeight="342.5px"
        gap="10.96px"
      >
        {!isCoins &&

          <Flex
            alignItems="center"
            width="65.075px"
            height="21.92px"
            gap="5.48px"
            onClick={() => handleCoin("AEX")}
            cursor="pointer"
          >
            {/* <Image src={"../resources/Group 14350.png"} /> */}

            <Image src={"../resources/Group 143505.png"} />
          </Flex>

        }
        {isCoins &&

          <Flex
            alignItems="center"
            width="65.075px"
            height="21.92px"
            gap="5.48px"
            onClick={(a) => handleCoin("NEAR")}
            cursor="pointer"

          >

            <Image src={"../resources/Group 140312.png"} w="21.92px" h="21.92px" />
            <Text color="rgba(255, 255, 255, 0.3)" fontSize="10.96px">
              NEAR
            </Text>
            <Image src="../resources/Vector 933.png" w="4px" />

          </Flex>
        }


        {/* <Flex
          alignItems="center"
          width="65.075px"
          height="21.92px"
          gap="5.48px"
        >
          <Image src={"../resources/Group 140312.png"} w="21.92px" h="21.92px" />
          <Text color="rgba(255, 255, 255, 0.3)" fontSize="10.96px">
            NEAR
          </Text>
        </Flex> */}

        {/* <Image src={"../resources/Vector 976.png"} /> */}

        <div>
          <input
            type="number"
            placeholder="0"
            onChange={handleAmount}
            style={{
              backgroundColor: "#191a1b",
              color: amountColor,
              width: "65.075px",
              height: "21.92px",

            }}

          />
        </div>
      </Flex>
      <Center fontFamily="Poppins" mb="10.96px">
        <Text fontSize="10.96px" color="rgba(255, 255, 255, 0.3)">
          ≈ {conversion} USD
        </Text>
      </Center>

      <Box mb="16.44px">
        <Input
          placeholder="account id"
          color={colorChange}
          fontFamily="Poppins"
          fontSize="10.96px"
          alignSelf="center"
          width="191.8px"
          height="38.36px"
          backgroundColor="#191A1B"
          borderRadius="10.275px"
          marginInline="32.88px"
          border="2px"
          borderColor={colorChange}
          paddingInline="16.44px"
          fontWeight="500"
          onChange={(e) => handleUser(e)}
          _focusVisible={{
            outline: "none",
          }}
        />
        {isProceed && (
          <Image
            src={"../resources/akar-icons_circle-check1.png"}
            w="21.92px"
            h="21.92px"
            position="relative"
            left="190px"
            top="-30px"
            cursor="pointer"
          />
        )}
        {!isProceed && (
          <Image
            src={"../resources/akar-icons_circle-check.png"}
            w="21.92px"
            h="21.92px"
            position="relative"
            left="190px"
            top="-30px"
            cursor="pointer"
          />
        )}
      </Box>

      <Center mb="21.92px">
        <Button
          disabled={disabled}
          onClick={transferAex}
          fontFamily="Poppins"
          fontSize="10.96px"
          color="#ffffff"
          // opacity="0.3"
          fontWeight="600"
          bgColor={bgColor}
          w="191.8px"
          h="38.36px"
          cursor="pointer"
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

      <Flex
        alignItems="center"
        flexDirection="column"
        gap="5.48px"
        fontFamily="Poppins"
        fontSize="9.59px"
        fontWeight="400"
      >
        <Text color="#ffffff4d">Available to send</Text>
        {!isCoins ?

          <Text color="#ffffff4d">{nearState.aexBalance} AEX</Text>
          :
          <Text color="#ffffff4d">{nearState.nearBalance} NEAR</Text>
        }
      </Flex>
    </Box>
  );
}

export default SendTokens;

{
  /* <div>
          <select
            style={{
              backgroundColor: "#191a1b",
              color="rgba(255, 255, 255, 0.3)"
              width="65.075px"
              height="21.92px"
            }}
          >
            <option>
              <label>
                 <img
                  src="../resources/Group 14031.png"
                  w="21.92px"
                  h="21.92px"
                /> 
                <Image src={"../resources/.png"} w="21.92px" h="21.92px" />

                <Text>AEX</Text>
              </label>
            </option>
            <option>
              <label>
                <Image src={"../resources/.png"} w="21.92px" h="21.92px" />
                 <img
                  src="../resources/Group 14031.png"
                  w="21.92px"
                  h="21.92px"
                /> 
                <Text>NEAR</Text>
              </label>
            </option>
          </select>
        </div> */
}

{
  /* <div>
          <img src="../resources/Vector 976.png" alt="" />
        </div>

        <Image src={"../resources/Vector 976.png""} />



        <div>
          <input
            type="number"
            placeholder="0"
            style={{
              backgroundColor: "#191a1b",
              color: "rgba(255, 255, 255, 0.3)",
              width: "65.075px",
              height: "21.92px",
            }}
          />
        </div> */
}
