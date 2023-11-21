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
  InputGroup,
  InputLeftElement,
  Input,
} from "@chakra-ui/react";
import {
  MinusIcon,
  PhoneIcon,
  RepeatClockIcon,
  Search2Icon,
} from "@chakra-ui/icons";
import Contact from "./Contact";
import CircleIcon from "./CircleIcon";

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

function AddCircles(props) {
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [title, setTitle] = useState("");

  const [icon, setIcon] = React.useState(false);
  const [selectedIcon, setSelectedIcon] = React.useState([]);
  const [url, setUrl] = useState("");

  const addCircleIcon = () => {
    setIcon((prevState) => !prevState);
  };

  const handleClick = (item) => {
    setSelectedContacts((ps) => {
      if (ps.includes(item)) {
        return [...ps.filter((arr) => arr !== item)];
      } else {
        return [...ps, item];
      }
    });
  };

  const handleClear = () => {
    setSelectedContacts([]);
    setSelectedIcon([]);
  };

  const handleAddIcon = () => {
    addCircleIcon();
    setSelectedIcon([]);
  };

  return (
    <Box>
      {icon ? (
        <CircleIcon
          icon={setSelectedIcon}
          url={setUrl}
          remove={addCircleIcon}
        />
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

          <Flex alignItems="center" flexDirection="column" mx={0}>
            <Text
              my={1}
              fontFamily="poppins"
              fontSize="14px"
              color="#ffffff"
              fontWeight="600"
              letterSpacing="-0.02em"
              lineHeight="21px"
            >
              Create new circle
            </Text>
          </Flex>

          <Box display="flex" flexDirection="row" justifyContent="center">
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
                bgImage={
                  selectedIcon?.length === 1 || url
                    ? "resources/add-circle-icon-bg.png"
                    : "resources/add-circle.png"
                }
                // bgRepeat="no-repeat"
                cursor="pointer"
                onClick={handleAddIcon}
                h="42px"
                w="42px"
                color="#fff"
                backdropBlur="10px"
                backdropFilter="10px"
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                {selectedIcon?.length === 1 && (
                  <Image src={selectedIcon[0]?.src} alt="add" />
                )}
                {url && <Image h="32px" w="32px" src={url} alt="add" />}
              </Box>
              {selectedContacts.map((item, index) => (
                <>
                  <Contact
                    key={index}
                    src={item.src}
                    name=""
                    w="42px"
                    h="42px"
                    circle={true}
                  />

                  {index === 1 && selectedContacts.length >= 4 && (
                    <Contact
                      src={item.src}
                      name=""
                      w="42px"
                      h="42px"
                      circle={true}
                      more={true}
                      count={selectedContacts}
                    />
                  )}
                </>
              ))}
            </Grid>
          </Box>

          <Flex alignItems="center" flexDirection="column" mx={4} my={4}>
            <InputGroup
              outline="none"
              border="none"
              bgColor="#191A1B"
              borderRadius="10px"
            >
              <Input
                type="text"
                value={title}
                placeholder="Enter Circle Name"
                color="#FFF"
                textAlign="center"
                _placeholder={{
                  color: "#5F5F5F",
                  fontSize: "12px",
                  textAlign: "center",
                }}
                outline="none"
                border="none"
                onChange={(e) => setTitle(e.target.value)}
              />
            </InputGroup>
          </Flex>

          <Flex justifyContent="center" flexDirection="row" mx={4}>
            <Box
              color="#fff"
              alignSelf="center"
              justifySelf="center"
              cursor="pointer"
              h="16px"
              w="16px"
              flex={1}
            ></Box>
            <Text
              my={1}
              fontFamily="poppins"
              fontSize="14px"
              color="#ffffff"
              fontWeight="600"
              letterSpacing="-0.02em"
              lineHeight="21px"
              flex={2}
              textAlign="center"
            >
              {`Selected: ${selectedContacts.length} `}
            </Text>
            <Box
              color="#fff"
              alignItems="center"
              justifySelf="center"
              cursor="pointer"
              h="24px"
              w="24px"
              onClick={() => handleClear()}
              flex={1}
              display="flex"
              justifyContent="flex-end"
              // bgColor="rgba(255, 255, 255, 0.05)"
              // borderRadius="50%"
            >
              <Image h="24px" w="24px" src="resources/cancel-circle-icon.png" />
            </Box>
          </Flex>

          <Flex alignItems="center" flexDirection="column" mx={4} my={6}>
            <InputGroup
              outline="none"
              border="none"
              bgColor="#191A1B"
              borderRadius="10px"
            >
              <InputLeftElement
                pointerEvents="none"
                children={<Search2Icon color="#0F0F0F" />}
              />
              <Input
                type="text"
                placeholder="Search"
                _placeholder={{
                  color: "#5F5F5F",
                  fontSize: "12px",
                }}
                outline="none"
                border="none"
              />
            </InputGroup>
          </Flex>

          <Box overflowY="scroll" flex={2} mb={0}>
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
                    selected={selectedContacts.includes(item) ? true : false}
                    onClick={() => handleClick(item)}
                  />
                ))}
              </Grid>
            </Box>
          </Box>

          <Box
            display="flex"
            flexDirection="center"
            justifyContent="center"
            mb={4}
          >
            {selectedContacts.length > 0 ? (
              <Button
                bgColor="#6054F0"
                borderRadius="10px"
                px="12px"
                py="24px"
                w="226px"
                h="40px"
              >
                <Text
                  color="#fff"
                  fontFamily="poppins"
                  letterSpacing="-0.02em"
                  fontSize="14px"
                  fontWeight={600}
                  lineHeight="100%"
                >
                  Create
                </Text>
              </Button>
            ) : (
              <Button
                bgColor="rgba(255, 255, 255, 0.05)"
                borderRadius="10px"
                px="12px"
                py="24px"
                w="226px"
                h="40px"
                disabled
              >
                <Text
                  color="#fff"
                  opacity="0.3"
                  fontFamily="poppins"
                  letterSpacing="-0.02em"
                  fontSize="14px"
                  fontWeight={600}
                  lineHeight="100%"
                >
                  Select
                </Text>
              </Button>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default AddCircles;
