import React, { useCallback, useEffect } from "react";
import {
  Box,
  Image,
  Text,
  Heading,
  Flex,
  Button,
  Center,
  useColorModeValue,
  useMediaQuery,
  Grid,
  GridItem,
  Wrap,
  WrapItem,
  Avatar,
} from "@chakra-ui/react";
import { nearStore } from "../../store/near";
import { MinusIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "../../store/store";
import { getUserState, setImages } from "../../store/slices/imageSlices";
import LogOut from "./LogOut";
import CircleList from "./CircleList";
import PinContact from "./PinContact";
import Circle from "./Circle";
import { expandChat, expandFlow } from "../../store/slices/modulesSlices";
import dynamic from "next/dynamic";

const ThreeDModel = dynamic(() => import("../3DModel"), { ssr: false });

function Profile(props) {
  const nearState = nearStore((state) => state);
  const dispatch = useDispatch();
  const { ellipse4, ellipse5, ellipse3, logoP, frameP1, frameP2 } =
    useSelector(getUserState);
  const [isLogout, setLogout] = React.useState(false);
  const [hide, setHide] = React.useState(false);
  const logOutUser = () => {
    setLogout((prevState) => !prevState);
  };
  const [isLargerThan656] = useMediaQuery("(max-height: 656px)");
  const bgGradient = useColorModeValue(
    // "linear(#edf2f700, #edf2f720 15%, gray.100 90%)",
    "linear(180deg, rgba(25, 25, 25, 0) 0%,, #191919 100%)"
  );

  let zIndex;
  let backdrop;
  isLogout ? (zIndex = 1) : (zIndex = -8);
  isLogout ? (backdrop = 1) : (backdrop = -1);
  const [circ, setCirc] = React.useState(false);
  const [pin, setPin] = React.useState(false);
  const [circle, setCircle] = React.useState(false);

  const remCirc = () => {
    setCirc((prevState) => !prevState);
    console.log("done", circ);
  };

  const pinned = () => {
    setPin((prevState) => !prevState);
  };

  const addCircle = () => {
    setCircle((prevState) => !prevState);
  };

  let disabled;
  let opacity;

  props.shadow ? (disabled = true) : (disabled = false);
  //   props.shadow ? opacity=`` : opacity="none"
  const mouseDown = (e) => {
    return <Circle />;
  };
  const babylonViewer = nearState.babylonViewer;
  const babylon = document.getElementById("babylon-element-profile");

  const load3d = async (element, mediaUrl) => {
    if (babylonViewer) {
      await new babylonViewer.DefaultViewer(element, {
        extends: "none",
        templates: {
          main: {
            html: "<loading-screen id='babylon-loading-screen' style='height: 100%;width: 100%; position: absolute;left: 0;z-index: 100;opacity: 1;pointer-events: none;display: flex;justify-content: center;align-items: center;-webkit-transition: opacity 1s ease;-moz-transition: opacity 1s ease;transition: opacity 1s ease;'></loading-screen>  <canvas id='my-babylon-canvas' style='height: 100%;width: 100%;flex: 1;touch-action: none;' class='babylonjs-canvas' touch-action='none'></canvas>",
            params: {
              ["no-escape"]: true,
              ["babylon-font"]: `https://viewer.babylonjs.com/babylon.woff`,
            },
          },
          ["loadingScreen"]: {
            html: "<img id='loading-image' style='height: 2rem;width: 2rem;' src='{{loadingImage}}' >",
            params: {
              ["backgroundColor"]: "#0000004d",
              ["loadingImage"]:
                "https://cdn.discordapp.com/attachments/922880841238065176/1024013739395141682/Loader.png",
            },
          },
        },
        scene: {
          clearColor: {
            r: 0,
            g: 0,
            b: 0,
            a: 0,
          },
        },
        engine: {
          antialiasing: true,
          hdEnabled: true,
          adaptiveQuality: true,
        },
        optimizer: true,
        model: {
          url: `${mediaUrl}`,
          scaling: {
            x: 0.9,
            y: 0.5,
            z: 0.8,
          },
          position: {
            x: 0,
            y: -1,
            z: 1,
          },
        },
      });
    } else {
      console.log("Babylon viewer is null");
    }
  };

useEffect(() => {
    if (babylon) {
      (async () => {
        await load3d(babylon, nearState.profile.profileImg)
      })();
    }
    
  }, [babylon,  nearState.profile.profileImg])

  const handleESC = useCallback((e) => {
    if (e.key === "Escape") {
      props.toggle();
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleESC);

    return () => {
      window.removeEventListener("keydown", handleESC);
    };
  }, []);


  return circ ? (
    <CircleList remove={remCirc} />
  ) : pin ? (
    <PinContact remove={pinned} />
  ) : (
    <Flex>
      <Grid
        templateRows={isLargerThan656 ? "1fr" : "1fr"}
        bg="#1F1F1F"
        w="250px"
        height="100vh"
        overflowX="hidden"
        overflowY="hidden"
        style={{ padding: "0!important" }}
      >
        <GridItem
          bgColor="#141414"
          bgImage={
            !nearState.profile.profileImg.includes(".glb")
              ? `url('${nearState.profile.profileImg}')`
              : "none"
          }
          bgRepeat="no-repeat"
          bgSize="cover"
          bgPos="center"
          w="inherit"
          position="relative"
        >
          {nearState.profile.profileImg.includes(".glb") && (
            <Box
              position="absolute"
              top={0}
              left={0}
              style={{
                zIndex: 0,
              }}
              w="full"
              h="full"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Box w="full" h="full" id="babylon-element-profile"></Box>
            </Box>
          )}
          <Flex
            position="absolute"
            top={0}
            w="250px"
            width="100%"
            // onDoubleClick={props.circleClick}
            bgGradient={
              !nearState.profile.profileImg.includes(".glb")
                ? bgGradient
                : "none"
            }
            h="100%"
            style={{
              zIndex: 0,
            }}
          >
            <Flex flexDirection="column" w="full">
              <Flex
                justifyContent="space-between"
                mb="auto"
                marginInline="12px"
              >
                <Flex
                  flexDirection="column"
                  justifyContent="flex-end"
                  alignItems="flex-end"
                  flexBasis="100%"
                  mt="12px"
                  cursor="pointer"
                >
                  <Box
                    h="40px!important"
                    w="40px!important"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    bgColor="rgba(255, 255, 255, 0.1)"
                    border="1px solid rgba(255, 255, 255, 0.15)"
                    backdropFilter="10px"
                    color="#fff"
                    backdropBlur="10px"
                    className="super-ellipse"
                  >
                    <Image src="resources/badge.png" alt="badge" />
                  </Box>
                </Flex>
              </Flex>

              <Box
                h="auto"
                mb={1}
                // zIndex={6}
              >
                <Flex justifyContent="center" flexBasis="100%" gap="10px">
                  <Heading
                    fontSize="20px"
                    color="#FFFFFF"
                    fontFamily="Poppins"
                    fontWeight="700"
                    fontStyle="normal"
                    lineHeight="100%"
                    textAlign="center"
                    // letterSpacing="-0.02em"
                    // mt="21px"
                    justifyContent="center"
                    textTransform="capitalize"
                    display="inline-flex"
                    // zIndex="-1"
                  >
                    {nearState.profile.fullName}
                  </Heading>
                  <Image src="resources/Squircle-logo.png" alt="verified" />
                </Flex>
                <Flex
                  alignItems="center"
                  justifyContent="center"
                  gap="16px"
                  mt="-2px"
                >
                  <Text
                    fontSize="14px"
                    fontFamily="Poppins"
                    fontStyle="italic"
                    color="#FFFFFF"
                    fontWeight="400"
                    letterSpacing="-0.02em"
                    mb="11.645px"
                    mt="12px"
                    lineHeight=" 100%"
                    /* identical to box height, or 18px */
                  >
                    {nearState.profile.userId}
                  </Text>

                  <Flex
                  // boxShadow = "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px"
                  // boxShadow = "rgba(0, 0, 0, 0.25) 30px 154px 155px,  10px -212px 130px, rgba(0, 0, 0, 0.12) 10px 24px 6px, rgba(0, 0, 0, 0.17) 12px 12px 13px, rgba(0, 0, 0, 0.09) 10px -13px 65px"
                  >
                    <Image
                      src={ellipse3}
                      marginRight={2}
                      w="16px"
                      h="16px"
                      alt="elipse"
                    />
                    <Text
                      color="#FFFFFF"
                      fontFamily="Poppins"
                      fontWeight="400"
                      fontSize="14px"
                      lineHeight="100%"
                      /* identical to box height, or 14px */

                      letterSpacing="-0.02em"
                    >
                      Aura: 2k
                    </Text>
                  </Flex>
                </Flex>
              </Box>
            </Flex>
          </Flex>
        </GridItem>
        <GridItem bgColor="rgba(0, 0, 0, 0.09)">
          <Box
            px="13px"
            bgColor=" #1F1F1F"
            w="250px"
            marginLeft="0"
            borderRadius=" 25px 25px 0px 0px"
            boxShadow="0px -5px 25px rgba(0, 0, 0, 0.32)"
          >
            <Center borderRadius="50px 50px 0px 0px">
              <Button
                onClick={remCirc}
                outline="none"
                _hover={{
                  background: "none",
                }}
                cursor="pointer"
                background="none"
                height="12px"
                mt="2"
                px="0"
                flexDirection="column"
                gap="2px"
              >
                <Image src="resources/Arrow-up-icon.png" alt="up" />
              </Button>
            </Center>
            <Flex flexDirection="column">
              <Heading
                letterSpacing="-0.02em"
                fontWeight="500"
                fontSize="12px"
                lineHeight="100%"
                textTransform="capitalize"
                color="rgba(255, 255, 255, 0.3)"
                fontFamily="Poppins"
                mt="10px"
              >
                Contacts
              </Heading>{" "}
              <Wrap mt={2} mb={4} justifyContent="space-between" gap={0}>
                <WrapItem
                  flexWrap="nowrap"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  flex="1"
                >
                  <Box
                    bgImage="resources/Squircle-dark.png"
                    cursor="pointer"
                    onClick={pinned}
                    h="48px"
                    w="48px"
                    color="#fff"
                    backdropBlur="10px"
                    backdropFilter="10px"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Image src="resources/Plus-con.png" alt="add" />
                  </Box>
                </WrapItem>
                <WrapItem
                  flexWrap="nowrap"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  flex="1"
                >
                  <Box
                    bgImage="/resources/Squircle-dark.png"
                    cursor="pointer"
                    onClick={pinned}
                    h="48px"
                    w="48px"
                    color="#fff"
                    backdropBlur="10px"
                    backdropFilter="10px"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Image src="resources/Plus-con.png" alt="add" />
                  </Box>
                </WrapItem>
                <WrapItem
                  flexWrap="nowrap"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  flex="1"
                >
                  <Box
                    bgImage="resources/Squircle-dark.png"
                    cursor="pointer"
                    onClick={pinned}
                    h="48px"
                    w="48px"
                    color="#fff"
                    backdropBlur="10px"
                    backdropFilter="10px"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Image src="resources/Plus-con.png" alt="add" />
                  </Box>
                </WrapItem>
                <WrapItem
                  flexWrap="nowrap"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  flex="1"
                >
                  <Box
                    bgImage="/resources/Squircle-dark.png"
                    cursor="pointer"
                    onClick={pinned}
                    h="48px"
                    w="48px"
                    color="#fff"
                    backdropBlur="10px"
                    backdropFilter="10px"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Image src="resources/Plus-con.png" alt="add" />
                  </Box>
                </WrapItem>
              </Wrap>
            </Flex>
          </Box>
          <Box boxShadow="0px -5px 25px rgba(0, 0, 0, 0.4)">
            <Box
              px="13px"
              py={3}
              bgColor="#1F1F1F"
              w="250px"
              marginLeft="0"
              borderRadius=" 25px 25px 0px 0px"
            >
              <Center>
                <Button
                  onClick={props.wallet}
                  _hover={{
                    background: "none",
                  }}
                  cursor="pointer"
                  background="none"
                  height="12px"
                  px="0"
                  flexDirection="column"
                  gap="2px"
                >
                  <Image src="resources/Arrow-up-icon.png" alt="up" />
                </Button>
              </Center>
              <Box>
                <Heading
                  letterSpacing="-0.02em"
                  fontWeight="500"
                  fontSize="12px"
                  lineHeight="100%"
                  textTransform="capitalize"
                  fontFamily="Poppins"
                  color="rgba(255, 255, 255, 0.3)"
                  mt="10px"
                >
                  Wallet
                </Heading>
                <Flex my={2} justifyContent="space-between" gap="0">
                  <Flex gap={1}>
                    <Text
                      fontSize="14px"
                      fontWeight="400"
                      lineHeight="100%"
                      letterSpacing="-0.02em"
                      color="#ffffff"
                      fontFamily="Poppins"
                      textTransform="uppercase"
                    >
                      {" "}
                      {nearState.aexBalance}
                    </Text>
                    <Image
                      src="resources/token-logo.png"
                      w="13px"
                      h="9px"
                      alignSelf="center"
                      alt="aerx-token"
                    />
                  </Flex>
                  <Flex gap={1} justifyContent="center">
                    <Text
                      fontSize="14px"
                      fontWeight="400"
                      lineHeight="100%"
                      letterSpacing="-0.02em"
                      color="#ffffff"
                      fontFamily="Poppins"
                      textTransform="uppercase"
                    >
                      {" "}
                      2,132
                    </Text>
                    <Image
                      src="resources/sub-token.png"
                      w="17.86px"
                      h="9px"
                      alignSelf="center"
                    />
                  </Flex>
                  <Flex gap={1} justifyContent="flex-end">
                    <Text
                      fontSize="14px"
                      fontWeight="400"
                      lineHeight="100%"
                      letterSpacing="-0.02em"
                      color="#ffffff"
                      fontFamily="Poppins"
                      textTransform="uppercase"
                    >
                      {" "}
                      {nearState.nearBalance}
                    </Text>
                    <Image
                      src="resources/near-logo.png"
                      w="11px"
                      h="11px"
                      alignSelf="center"
                    />
                  </Flex>

                  {/* <Flex> */}
                  {/* <div
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
                    </div> */}
                  {/* </Flex> */}
                </Flex>
                <Flex justifyContent="space-between">
                  <Box
                    bgImage="resources/Squircle-light.png"
                    h="48px"
                    w="48px"
                    color="#fff"
                    backdropBlur="10px"
                    backdropFilter="10px"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    onClick={() => props.recieved()}
                    cursor="pointer"
                  >
                    <Image src="resources/download-icon.png" />
                  </Box>
                  <Box
                    bgImage="resources/Squircle-light.png"
                    h="48px"
                    w="48px"
                    color="#fff"
                    backdropBlur="10px"
                    backdropFilter="10px"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    onClick={() => props.upload()}
                    cursor="pointer"
                  >
                    <Image src="resources/Upload-icon.png" />
                  </Box>
                  <Box
                    bgImage="resources/Squircle-light.png"
                    h="48px"
                    w="48px"
                    color="#fff"
                    backdropBlur="10px"
                    backdropFilter="10px"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    onClick={() => props.exchange()}
                    cursor="pointer"
                  >
                    <Image src="resources/refresh-logo.png" />
                  </Box>
                  <Box
                    bgImage="resources/Squircle-light.png"
                    h="48px"
                    w="48px"
                    color="#fff"
                    backdropBlur="10px"
                    backdropFilter="10px"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    onClick={() => props.pool()}
                    cursor="pointer"
                  >
                    <Image src="resources/profit-logo.png" />
                  </Box>
                </Flex>
              </Box>
            </Box>
          </Box>
          <Box boxShadow="0px -5px 25px rgba(0, 0, 0, 0.4)">
            <Box
              px="13px"
              py={3}
              bgColor=" #1F1F1F"
              w="250px"
              marginLeft="0"
              borderRadius=" 25px 25px 0px 0px"
            >
              <Center>
                <Button
                  // onClick={remCirc}
                  outline="none"
                  _hover={{
                    background: "none",
                  }}
                  cursor="pointer"
                  background="none"
                  height="12px"
                  px="0"
                  flexDirection="column"
                  gap="2px"
                >
                  <Image src="resources/Arrow-up-icon.png" />
                </Button>
              </Center>
              <Flex flexDirection="column">
                <Heading
                  letterSpacing="-0.02em"
                  fontWeight="500"
                  fontSize="12px"
                  lineHeight="100%"
                  textTransform="capitalize"
                  color="rgba(255, 255, 255, 0.3)"
                  fontFamily="Poppins"
                  mt="10px"
                >
                  Modules
                </Heading>{" "}
                <Flex
                  flexDirection="row"
                  gap={0}
                  mt={2}
                  justifyContent="space-between"
                  flexBasis="100%"
                >
                  <Box
                    bgImage="resources/Squircle-light.png"
                    h="48px"
                    w="48px"
                    color="#fff"
                    backdropBlur="10px"
                    backdropFilter="10px"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    cursor="pointer"
                  >
                    <Image src="resources/module-1.png" alt="home" />
                  </Box>
                  <Box
                    bgImage="resources/Squircle-light.png"
                    h="48px"
                    w="48px"
                    color="#fff"
                    backdropBlur="10px"
                    backdropFilter="10px"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    cursor="pointer"
                    onClick={() => dispatch(expandChat())}
                  >
                    <Image src="resources/module-2.png" />
                  </Box>
                  <Box
                    bgImage="/resources/Squircle-dark.png"
                    h="48px"
                    w="48px"
                    color="#fff"
                    backdropBlur="10px"
                    backdropFilter="10px"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    cursor="pointer"
                    onClick={() => dispatch(expandFlow())}
                  >
                    <Image src="resources/module-3.png" />
                  </Box>
                  <Box
                    bgImage="/resources/Squircle-dark.png"
                    cursor="pointer"
                    h="48px"
                    w="48px"
                    color="#fff"
                    backdropBlur="10px"
                    backdropFilter="10px"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Image src="resources/Plus-con.png" />
                  </Box>
                </Flex>
              </Flex>
            </Box>
            <Box>
              <Box
                bgColor="#1F1F1F"
                borderTop="1.5px solid rgba(255, 255, 255, 0.05)"
                marginLeft="0"
                h="48px"
                p={3}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Box
                  cursor="pointer"
                  onClick={logOutUser}
                  flex="0.5"
                  display="flex"
                  justifyContent="flex-start"
                >
                  <Image src="resources/Logout-icon.png" />
                </Box>
                <Box
                  flex="2"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Flex
                    alignItems="center"
                    justifyItems="center"
                    position="relative"
                    gap={3}
                    bgColor="#1A1A1A"
                    h="34px"
                    w="67px"
                    p={1}
                    borderRadius="12px"
                  >
                    <Box>
                      <Image src="resources/moon-icon.png" />
                    </Box>
                    <Box>
                      <Image src="resources/sun-icon.png" />
                    </Box>
                  </Flex>
                </Box>

                <Box flex="0.5" display="flex" justifyContent="flex-end">
                  <Image w="19px" h="20px" src={"resources/Setting.png"} />
                </Box>
              </Box>
            </Box>
          </Box>
        </GridItem>
      </Grid>

      <Box
        color="#fff"
        alignSelf="center"
        px={2}
        onClick={() => props.toggle()}
        cursor="pointer"
      >
        <Image w="16px" h="16px" src={"resources/close-arrow.png"} />
      </Box>
      <LogOut zIndex={zIndex} show={isLogout} revert={logOutUser} />
    </Flex>
  );
}

export default Profile;
