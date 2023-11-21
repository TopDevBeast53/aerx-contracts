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
} from "@chakra-ui/react";
import { MinusIcon } from "@chakra-ui/icons";
import { nearStore } from '../../store/near';
import { Big } from "big.js";
import toast from 'react-hot-toast';

const nearToken = "nearnativetoken.near";
function Exchange(props) {
  const [isExchange, setExchange] = React.useState(false);
  const [convertedNear, setConvertedNear] = React.useState(0);
  const [convertedAex, setconvertedAex] = React.useState(0);
  const [minimumNear, setMinimumNear] = React.useState(0);
  const [minimumAex, setMinimumAex] = React.useState(0);
  const [tolerance, setTolerance] = React.useState(0.1);
  const [expectedReturnNear, setExpectedReturnNear] = React.useState();
  const [expectedReturnAex, setExpectedReturnAex] = React.useState();
  const [minExpectedNear, setMinExpectedNear] = React.useState();
  const [minExpectedAex, setMinExpectedAex] = React.useState();
  const [amountToSwapNear, setAmountToSwapNear] = React.useState("");
  const [amountToSwapAex, setAmountToSwapAex] = React.useState("");
  const [amountToSwapOthers, setAmountToSwapOthers] = React.useState("");
  const [tokenFrom, setTokenFrom] = React.useState(process.env.NEXT_PUBLIC_TOKEN_ID);
  const [pointerColour, setPointerColour] = React.useState({
    colour1: "#ffffff",
    colour2: "#FFFFFF4D;",
    colour3: "#FFFFFF4D;",
  });
  const [inputonFocus, setInputonFocus] = React.useState(false);
  const nearState = nearStore((state) => state);

  const swapCapture = () => {
    if (tokenFrom == process.env.NEXT_PUBLIC_TOKEN_ID) {
      setTokenFrom(nearToken)
    } else {
      setTokenFrom(process.env.NEXT_PUBLIC_TOKEN_ID)
    }
  }

  const swap = () => {
    setExchange((prevState) => !prevState);
  };

  const handleSwapAex = async (e) => {
    if (tokenFrom == process.env.NEXT_PUBLIC_TOKEN_ID) {
      const inputBigN = new Big(e.target.value || 0);
      const formattedInput = inputBigN.mul("10e23").toFixed(0);
      setAmountToSwapAex(formattedInput);
      const expectedReturn = await nearState.DexContract.get_return_amount_in_u128({
        pool_id: 1, amount_to_swap: formattedInput, token_from: process.env.NEXT_PUBLIC_TOKEN_ID, token_to: nearToken
      });
      const priceFromPool = await nearState.DexContract.get_price_from_pool({
        pool_id: 1, token_id: process.env.NEXT_PUBLIC_TOKEN_ID
      })
      const expectedReturnRaw = expectedReturn / 1000000000000000000000000;
      const expectedReturnBigN = new Big(expectedReturnRaw || 0);
      const formattedExpectedReturn = expectedReturnBigN.mul("10e23").toFixed(0);
      setExpectedReturnNear(formattedExpectedReturn)
      const slippagePercentage = tolerance / 100;
      const slippageAmount = slippagePercentage * expectedReturn;
      const minReturn = expectedReturn - slippageAmount;
      const minReturnRaw = minReturn / 1000000000000000000000000;
      const minReturnBigN = new Big(minReturnRaw || 0)
      const formattedMinReturn = minReturnBigN.mul("10e23").toFixed(0);
      setMinExpectedNear(formattedMinReturn)
      const PriceBigN = new Big(priceFromPool || 0);
      const formattedPrice = PriceBigN.div("10e23").toFixed(4);
      if (0 >= formattedPrice) {
        const Price = parseFloat(priceFromPool / 1000000000000000000000000).toFixed(4);
        const calculatedOutput = Price * e.target.value;
        setConvertedNear(parseFloat(calculatedOutput).toFixed(4));
        const slippagePercentageEffect = slippagePercentage * calculatedOutput;
        const amountDueToSlippage = calculatedOutput - slippagePercentageEffect;
        setMinimumNear(parseFloat(amountDueToSlippage).toFixed(4));

      } else {
        const calculatedOutput = formattedPrice * e.target.value;
        setConvertedNear(parseFloat(calculatedOutput).toFixed(4));
        const slippagePercentage = tolerance / 100;
        const slippagePercentageEffect = slippagePercentage * calculatedOutput;
        const amountDueToSlippage = calculatedOutput - slippagePercentageEffect;
        setMinimumNear(parseFloat(amountDueToSlippage).toFixed(4));
      }
    }
  };

  const getMinimumNear = () => {
    const slippagePercentage = tolerance / 100;
    const slippageAmount = slippagePercentage * expectedReturnNear;
    const minReturn = expectedReturnNear - slippageAmount;
    const minReturnRaw = minReturn / 1000000000000000000000000;
    const minReturnBigN = new Big(minReturnRaw || 0);
    const formattedMinReturn = minReturnBigN.mul("10e23").toFixed(0);
    setMinExpectedNear(formattedMinReturn)
    const slippagePercentageEffect = slippagePercentage * convertedNear;
    const amountDueToSlippage = convertedNear - slippagePercentageEffect;
    setMinimumNear(parseFloat(amountDueToSlippage).toFixed(4));
  }

  const handleSwapNear = async (e) => {
    if (tokenFrom == nearToken) {
      const inputBigN = new Big(e.target.value || 0);
      const formattedInput = inputBigN.mul("10e23").toFixed(0);
      setAmountToSwapNear(formattedInput);
      const expectedReturn = await nearState.DexContract.get_return_amount_in_u128({
        pool_id: 1, amount_to_swap: formattedInput, token_from: nearToken, token_to: process.env.NEXT_PUBLIC_TOKEN_ID
      });
      const priceFromPool = await nearState.DexContract.get_price_from_pool({
        pool_id: 1, token_id: nearToken
      });
      const expectedReturnRaw = expectedReturn / 1000000000000000000000000;
      const expectedReturnBigN = new Big(expectedReturnRaw || 0);
      const formattedExpectedReturn = expectedReturnBigN.mul("10e23").toFixed(0);
      setExpectedReturnAex(formattedExpectedReturn)
      const slippagePercentage = tolerance / 100;
      const slippageAmount = slippagePercentage * expectedReturn;
      const minReturn = expectedReturn - slippageAmount;
      const minReturnRaw = minReturn / 1000000000000000000000000;
      const minReturnBigN = new Big(minReturnRaw || 0)
      const formattedMinReturn = minReturnBigN.mul("10e23").toFixed(0);
      setMinExpectedAex(formattedMinReturn)
      const PriceBigN = new Big(priceFromPool || 0);
      const formattedPrice = PriceBigN.div("10e23").toFixed(4);
      if (0 >= formattedPrice) {
        const Price = parseFloat(priceFromPool / 1000000000000000000000000).toFixed(4);
        const calculatedOutput = Price * e.target.value;
        setconvertedAex(parseFloat(calculatedOutput).toFixed(4));
        const slippagePercentageEffect = slippagePercentage * calculatedOutput;
        const amountDueToSlippage = calculatedOutput - slippagePercentageEffect;
        setMinimumAex(parseFloat(amountDueToSlippage).toFixed(4));
      } else {
        const calculatedOutput = formattedPrice * e.target.value;
        setconvertedAex(parseFloat(calculatedOutput).toFixed(4));
        const slippagePercentage = tolerance / 100;
        const slippagePercentageEffect = slippagePercentage * calculatedOutput;
        const amountDueToSlippage = calculatedOutput - slippagePercentageEffect;
        setMinimumAex(parseFloat(amountDueToSlippage).toFixed(4));
      }
    } else {
      setAmountToSwapOther(e.target.value)
      //Todo: handle convertion
    }

  };
  const getMinimumAex = () => {
    const slippagePercentage = tolerance / 100;
    const slippageAmount = slippagePercentage * expectedReturnAex;
    const minReturn = expectedReturnAex - slippageAmount;
    const minReturnRaw = minReturn / 1000000000000000000000000;
    const minReturnBigN = new Big(minReturnRaw || 0);
    const formattedMinReturn = minReturnBigN.mul("10e23").toFixed(0);
    setMinExpectedAex(formattedMinReturn)
    const slippagePercentageEffect = slippagePercentage * convertedAex;
    const amountDueToSlippage = convertedAex - slippagePercentageEffect;
    setMinimumAex(parseFloat(amountDueToSlippage).toFixed(4));
  };

  const slippageCoverForClick = (slip) => {
    setTolerance(slip)
    handlePointerColour(slip)
    setInputonFocus(false)
  };

  const handlePointerColour = (slip) => {
    if (slip == 0.1) {
      setPointerColour({
        colour1: "#ffffff",
        colour2: "#FFFFFF4D;",
        colour3: "#FFFFFF4D;",
      })
    }
    if (slip == 0.5) {
      setPointerColour({
        colour1: "#FFFFFF4D;",
        colour2: "#ffffff",
        colour3: "#FFFFFF4D;",
      })
    }
    if (slip == 1) {
      setPointerColour({
        colour1: "#FFFFFF4D;",
        colour2: "#FFFFFF4D;",
        colour3: "#ffffff",
      })
    }

  }

  const handleSlippageCoverForClick = () => {
    getMinimumNear();
    getMinimumAex();
  }


  const slippageCoverForInput = (e) => {
    //Todo: warn user of frontruning if higher than 9
    setInputonFocus(true)
    setPointerColour({
      colour1: "#FFFFFF4D;",
      colour2: "#FFFFFF4D;",
      colour3: "#FFFFFF4D;",
    })
    if (e.target.value > 100) {
      setTolerance(100)
    } else (
      setTolerance(e.target.value)
    )

  };

  const handleSlippageCoverForInput = () => {
    getMinimumNear();
    getMinimumAex();
  }


  //Todo: handle min expected due to slippage
  const swapToOrFromAex = async () => {
    console.log("Swap button has been clicked");
    if (tokenFrom == process.env.NEXT_PUBLIC_TOKEN_ID) {
      try {
        await nearState.DexContract.swap_aex({
          pool_id: 1,
          token_to: nearToken,
          amount: `${amountToSwapAex}`,
          min_expected: `${minExpectedNear}`,
        }, '300000000000000',
        )
        toast.success("Successfully swapped AEX to NEAR")
      } catch (err) {
        // toast.error("Unable to swap AEX to NEAR")
        console.log("Unable to swap AEX to NEAR due to: ", err)

      }
    } else if (tokenFrom == nearToken) {
      if (amountToSwapNear > 0) {
        try {
          await nearState.DexContract.swap_aex({
            pool_id: 1,
            token_to: process.env.NEXT_PUBLIC_TOKEN_ID,
            amount: `${amountToSwapNear}`,
            min_expected: `${minExpectedAex}`,
          },
            "300000000000000",
            `${amountToSwapNear}`
          )
          toast.success("Successfully swapped NEAR to AEX")
        } catch (err) {
          // toast.error("Unable to swap NEAR to AEX")
          console.log("Unable to swap NEAR to AEX due to: ", err)
        }
      }
    }
  };


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
          onClick={() => {
            props.toggleWallet
            props.exchange(false)
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

      <Flex
        mb="94.53px"
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

      {/* first input */}
      {isExchange ? (
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
          <Flex
            alignItems="center"
            width="65.075px"
            height="21.92px"
            gap="5.48px"
          >
            <Image
              src={"../resources/Group 14030.png"}
              w="21.92px"
              h="21.92px"
            />
            <Text color="rgba(255, 255, 255, 0.3)" fontSize="10.96px">
              NEAR
            </Text>
          </Flex>

          <Image src={"../resources/Vector 976.png"} />

          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              onChange={handleSwapNear}
              type="number"
              placeholder="0"
              name="near"
              style={{
                backgroundColor: "#191a1b",
                color: "rgba(255, 255, 255, 0.3)",
                width: "65.075px",
                height: "21.92px",
              }}
            />
            <label style={{ color: "#FFFFFF26" }}>MAX</label>
          </div>
        </Flex>
      ) : (
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
          <Flex
            alignItems="center"
            width="65.075px"
            height="21.92px"
            gap="5.48px"
          >
            <Image
              src={"../resources/Group 14031.png"}
              w="21.92px"
              h="21.92px"
            />
            <Text color="rgba(255, 255, 255, 0.3)" fontSize="10.96px">
              AEX
            </Text>
          </Flex>

          <Image src={"../resources/Vector 976.png"} />

          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              onChange={handleSwapAex}
              type="number"
              name="aex"
              placeholder="0"
              style={{
                backgroundColor: "#191a1b",
                color: "rgba(255, 255, 255, 0.3)",
                width: "65.075px",
                height: "21.92px",
              }}
            />
            <label style={{ color: "#FFFFFF26", cursor: "pointer" }}>MAX</label>
          </div>
        </Flex>
      )}
      {isExchange ?

        <Text
          mb="10.96px"
          textAlign="center"
          fontFamily="Poppins"
          fontWeight="400"
          fontSize="9.59"
          color="#FFFFFF4D"
        >
          Available: {nearState.nearBalance} NEAR
        </Text>
        :
        <Text
          mb="10.96px"
          textAlign="center"
          fontFamily="Poppins"
          fontWeight="400"
          fontSize="9.59"
          color="#FFFFFF4D"
        >
          Available: {nearState.aexBalance} AEX
        </Text>
      }

      {/* INPUT BEFORE SLIPPAGE TOLLERNCE STARTS */}

      <Flex w="191.8px" h="38.36px" mb="10.96px" gap="5.48px" mx="32.88px">
        <Flex
          bgColor="#1B1B1B"
          borderRadius="10.275px"
          justifyItems="center"
          fontFamily="Poppins"
          alignItems="center"
          fontSize="10.96px"
          fontWeight="500"
          py="14.385px"
          px="16.44"
          w="120.56px"
          h="38.36px"
        >
          <Text
            color={pointerColour.colour1}
            cursor="pointer"
            onClick={handleSlippageCoverForClick}
            onClickCapture={() => slippageCoverForClick(0.1)}
            mr="19.18px"
          >
            0.1%
          </Text>

          <Text
            color={pointerColour.colour2}
            // ml="39.045px"
            mr="19.18px"
            cursor="pointer"
            onClick={handleSlippageCoverForClick}
            onClickCapture={() => slippageCoverForClick(0.5)}
          >
            0.5%
          </Text>

          <Text color={pointerColour.colour3} cursor="pointer" onClick={handleSlippageCoverForClick} onClickCapture={() => slippageCoverForClick(1)}>
            1%
          </Text>
        </Flex>
        <input
          onInput={handleSlippageCoverForInput}
          onInputCapture={slippageCoverForInput}
          type="number"
          name="slippageInputTag"
          style={{
            color: "#6054f0",
            textAlign: "center",
            backgroundColor: "#1B1B1B",
            border: "2px solid #6054f0",
            width: "65.76px",
            height: "38.36px",
            borderRadius: "10.275px",
          }}
        ></input>
      </Flex>

      {/* INPUT BEFORE SLIPPAGE TOLLERNCE ENDS */}

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
          onClickCapture={swapCapture}
          onClick={swap}
        />

        <Box
          w="82.85px"
          bgColor="rgba(255, 255, 255, 0.3);"
          height="1px"
          borderRadius="3.425px"
        ></Box>
      </Flex>

      {/* second input */}
      {isExchange ? (
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
          <Flex
            alignItems="center"
            width="65.075px"
            height="21.92px"
            gap="5.48px"
          >
            <Image
              src={"../resources/Group 14031.png"}
              w="21.92px"
              h="21.92px"
            />
            <Text color="rgba(255, 255, 255, 0.3)" fontSize="10.96px">
              AEX
            </Text>
          </Flex>

          <Image src={"../resources/Vector 976.png"} />

          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              disabled="true"
              type="number"
              placeholder={convertedAex}
              style={{
                backgroundColor: "#191a1b",
                color: "rgba(255, 255, 255, 0.3)",
                width: "65.075px",
                height: "21.92px",
                cursor: "not-allowed",
              }}
            />
            {/* <label style={{ color: "#FFFFFF26" }}>MAX</label> */}
          </div>
        </Flex>
      ) : (
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
          <Flex
            alignItems="center"
            width="65.075px"
            height="21.92px"
            gap="5.48px"
          >
            <Image
              src={"../resources/Group 14030.png"}
              w="21.92px"
              h="21.92px"
            />
            <Text color="rgba(255, 255, 255, 0.3)" fontSize="10.96px">
              NEAR
            </Text>
          </Flex>

          <Image src={"../resources/Vector 976.png"} />

          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              disabled="true"
              cursor="not-allowed"
              placeholder={convertedNear}
              type="number
            "
              style={{
                backgroundColor: "#191a1b",
                color: "rgba(255, 255, 255, 0.3)",
                width: "65.075px",
                height: "21.92px",
                cursor: "not-allowed",
              }}
            />
            {/* <label style={{ color: "#FFFFFF26" }}>MAX</label> */}
          </div>
        </Flex>
      )}
      {/* second input end */}

      <Text
        mb="16.44px"
        textAlign="center"
        fontFamily="Poppins"
        fontWeight="400"
        fontSize="9.59"
        color="#FFFFFF4D;"
      >
        1 NEAR = 3.9 AEX
      </Text>

      <Text
        textAlign="center"
        mb="10.96px"
        fontFamily="Poppins"
        fontSize="10.96px"
        fontWeight="342.5"
        color="#ffffff"
      >
        Details
      </Text>

      <Flex
        mb="27.4px"
        w="191.8px"
        mx="32.88px"
        p="10.9px"
        gap="10.96px"
        flexDirection="column"
        bgColor="#191a1b"
        borderRadius="10.275px"
      >
        <Flex
          justifyContent="space-between"
          fontFamily="Poppins"
          fontWeight="274"
          fontSize="9.59px"
        >
          <Text color="rgba(255, 255, 255, 0.3)">Minimum received</Text>
          {isExchange ? (
            <Text
              fontFamily="Poppins"
              fontWeight="400"
              fontSize="9.59"
              color="#FFFFFF4D"
            >
              {minimumAex}
            </Text>
          ) : (
            <Text
              fontFamily="Poppins"
              fontWeight="400"
              fontSize="9.59"
              color="#FFFFFF4D"
            >
              {minimumNear}
            </Text>
          )}
          {/* <Text color="#ffffff">3.9666666</Text> */}
        </Flex>
        <Flex
          justifyContent="space-between"
          fontFamily="Poppins"
          fontWeight="274"
          fontSize="9.59px"
        >
          <Text color="rgba(255, 255, 255, 0.3)">Pool fee</Text>
          <Text color="#ffffff">0.59% / 0.005 NEAR</Text>
        </Flex>
      </Flex>

      <Center>
        <Button
          fontFamily="Poppins"
          fontSize="10.96px"
          color="#ffffff"
          fontWeight="600"
          bgColor="#6054F0;"
          w="191.8px"
          h="38.36px"
          onClick={swapToOrFromAex}
          cursor="pointer"
        >
          <Image src={"../resources/Frame 5556.png"} mr="5.48px" />
          Change
        </Button>
      </Center>
      <Center mt="5px">
        {/* {isExchange ? (
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
            minimuim aex recieved :{m}
          </Text>
        )} */}
      </Center>
    </Box>
  );
}

export default Exchange;
