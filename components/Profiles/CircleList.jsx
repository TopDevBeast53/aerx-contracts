import React, { useState } from "react";
import {
  Box,
  Text,
  Center,
  Flex,
  Image,
  Button,
  Grid,
  GridItem,
} from "@chakra-ui/react";
// import { MinusIcon, RepeatClockIcon } from "@chakra-ui/icons";
import Contact from "./Contact";
import AddCircles from "./AddCircles";

const data = [
  {
    src: "../resources/Rectangle 3604.png",
    name: "Anna",
    id: 0,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Have",
    id: 1,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Scave",
    id: 2,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Ronan",
    id: 3,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Nore",
    id: 4,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Anna",
    id: 5,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Anna",
    id: 0,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Have",
    id: 1,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Scave",
    id: 2,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Ronan",
    id: 3,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Nore",
    id: 4,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Anna",
    id: 5,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Anna",
    id: 0,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Have",
    id: 1,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Scave",
    id: 2,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Ronan",
    id: 3,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Nore",
    id: 4,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Anna",
    id: 5,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Anna",
    id: 0,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Have",
    id: 1,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Scave",
    id: 2,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Ronan",
    id: 3,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Nore",
    id: 4,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Anna",
    id: 5,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Anna",
    id: 0,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Have",
    id: 1,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Scave",
    id: 2,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Ronan",
    id: 3,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Nore",
    id: 4,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Anna",
    id: 5,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Anna",
    id: 0,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Have",
    id: 1,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Scave",
    id: 2,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Ronan",
    id: 3,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Nore",
    id: 4,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Anna",
    id: 5,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Anna",
    id: 0,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Have",
    id: 1,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Scave",
    id: 2,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Ronan",
    id: 3,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Nore",
    id: 4,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Anna",
    id: 5,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Anna",
    id: 0,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Have",
    id: 1,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Scave",
    id: 2,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Ronan",
    id: 3,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Nore",
    id: 4,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Anna",
    id: 5,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Anna",
    id: 0,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Have",
    id: 1,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Scave",
    id: 2,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Ronan",
    id: 3,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Nore",
    id: 4,
  },
  {
    src: "../resources/Rectangle 3604.png",
    name: "Anna",
    id: 5,
  },
];

