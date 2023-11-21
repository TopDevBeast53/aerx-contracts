import React, { useState, useEffect } from "react";
import axios from "axios";
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
import AddIcon from "./AddIcon";

const data = [
  {
    src: "../resources/Search-circle-icon.svg",
  },
  {
    src: "../resources/Folder-circle-icon.png",
  },
  {
    src: "../icons/Bag.png",
  },
  {
    src: "../icons/Bookmark.png",
  },
  {
    src: "../icons/Calendar.png",
  },
  {
    src: "../icons/Category.png",
  },
  {
    src: "../icons/Chat.png",
  },
  {
    src: "../icons/Game.png",
  },
  {
    src: "../icons/Heart.png",
  },
  {
    src: "../icons/Message.png",
  },
  {
    src: "../icons/Message_bulk.png",
  },
  {
    src: "../icons/More-Square.png",
  },
  {
    src: "../icons/Password.png",
  },
  {
    src: "../icons/Send.png",
  },
  {
    src: "../icons/Ticket-Star.png",
  },
  {
    src: "../icons/Work.png",
  },
];

function CircleIcon(props) {
  const [selectedIcon, setSelectedIcons] = useState([]);
  const [status, setStatus] = useState(false);
  const [image, setImage] = React.useState({
    name: "",
    display: "",
    placeholder: "",
    changed: false,
  });

  const handleCapture = async () => {
    try {
      const data = new FormData();
      data.append("file", image.placeholder);
      data.append("upload_preset", "cipher");
      data.append("cloud_name", "dos6ec8wr");
      if (image.changed === true) {
        setStatus(true);

        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/dos6ec8wr/image/upload",
          data
        );
        const { secure_url } = res.data;
        props.url(secure_url);
        setStatus(false);
        props.remove();
      }
    } catch (e) {
      console.log(e);
      setStatus(true);
    }
  };

  useEffect(() => {
    if (status) {
      handleCapture();
    }
  }, [handleCapture, status]);

  const handleImageUpload = async (e) => {
    setImage({
      name: e.target.files[0].name,
      display: URL.createObjectURL(e.target.files[0]),
      placeholder: e.target.files[0],
      changed: true,
    });
    setStatus(true);
  };

  const handleClick = (item) => {
    setSelectedIcons((ps) => {
      if (ps.includes(item)) {
        return [...ps.filter((arr) => arr !== item)];
      } else {
        return [item];
      }
    });
  };

  const handleDone = () => {
    props.url("");
    props.icon(selectedIcon);
    props.remove();
  };

  const handleClear = () => {
    setImage({ name: "", display: "", placeholder: "", changed: false });
  };

  return (
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
          Select icon
        </Text>
      </Flex>

      {!image.changed ? (
        <label>
          <Box
            border="1.5px dashed rgba(255, 255, 255, 0.15)"
            borderRadius="10px"
            mx={4}
            my={4}
            h="40px"
            cursor="pointer"
          >
            <input
              type="file"
              name="cover"
              onChange={handleImageUpload}
              accept="img/*"
              style={{ display: "none" }}
            />
            <Flex justifyContent="center" alignItems="center" gap={2} h="full">
              <Image h="24px" w="24px" src="resources/circle-upload.png" />
              <Text
                fontSize="12px"
                fontWeight={500}
                lineheight="100%"
                color="#fff"
              >
                Upload image
              </Text>
            </Flex>
          </Box>
        </label>
      ) : (
        <Box
          bg="rgba(255, 255, 255, 0.05)"
          borderRadius="10px"
          mx={4}
          my={4}
          h="48px"
          cursor="pointer"
          display="flex"
        >
          <Flex
            justifyContent="center"
            alignItems="center"
            gap={2}
            h="full"
            ml={2}
            mr="auto"
          >
            <Box borderRadius="15px" h="32px" w="32px">
              <Image h="32px" w="32px" src={image.display} borderRadius="9px" />
            </Box>
            <Text
              fontSize="12px"
              fontWeight={500}
              fontStyle="italic"
              lineheight="100%"
              color="#fff"
            >
              {status ? "uploading..." : image.name}
            </Text>
          </Flex>
          <Flex
            color="#fff"
            justifyContent="center"
            alignItems="center"
            mr={4}
            onClick={handleClear}
          >
            <Image h="24px" w="24px" src="resources/cancel-circle-icon.png" />
          </Flex>
        </Box>
      )}

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
              <AddIcon
                key={index}
                src={item.src}
                selected={selectedIcon.includes(item) ? true : false}
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
        my={4}
        bg="linear-gradient(180deg, #1F1F1F 0%, rgba(31, 31, 31, 0) 100%)"
      >
        {selectedIcon.length === 1 ? (
          <Button
            bgColor="#6054F0"
            borderRadius="10px"
            px="12px"
            py="24px"
            w="226px"
            h="40px"
            onClick={handleDone}
          >
            <Text
              color="#fff"
              fontFamily="poppins"
              letterSpacing="-0.02em"
              fontSize="14px"
              fontWeight={600}
              lineHeight="100%"
            >
              Done
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
  );
}

export default CircleIcon;
