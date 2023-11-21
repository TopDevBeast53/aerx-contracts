import React, { useEffect, useState } from "react";
import Chat from "../../components/Chat";
import CollapsingSidebar from "../../components/CollapsingSidebar";
import FlowFeeds from "../../components/Flow";
import Space from "../../components/Space";
import {
  expandChat,
  expandFlow,
  expandSpace,
  selectModules,
} from "../../store/slices/modulesSlices";
import { useDispatch, useSelector } from "../../store/store";
import Index from "../../components/Profiles/index";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { Transaction } from "../../components/SendTokens/ui/Transaction";
import Collection from "../../components/Collection";

const Flow: React.FC = () => {
  const dispatch = useDispatch();
  const { flow, chat, space, sidebar, collections } = useSelector(selectModules);
  const [flowWidth, setFlowWidth] = useState<string>();
  const handleChatClicked = () => {
    dispatch(expandChat());
  };
  const handleFlowClicked = () => {
    dispatch(expandFlow());
  };
  const handleSpaceClicked = () => {
    dispatch(expandSpace());
  };

  useEffect(() => {}, [chat]);

  return (
    <div className="z-0 w-full h-screen p-6 bg-black flow ">
      <Flex justifyContent="space-between" gap={2}>
        <Box top="0" left="0" position="absolute" zIndex="1">
          <Index />
        </Box>
        {!sidebar.collapsed && <div className="w-[15%] "></div>}
        {!chat.collapsed && (
          <div
            className=" w-min  mr-8 2xl:mr-0  h-[94vh] ml-14   "
            style={{
              width: chat.minimized || !sidebar.collapsed ? "19.5%" : "",
              // marginLeft: chat.minimized ? "5%" : "",
            }}
          >
            <Chat />
          </div>
        )}

        {chat.collapsed && <div className="w-[39%]"></div>}

        {!flow.collapsed && (
          <div className=" w-[508.72px] px-2.5 h-[94vh] bg-black-dark     rounded-[13.7px] ">
            <div className=" w-[495.72px] h-[94vh] overflow-y-scroll rounded-[13.7px]  ">
              <FlowFeeds />
            </div>
          </div>
        )}

        {/* {!space.collapsed && (
          <div className="w-[15%] h-[94vh]"><Space /></div>
        )} */}

        {!collections.collapsed && (
          <Box>
            <Collection />
          </Box>
        )}
      </Flex>
    </div>
  );
};

export default Flow;