function CircleList(props) {
  const [tab, setTab] = useState(0);
  const [circle, setCircle] = React.useState(false);

  const addCircle = () => {
    setCircle((prevState) => !prevState);
  };

  return (
    <Box>
      {circle ? (
        <AddCircles remove={addCircle} />
      ) : (
        <Box
          height="100vh"
          w="250px"
          bgColor="#1f1f1f"
          // zIndex="6"
          fontFamily="poppins"
          display="flex"
          flexDirection="column"
        >
          <Center borderRadius="50px 50px 0px 0px" zIndex={6}>
            <Button
              onClick={props.remove}
              cursor="pointer"
              background="none"
              h="16px"
              w="16px"
              my={3}
              px="0"
            >
              <Image src="/resources/arrow-down.png" />
            </Button>
          </Center>

          {/* circle text */}
          <Flex justifyContent="space-between" mx={4}>
            <Box>
              {" "}
              <Image src="/resources/contact-search.png" h="20px" w="20px" />
            </Box>
            <Text
              // mb="21.92px"
              fontFamily="poppins"
              fontSize="14px"
              color="#ffffff"
              fontWeight="600"
              letterSpacing="-0.02em"
              lineHeight="21px"
            >
              Contacts
            </Text>
            <Box>
              <Image src="/resources/contact-plus.png" h="20px" w="20px" />
            </Box>
          </Flex>

          <Center
            my={3}
            mx={4}
            bg="#191A1B"
            borderRadius="8px"
            w="226px"
            h="34px"
          >
            <Button
              onClick={() => setTab(0)}
              h="26px"
              w="109px"
              borderRadius="5px"
              bg={tab === 0 ? "#6054F0" : "none"}
              outline="none"
              _hover={{
                background: "#6054F0",
              }}
            >
              <Image
                src="/resources/profile-contact.png"
                h="20px"
                w="20px"
                mx={2}
              />{" "}
              <Text
                color="#fff"
                fontSize="12px"
                fontWeight={tab === 0 ? 500 : 400}
                fontFamily="Poppins"
                lineHeight="100%"
                opacity={tab === 0 ? 1 : 0.3}
              >
                All
              </Text>
            </Button>
            <Button
              onClick={() => setTab(1)}
              h="26px"
              w="109px"
              borderRadius="5px"
              bg={tab === 1 ? "#6054F0" : "none"}
              outline="none"
              _hover={{
                background: "#6054F0",
              }}
            >
              <Image src="/resources/group-user.png" h="16px" w="16px" mx={2} />{" "}
              <Text
                color="#fff"
                fontSize="12px"
                fontWeight={tab === 1 ? 500 : 400}
                fontFamily="Poppins"
                lineHeight="100%"
                opacity={tab === 1 ? 1 : 0.3}
              >
                Circles
              </Text>
            </Button>
          </Center>

          <Box overflowY={tab === 1 ? "hidden" : "scroll"} flex={2} pb={3}>
            {tab === 0 && (
              <Box mx={1}>
                <Grid
                  templateColumns="repeat(4, auto)"
                  alignContent="center"
                  h="auto"
                  gap={2}
                  ml={4}
                >
                  {data.map((item, index) => (
                    <Contact
                      key={index}
                      src={item.src}
                      name={item.name}
                      selected={false}
                    />
                  ))}
                </Grid>
              </Box>
            )}

            {tab === 1 && (
              <Grid
                templateColumns="repeat(2, auto)"
                gap={2}
                alignContent="flex-start"
                justifyContent="flex-start"
                mx={4}
              >
                <Flex flexDirection="column" alignItems="center">
                  <Grid
                    templateColumns="repeat(2, auto)"
                    gap={2}
                    alignContent="flex-start"
                    justifyContent="flex-start"
                    p={2}
                    my={2}
                    bgColor="rgba(255, 255, 255, 0.05)"
                    borderRadius="15px"
                    h="107px"
                    w="107px"
                    overflow="hidden"
                  >
                    <Box
                      bgImage="resources/add-circle-icon-bg.png"
                      // bgRepeat="no-repeat"
                      cursor="pointer"
                      // onClick={handleAddIcon}
                      h="42px"
                      w="42px"
                      color="#fff"
                      backdropBlur="10px"
                      backdropFilter="10px"
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Image h="32px" w="32px" src='../icons/Bookmark.png' alt="add" />
                    </Box>
                    {data.slice(0, 3).map((item, index) => (
                      <Contact
                        key={index}
                        src={item.src}
                        name=""
                        w="42px"
                        h="42px"
                        circle={true}
                      />
                    ))}
                  </Grid>
                  <Text
                    color="#FFF"
                    fontSize="12px"
                    fontWeight="500"
                    lineHeight="18px"
                  >
                    Family
                  </Text>
                </Flex>
                <Flex flexDirection="column" alignItems="center">
                  <Flex
                    alignItems="center"
                    justifyContent="center"
                    p={2}
                    my={2}
                    bgColor="rgba(255, 255, 255, 0.05)"
                    borderRadius="15px"
                    h="107px"
                    w="107px"
                    onClick={addCircle}
                    cursor="pointer"
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      bgImage="resources/add-circle-icon-bg.png"
                      h="42px"
                      w="42px"
                    >
                      <Image src="resources/add-circle-group.png" />
                    </Box>
                  </Flex>
                  <Text
                    color="#FFF"
                    fontSize="12px"
                    fontWeight="500"
                    lineHeight="18px"
                    opacity="0.3"
                  >
                    + Add circles
                  </Text>
                </Flex>
              </Grid>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default CircleList;
