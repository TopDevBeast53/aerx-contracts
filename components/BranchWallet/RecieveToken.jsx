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
import { MinusIcon, CopyIcon } from "@chakra-ui/icons";
import { QRCodeSVG } from "qrcode.react";
import { nearStore } from "../../store/near";

function RecieveToken(props) {
  const nearState = nearStore((state) => state);

  const [copiedTimeT, setCopiedTimeT] = React.useState("");
  const [copiedTimeB, setCopiedTimeB] = React.useState("");

  setTimeout(() => {
    setCopiedTimeT(false);
    setCopiedTimeB(false);
  }, 3000);

  const copiedT = () => navigator.clipboard.writeText(nearState.accountId);
  const copiedB = () => navigator.clipboard.writeText(nearState.accountId);
  const popUpT = () => setCopiedTimeT(true);
  const popUpB = () => setCopiedTimeB(true);

  //  setQrCode(QRCode.toDataUrl('abc'))

  return (
    <Box
      height="100%"
      w="257.56px"
      bgColor="#1f1f1f"
      position="absolute"
      top="0"
    >
      <Center borderRadius="50px 50px 0px 0px" zIndex={6}>
        <Button
          onClick={() => {
            props.toggleWallet
            props.recieved(false)
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
          // backgroundColor="#1F1F1F"
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
      {/* end */}

      <Box
        // mb="16.44px"
        mr="16.44px"
        fontFamily="Poppins"
        fontSize="10.96px"
        fontWeight="400"
      >
        <Flex gap="46.98px">
          <Flex
            gap="5.48px"
            alignItems="center"
            mb="16.44px"
            ml="16.44px"
            onClick={props.recieved}
            cursor="pointer"
          >
            <Image
              src={"../resources/Arrow - Right1.png"}
              color="#FFFFFF4D;"
              w="8.25425px"
              h="10.275px"
            />
            <Text color="#FFFFFF4D">Back</Text>
          </Flex>
          <Text
            color="#FFFFFF"
            fontFamily="Poppins"
            fontStyle="normal"
            fontWeight="500"
            fontSize="12.33px"
            lineHeight="18.495px"
          >
            Recieve
          </Text>
        </Flex>
      </Box>
      <Center mb="4%">
        <Flex
          flexDirection="column"
          alightItems="center"
          justifyContent="center"
        >
          <Center>
            <Text
              fontFamily="Poppins"
              font-style="normal"
              fontWeight="400"
              fontSize="12.33px"
              lineHeight="18.495px"
              color="#FFFFFF"
              mb="9.1653px"
            >
              AEX
            </Text>
          </Center>
          <Center mb="21.92px">
            {/* <Image
              src={qrcode}
              w="102.75px"
              h="102.75px"
            /> */}
            <QRCodeSVG size="102.75px" value={nearState.accountId} />
          </Center>
          <Center mb="22.605px">
            <Text
              fontFamily="Poppins"
              fontStyle="normal"
              fontWeight="500"
              fontSize="9.59px"
              color="rgba(255, 255, 255, 0.3)"
            >
              Account id
            </Text>
          </Center>
          <Center mb="10.96px">
            <Flex
              justifyContent="center"
              alignItems="center"
              // padding= "10.96px"
              gap="14.0425px"
              padding="10.96px 16.44px"
              mx="32.88px"
              w="191.8px"
              h="50.69"
              backgroundColor="#FFFFFF0D"
              borderRadius="10.275"
            >
              <Text
                textAlign="center"
                fontFamily="Poppins"
                fontStyle="normal"
                fontWeight="500"
                fontSize="9.59px"
                color="#FFFFFF"
                w="142.48px"
              >
                {nearState.accountId}
              </Text>

              <Image
                onClick={() => {
                  copiedT();
                  popUpT();
                }}
                src="../resources/Group23.png"
                w="10.65px"
                h="13.7px"
                cursor="pointer"
              />
              {copiedTimeT && (
                <Text
                  position="fixed"
                  ml="156px"
                  color="white"
                  bgColor="black"
                  py={2}
                  px={2}
                  fontFamily="Poppins"
                  fontStyle="normal"
                  fontWeight="500"
                  fontSize="9.59px"
                  borderRadius="5px"
                >
                  Copied
                </Text>
              )}
            </Flex>
          </Center>

          <Center>
            {/* <Flex flexDirection="column" alligItems="center"> */}
            <Box
              // padding= "10.96px"

              padding="10.96px 16.44px"
              w="191.8px"
              h="38.36"
              backgroundColor="#FFFFFF0D"
              borderRadius="10.275"
            >
              <Center mb="10.96px">
                <Text
                  fontFamily="Poppins"
                  fontStyle="normal"
                  fontWeight="600"
                  fontSize="10.96px"
                  color="#FFFFFF"
                >
                  Invoice
                </Text>
              </Center>
            </Box>
          </Center>
          <Center>
            <Flex>
              <Text
                fontFamily="Poppins"
                fontStyle="normal"
                fontWeight="500"
                fontSize="9.59px"
                color="#FFFFFF4D"
                ml="24.88px"
                mr="58.91"
              >
                Available balance
              </Text>
              <Text
                fontFamily="Poppins"
                fontStyle="normal"
                fontWeight="400"
                fontSize="9.59px"
                color="#FFFFFF4D"
                mr="24.88px"
              >
                {nearState.aexBalance} AEX
              </Text>
            </Flex>
          </Center>
        </Flex>
      </Center>
      <Center>
        <Flex
          flexDirection="column"
          alightItems="center"
          justifyContent="center"
        >
          <Center>
            <Text
              fontFamily="Poppins"
              font-style="normal"
              fontWeight="400"
              fontSize="12.33px"
              lineHeight="18.495px"
              color="#FFFFFF"
              mb="9.1653px"
            >
              NEAR
            </Text>
          </Center>
          <Center mb="21.92px">
            <QRCodeSVG size="102.75px" value={nearState.accountId} />
          </Center>
          <Center mb="12.605px">
            <Text
              fontFamily="Poppins"
              fontStyle="normal"
              fontWeight="500"
              fontSize="9.59px"
              color="rgba(255, 255, 255, 0.3)"
            >
              Account id
            </Text>
          </Center>
          <Center mb="10.96px">
            <Flex
              justifyContent="center"
              alignItems="center"
              // padding= "10.96px"
              gap="14.0425px"
              padding="10.96px 16.44px"
              mx="32.88px"
              w="191.8px"
              h="50.69"
              backgroundColor="#FFFFFF0D"
              borderRadius="10.275"
            >
              <Text
                textAlign="center"
                fontFamily="Poppins"
                fontStyle="normal"
                fontWeight="500"
                fontSize="9.59px"
                color="#FFFFFF"
                w="142.48px"
              >
                {/* e8e9f38940951e644a64a4ca90dcc67108b8f50343d58e1 */}
                {nearState.accountId}
              </Text>

              <Image
                onClick={() => {
                  copiedB();
                  popUpB();
                }}
                src="../resources/Group23.png"
                w="10.65px"
                h="13.7px"
                cursor="pointer"
              />
              {copiedTimeB && (
                <Text
                  position="fixed"
                  ml="156px"
                  color="white"
                  bgColor="black"
                  py={2}
                  px={2}
                  fontFamily="Poppins"
                  fontStyle="normal"
                  fontWeight="500"
                  fontSize="9.59px"
                  borderRadius="5px"
                >
                  Copied
                </Text>
              )}
            </Flex>
          </Center>

          <Center>
            {/* <Flex flexDirection="column" alligItems="center"> */}
            <Box
              // padding= "10.96px"
              gap="14.0425px"
              padding="10.96px 16.44px"
              w="191.8px"
              h="38.36"
              backgroundColor="#FFFFFF0D"
              borderRadius="10.275"
            >
              <Center mb="10.96px">
                <Text
                  fontFamily="Poppins"
                  fontStyle="normal"
                  fontWeight="600"
                  fontSize="10.96px"
                  color="#FFFFFF"
                >
                  Invoice
                </Text>
              </Center>
            </Box>
          </Center>
          <Center>
            <Flex>
              <Text
                fontFamily="Poppins"
                fontStyle="normal"
                fontWeight="500"
                fontSize="9.59px"
                color="#FFFFFF4D"
                ml="24.88px"
                mr="58.91"
              >
                Available balance
              </Text>
              <Text
                fontFamily="Poppins"
                fontStyle="normal"
                fontWeight="400"
                fontSize="9.59px"
                color="#FFFFFF4D"
                mr="24.88px"
              >
                {nearState.nearBalance} NEAR
              </Text>
            </Flex>
          </Center>
        </Flex>
      </Center>
    </Box>
  );
}

export default RecieveToken;
