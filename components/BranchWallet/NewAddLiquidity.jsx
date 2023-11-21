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
import { nearStore } from "../../store/near";
import { Big } from "big.js";
import toast, { Toaster } from 'react-hot-toast';

function NewAddLiquidity(props) {
  const [deposit, setDeposit] = React.useState("");
  const [convertedAex, setconvertedAex] = React.useState(0);
  const [minimumAex, setMinimumAex] = React.useState(0);
  const [tolerance, setTolerance] = React.useState(0.1);
  const [pointerColour, setPointerColour] = React.useState({
    colour1: "#ffffff",
    colour2: "#FFFFFF4D;",
    colour3: "#FFFFFF4D;",
  });
  const nearState = nearStore((state) => state);
  //Todo: handle min expected due to slippage
  const lendNear = async () => {
    console.log(`${deposit * 1000000000000000000000000}`)
    console.log("Add liquidity has been clicked");
    if (deposit > 0) {
      try {
        await nearState.DexContract.lend({
          pool_id: 1,
          equivalent_aex: `${convertedAex}`,
        },
          "300000000000000",
          `${deposit * 1000000000000000000000000}`
        );
        toast.success("LIquidity added Successfully")
        console.log("LIquidity added Successfully");
      } catch (err) {
        toast.error("Unable to add liquidity")
        console.error("Unable to add liquidity due to: ", err)
      }
    }
  };

  const handleSetDeposit = async (e) => {
    const priceFromPool = await nearState.DexContract.get_price_from_pool({
      pool_id: 1, token_id: "nearnativetoken.near"
    });
    const PriceBigN = new Big(priceFromPool || 0);
    const formattedPrice = PriceBigN.div("10e23").toFixed(4);
    if (0 >= formattedPrice) {
      const Price = parseFloat(priceFromPool / 1000000000000000000000000).toFixed(4);
      const calculatedOutput = Price * e.target.value;
      setconvertedAex(parseFloat(calculatedOutput).toFixed(4));
      const slippagePercentage = tolerance / 100;
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
  }

  const getMinimumAex = () => {
    const slippagePercentage = tolerance / 100;
    const slippagePercentageEffect = slippagePercentage * convertedAex;
    const amountDueToSlippage = convertedAex - slippagePercentageEffect;
    setMinimumAex(parseFloat(amountDueToSlippage).toFixed(4));
  };

  const handleDepositCapture = (e) => {
    setDeposit(`${e.target.value}`);
  }

  const slippageCoverForClick = (slip) => {
    setTolerance(slip)
    handlePointerColour(slip)
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
    getMinimumAex();
  }


  const slippageCoverForInput = (e) => {
    //Todo: warn user of frontruning if higher than 9
    if (e.target.value > 100) {
      setTolerance(100)
    } else (
      setTolerance(e.target.value)
    )
  };

  const handleSlippageCoverForInput = () => {
    getMinimumAex();
  }


  return (
    <Box
      height="100%"
      w="257.56px"
      bgColor="#1f1f1f"
      position="absolute"
      top="0"
    >
      {/* drag button */}

      <Center>
        <div
          className="m cursor-pointer  hover:bg-[#ffffff39]  flex flex-col
        background-#1F1F1F
        gap-0.5
        mb-[26.825px]
        mt-2
        "
          onClick={props.toggleWallet}
          cursor="pointer"
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

      {/* back button */}

      <Flex
        mb="160.29px"
        gap="5.48px"
        alignItems="center"
        justifyItems="center"
        ml="16.44px"
        fontFamily="Poppins"
        fontSize="10.96px"
        fontWeight="400"
        onClick={() => props.liquidity()}
        cursor="pointer"
      >
        <Image
          src={"../resources/Arrow - Right1.png"}
          color="#FFFFFF4D;"
          //   w="8.25425px"
          h="10.275px"
        />
        <Text color="#FFFFFF4D;">Back</Text>
      </Flex>

      {/* add liquidity text */}

      <Text
        mb="27.4px"
        textAlign="center"
        fontFamily="Poppins"
        fontSize="12.33px"
        fontWeight="342.5"
        color="#ffffff"
      >
        Add Liquidity
      </Text>

      {/* fisrt input */}

      <Flex
        mb="10.96px"
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
          <Image src={"../resources/Group 14030.png"} w="21.92px" h="21.92px" />
          <Text color="rgba(255, 255, 255, 0.3)" fontSize="10.96px">
            NEAR
          </Text>
        </Flex>

        <Image src={"../resources/Vector 976.png"} />

        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type="number"
            placeholder="0"
            onChangeCapture={handleDepositCapture}
            onChange={handleSetDeposit}
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

      {/* small text below it */}

      <Text
        mb="16.44px"
        textAlign="center"
        fontFamily="Poppins"
        fontWeight="400"
        fontSize="9.59"
        color="#FFFFFF4D"
      >
        Available: {nearState.nearBalance} NEAR
      </Text>

      {/* second input */}

      <Flex
        mb="10.96px"
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
          <Image src={"../resources/Group 14031.png"} w="21.92px" h="21.92px" />
          <Text color="rgba(255, 255, 255, 0.3)" fontSize="10.96px">
            AEX
          </Text>
        </Flex>

        <Image src={"../resources/Vector 976.png"} />

        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type="number"
            placeholder={convertedAex}
            style={{
              backgroundColor: "#191a1b",
              color: "rgba(255, 255, 255, 0.3)",
              width: "65.075px",
              height: "21.92px",
              pointerEvents: "none",
            }}
          />
          <label style={{ color: "#FFFFFF26" }}>MAX</label>
        </div>
      </Flex>

      {/* text under it */}

      <Text
        mb="16.44px"
        textAlign="center"
        fontFamily="Poppins"
        fontWeight="400"
        fontSize="9.59"
        color="#FFFFFF4D"
      >
        Available: {nearState.aexBalance} AEX
      </Text>

      {/* DYNAMIC INPUT */}

      <Flex w="191.8px" h="38.36px" mb="10.96px" gap="5.48px" mx="32.88px">
        <Flex
          bgColor="#1B1B1B;"
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
            onClickCapture={() => slippageCoverForClick(0.1)}
            onClick={handleSlippageCoverForClick}
            mr="19.18px"
          >
            0.1%
          </Text>

          <Text
            color={pointerColour.colour2}
            mr="19.18px"
            cursor="pointer"
            onClickCapture={() => slippageCoverForClick(0.5)}
            onClick={handleSlippageCoverForClick}
          >
            0.5%
          </Text>

          <Text color={pointerColour.colour3} cursor="pointer" onClickCapture={() => slippageCoverForClick(1)} onClick={handleSlippageCoverForClick}>
            1%
          </Text>
        </Flex>

        <input
          type="number"
          onInput={handleSlippageCoverForInput}
          onInputCapture={slippageCoverForInput}
          style={{
            color: "#6054f0",
            textAlign: "center",
            backgroundColor: "#1B1B1B",
            border: "2px solid #6054f0",
            width: "65.76px",
            height: "38.36px",
            borderRadius: "10.275px",
          }}
        />
      </Flex>

      {/* SLIPPAGE TOLERANCE */}

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
      {/* SWAP DETAILS */}

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
          <Text
            fontFamily="Poppins"
            fontWeight="400"
            fontSize="9.59"
            color="#FFFFFF4D"
          >
            {minimumAex}
          </Text>
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

      {/* BUTTON */}

      <Center mb="21.92px">
        <Button
          fontFamily="Poppins"
          fontSize="10.96px"
          color="#ffffff"
          fontWeight="411"
          bgColor="#6054F0"
          w="191.8px"
          h="38.36px"
          letterSpacing="0.02px"
          onClick={lendNear}
        >
          Add Liquidity
        </Button>
      </Center>

      {/* END */}
    </Box>
  );
}

export default NewAddLiquidity;
