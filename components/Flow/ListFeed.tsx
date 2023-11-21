import React, { useEffect, useState, useRef } from "react";
// import Image from 'next/image';
import Link from 'next/link'
import toast, { Toaster } from "react-hot-toast";
import { tempoFeed, videoFeed } from "../../helpers/data/feeds";
import { initNearConnection } from "../../lib/auth";
import { nearStore } from "../../store/near";
import { Feed, Tempo } from "../../types/Post";
import VideoControl from "../VideoControl";
import { generateRandomColor } from "../../helpers/utils/generateRadomColor";
import { useDispatch, useSelector } from "../../store/store";
import { useGetPosts } from "../../hooks/useGetPosts";
import { selectPosts } from "../../store/slices/postsSlice";
import ChargePost from "../ChargePost";
import useLongPress from "../../hooks/useLongPress";
import { selectChargePostEvent } from "../../store/slices/chargePostEventsSlice";
import { error } from "console";
import { getBalance } from "../../lib/aexContract";
import SharePost from "../SharePost";
import { Feedback } from "aws-sdk/clients/applicationinsights";
import {
  getPostChargers,
  initPostChargersList,
} from "../../lib/chargeFilebase";
import {
  selectPostChargers,
  setPostChargers,
} from "../../store/slices/postChargesSlice";
import dynamic from "next/dynamic";
import { Box, Text, Flex, Image, Center } from "@chakra-ui/react";
// coverImage, postOwner, nftId, title, description
interface IProps {
  feed: Feed;
  handleOnClick: (e: any, feed: Feed) => void;
  onClickCapture: (e: any, feed: Feed) => void;
  handleOnMouseDown: (e: any) => void;
  handleOnMouseUp: (e: any) => void;
  handleOnTouchStart: (e: any) => void;
  handleOnTouchEnd: (e: any) => void;
  initializeShare: (feed: Feed) => void;
}
const TextPost: React.FC<IProps> = ({
  feed,
  handleOnClick,
  handleOnMouseDown,
  handleOnMouseUp,
  handleOnTouchStart,
  handleOnTouchEnd,
  initializeShare,
  onClickCapture,
}) => {
  const { metadata, owner_id, owner_profile, profile } = feed;
  const bgImage = metadata?.media;
  const randomColor = generateRandomColor();
  const nearState = nearStore((state) => state);
  const dispatch = useDispatch();
  const { postChargers } = useSelector(selectPostChargers);
  const [userCharged, setUserCharged] = useState<boolean>(false);

  useEffect(() => {
    getChargeStatus();
  }, [feed]);

  useEffect(() => {
    findIfUserCharged();
  }, [postChargers]);

  const getChargeStatus = async () => {
    const chargers = await getPostChargers(feed.post_id, false, dispatch);
    // console.log("post chargers", chargers);
  };

  const findIfUserCharged = async () => {
    if (postChargers && postChargers.length > 0) {
      postChargers.forEach((charger) => {
        if (charger.post_id == feed.post_id) {
          const findIndex = charger.chargers.findIndex(
            (charger) => charger == nearState.accountId
          );
          if (findIndex > -1) {
            setUserCharged(true);
          }
        }
      });
    }
  };

  const [containerStyle, setContainerStyle] = useState<any>({
    backgroundImage: `url(${metadata?.media})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  });

  useEffect(() => {
    if (metadata.media?.includes(".glb") || !metadata.media) {
      setContainerStyle({
        backgroundImage: `url(${metadata.media})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        background: "linear-gradient(180deg, #6054F0 0%, #332B8D 100%)",
      });
    }
  }, [metadata]);

  const babylonViewer = nearState.babylonViewer;
  const babylon = document.getElementById(`babylon-element-feed-for-${metadata.media}`);
  const babylonPost = document.getElementById(`babylon-element-feed-post-for-${metadata.media}`);

  const load3d = async (element: HTMLElement, mediaUrl: String | undefined) => {
    if (babylonViewer) {
      await new babylonViewer.DefaultViewer(element, {
        extends: "none",
        templates: {
          main: {
            html: "<canvas id='my-babylon-canvas' style='height: 100%;width: 100%;flex: 1;touch-action: none;' class='babylonjs-canvas' touch-action='none'></canvas>",
            params: {
              ["no-escape"]: true,
              ["babylon-font"]: `https://viewer.babylonjs.com/babylon.woff`
            }
          },
          // ["loadingScreen"]: {
          //   html: "<img id='loading-image'  src='https://cdn.discordapp.com/attachments/922880841238065176/1024013739395141682/Loader.png' >",
          //   params: {
          //     ["backgroundColor"]: "#0000004d",
          //     // ["loadingImage"]: "https://cdn.discordapp.com/attachments/922880841238065176/1024013739395141682/Loader.png"
          //   }
          // },
        },
        scene: {
          clearColor: {
            r: 0,
            g: 0,
            b: 0,
            a: 0,
          }
        },
        engine: {
          antialiasing: true,
          hdEnabled: true,
          adaptiveQuality: true,
        },
        optimizer: true,
        model: {
          url: mediaUrl,
          // scaling: {
          //   x: 3.5,
          //   y: 3,
          //   z: 3,
          // },
          position: {
            x: 0,
            y: -12,
            z: 4
          }
        }
      });
    } else {
      console.log("Babylon viewer is null")
    }
  }

  // useEffect(() => {
  //   if (babylon) {
  //     (async () => {
  //       await load3d(babylon, metadata.media)
  //       // for (let i = 0; i < babylon.length; i + 1) {
  //       //   console.log("babylon:  ", babylon.item(i))
  //       // } 

  //     })();
  //   }

  // }, [babylon, metadata.media])

  // useEffect(() => {
  //   if (babylonPost) {
  //     (async () => {
  //       await load3d(babylonPost, metadata.media)
  //       console.log("babylon post working")
  //     })();
  //   }

  // }, [babylonPost, metadata.media])



  return (
    <Box
      width="312.88px"
      height="295.92px"
      style={containerStyle}
      borderRadius="10.96px"
      padding="16px"
      flexDirection="column"
      mt={-2}
      mb={1}
    >
      <Flex justifyContent="space-between">
        <Flex gap="5.48px">
          <Box>
            {!metadata.media?.includes(".glb") && (
              <Image
                src={
                  (profile?.metadata?.media as string) ||
                  "/assets/images/avatar-1.svg"
                }
                className="w-8 h-8 rounded-full"
                alt=""
                width="27.4px"
                height="27.4px"
              />
            )}
            {metadata.media?.includes(".glb") && (
              <Box width="27.4px" height="27.4px" borderRadius="13.7px" borderColor="white" border="1px solid" >
                <div id={`babylon-element-feed-for-${metadata.media}`} style={{ width: "100%", height: "100%", margin: "auto", borderRadius: "13.7px" }}></div>
              </Box>
            )}
          </Box>
          <Text
            fontFamily="Poppins"
            fontStyle="normal"
            fontWeight="600"
            fontSize="10.96px"
            lineHeight="100%"
            letterSpacing="-0.02em"
            color="#FFFFFF"
            marginTop="8.22px"
          >
            {profile?.metadata?.extra || owner_id}
          </Text>
        </Flex>
        <Box>
          <a target="_blank" href={`${process.env.NEXT_PUBLIC_NFT_URL}/${feed.post_id}`} rel="noopener noreferrer">
            <Flex
              gap="8.9px"
              alignItems="center"
              backgroundColor="#ffffff33"
              height="27.4px"
              px="6px"
              borderRadius="34.25px"
            >
              <Image
                src="/assets/icons/nft-icon.svg"
                alt="NFT"
                width="16.44px"
                height="16.44px"
              />
            </Flex>
          </a>
        </Box>
      </Flex>

      <Flex marginTop={"130.15px"} flexDirection="column" height="78.09">
        <Box width="284.96" maxHeight="39.73px">
          <Text
            fontFamily="Poppins"
            fontStyle="normal"
            fontWeight="700"
            fontSize="16.44px"
            lineHeight="100%"
            letterSpacing="-0.02em"
            color="#FFFFFF"
          >
            {owner_id}
          </Text>
        </Box>

        <Box mt="3.7538px" width="284.96" height="32.88px">
          <Text
            fontFamily="Poppins"
            fontStyle="normal"
            fontWeight="400"
            fontSize="10.96px"
            lineHeight="150%"
            letterSpacing="-0.02em"
            color="#FFFFFFE5"
          >
            {metadata?.description}{" "}
          </Text>
        </Box>
      </Flex>
      {(bgImage as string)?.includes('.glb') &&
        <Flex marginLeft="" height="200px" marginTop="-200px" width="280px" zIndex={-1}>

          <Box
            style={{ width: '100%', height: '100%', margin: 'auto' }} id={`babylon-element-feed-post-for-${metadata.media}`}>

          </Box>
        </Flex>

      }
      <Flex gap="55%" alignItems="center">
        <Box>
          <Flex>
            <div className="hover:bg-[#ffffff3a] flex justify-around cursor-pointer  p-1 rounded-full w-[30px] h-[30px]">
              <Image
                className="cursor-pointer"
                src="/assets/icons/comment-icon.svg"
                alt="comment"
                width="16.44px"
                height="16.44px"
              />
            </div>
            <div className="hover:bg-[#ffffff3a] flex justify-around cursor-pointer  p-1 rounded-full w-[30px] h-[30px]">
              <Image
                src="/assets/icons/share-icon.svg"
                alt="share"
                width="16.44px"
                height="16.44px"
                className="cursor-pointer "
                onClick={(e) => initializeShare(feed)}
              />
            </div>
            <div className="hover:bg-[#ffffff3a] flex justify-around cursor-pointer  p-1 rounded-full w-[30px] h-[30px]">
              <Image
                className="cursor-pointer"
                src="/assets/icons/save-post-icon.svg"
                alt="save"
                width="16.44px"
                height="16.44px"
              />
            </div>
          </Flex>
        </Box>
        <Box mt={-1}>
          {!feed?.metadata?.title.includes("AERX ProfileNFT for") && (
            <div>
              {
                !userCharged && (
                  // <div className='cursor-pointer charge-filter-effect w-[30px] h-[30px] rounded-full flex justify-around'>
                  <Box className="charge-filter-effect  rounded-full flex justify-around py-1 px-2 backdrop-blur-sm bg-white/30 ">
                    <Image
                      src="../resources/Union2.png"
                      alt="charge post"
                      width="14px"
                      height="21px"
                      className="cursor-pointer"
                      onClick={(e) => handleOnClick(e, feed)}
                      onClickCapture={(e) => onClickCapture(e, feed)}
                      onMouseDown={handleOnMouseDown}
                      onMouseUp={handleOnMouseUp}
                      onTouchStart={handleOnTouchStart}
                      onTouchEnd={handleOnTouchEnd}
                    />
                  </Box>
                )
                // </div>
              }
              {userCharged && (
                <div
                  onClick={() =>
                    toast.error("You have already charged this post")
                  }
                  className="cursor-pointer charge-filter-effect  rounded-full flex justify-around"
                >
                  <Box className="charge-filter-effect  rounded-full flex justify-around py-1 px-2 backdrop-blur-lg bg-white/30 ">
                    <Image
                      src="../resources/Union.png"
                      alt="post rewarded"
                      width="14px"
                      height="21px"
                    />
                  </Box>
                </div>
              )}
            </div>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

const VideoPost: React.FC<Feed> = ({ metadata, owner_id }) => {
  return (
    <Flex
      width="166.85px"
      height="295.92px"
      bgImage={`url('${metadata?.media}')`}
      borderRadius="10.275px"
      marginLeft={0}
      backgroundRepeat="no-repeat"
      backgroundSize="cover"
      flexDirection="column"
      padding="10.96px"
      mr="2px"
      mt={-2}
      mb={1}
    >
      <Flex flexDirection="column" gap="48.635px">
        <Flex>
          <Image
            src="../resources/Ellipse 675.png"
            alt={owner_id}
            width="27.4px"
            height="27.4px"
          />
          <Flex flexDirection="column">
            <Text
              fontFamily="Poppins"
              fontStyle="normal"
              fontWeight="600"
              fontSize="10.96px"
              lineHeight="100%"
              letterSpacing="-0.02em"
              color="#FFFFFF"
            >
              {owner_id} hell
            </Text>
            <Text
              fontFamily="Poppins"
              fontStyle="normal"
              fontWeight="400"
              fontSize="9.59px"
              lineHeight="100%"
              letterSpacing="-0.02em"
              color="#FFFFFF"
            >
              Scriptonite
            </Text>
            {/* <label className='text-[13px] text-white'>{owner_id}</label> */}
          </Flex>
        </Flex>
        <Flex flexDirection="column">
          <Flex
            bgImage="url('assets/images/cover-image-5.jpeg') "
            backgroundRepeat="no-repeat"
            backgroundSize="cover"
            width="126.04px"
            height="126.04px"
            border="15%"
            borderColor="white"
            justifyContent="center"
            alignItems="center"
          >
            <Image
              src="/assets/icons/play-icon.svg"
              alt="Play video"
              width="21.92px"
              height="18.93px"
            />
          </Flex>

          {/* <Image src="../resources/Rectangle 3467.png" /> */}
          <Box mt="12.33px">
            <VideoControl />
          </Box>
          <Flex justifyContent="space-between" alignItems="center">
            <Flex className="flex gap-4 items-center">
              <Image
                src="/assets/icons/share-icon.svg"
                alt="Share"
                width="16.44px"
                height="16.44px"
              />

              <Image
                src="/assets/icons/add-to-list-icon.svg"
                alt="Add to List"
                width="16.44px"
                height="16.44px"
              />
            </Flex>

            <Box className="charge-filter-effect  rounded-full flex justify-around py-1 px-2 backdrop-blur-sm bg-white/30 ">
              <Image
                src="../resources/Union2.png"
                alt="post rewarded"
                width="14px"
                height="21px"
              />
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

const renderTempo = (state: { tempos: string | any[]; }) => {
  for (let i = 0; i < state.tempos.length; i++) {
    if (typeof (state.tempos[i]) != "object") {
      const json = JSON.parse(state.tempos[i]);
      console.log("cnt: ", json[3])

      return (
        <Flex
          width="166.85px"
          height="295.92px"
          bgImage={`url(${json[2]})`}
          borderRadius="10.275px"
          marginLeft={0}
          backgroundRepeat="no-repeat"
          backgroundSize="cover"
          flexDirection="column"
          padding="10.96px"
          gap="57.135px"
          mt={-2}
          mb={1}
        >
          <Flex justifyContent="space-between">
            <Box className="charge-filter-effect  rounded-full flex justify-around py-1 px-1 backdrop-blur-sm bg-white/30 ">
              <Image
                src="../resources/Tempo.png"
                alt="tempo post"
                width="16.44px"
                height="16.44px"
                alignContent="center"
              />
            </Box>
            <Image
              src="/assets/icons/play-icon.svg"
              alt="play"
              width="16.44px"
              height="14.2px"
              marginTop="5.48px"
            />
          </Flex>
          <Flex flexDirection="column">
            <Center>
              <Image
                src="/assets/images/avatar-4.svg"
                alt="avatar"
                width="27.4px"
                height="27.4px"
              />
            </Center>
            <Center>
              <Box height="24px" width="121px">
                <Text
                  fontFamily="Poppins"
                  fontStyle="normal"
                  fontWeight="600"
                  fontSize="10.96px"
                  lineHeight="100%"
                  letterSpacing="-0.02em"
                  color="#FFFFFF"
                  mt="10.96px"
                  textAlign="center"
                >
                  {/* {owner_id} */}
                </Text>
              </Box>
            </Center>
            <Center>
              <Box height="24px" width="121px">
                <Text
                  fontFamily="Poppins"
                  fontStyle="normal"
                  fontWeight="400"
                  fontSize="9.59px"
                  lineHeight="100%"
                  letterSpacing="-0.02em"
                  color="#FFFFFF"
                  mt="4.96px"
                  textAlign="center"
                >
                  {json[3]}
                </Text>
              </Box>
            </Center>
            <Flex mt="78.255px" justifyContent="space-between" alignItems="center">
              <Box>
                <Image
                  src="/assets/icons/comment-icon.svg"
                  alt="comment"
                  width="16.44px"
                  height="16.44px"
                />
              </Box>
              <Box>
                <Image
                  src="/assets/icons/share-icon.svg"
                  alt="comment"
                  width="16.44px"
                  height="16.44px"
                />
              </Box>
              <Box>
                <Image
                  src="/assets/icons/save-post-icon.svg"
                  alt="comment"
                  width="16.44px"
                  height="16.44px"
                />
              </Box>
              <Box className="charge-filter-effect  rounded-full flex justify-around py-1 px-2 backdrop-blur-sm bg-white/30 ">
                <Image
                  src="../resources/Union.png"
                  alt="post rewarded"
                  width="14px"
                  height="21px"
                />
              </Box>
            </Flex>
          </Flex>
        </Flex>
      );
    } else {
      const json = JSON.parse(state.tempos[i][0]);
      return (
        <Flex
          width="166.85px"
          height="295.92px"
          bgImage={`url(${json[2]})`}
          borderRadius="10.275px"
          marginLeft={0}
          backgroundRepeat="no-repeat"
          backgroundSize="cover"
          flexDirection="column"
          padding="10.96px"
          gap="57.135px"
          mt={-2}
          mb={1}
        >
          <Flex justifyContent="space-between">
            <Image
              src="../resources/Label.png"
              alt="tempo post"
              width="27.4px"
              height="27.4px"
              alignContent="center"
            />
            <Image
              src="/assets/icons/play-icon.svg"
              alt="play"
              width="16.44px"
              height="14.2px"
              marginTop="5.48px"
            />
          </Flex>
          <Flex flexDirection="column">
            <Center>
              <Image
                src="/assets/images/avatar-4.svg"
                alt="avatar"
                width="27.4px"
                height="27.4px"
              />
            </Center>
            <Center>
              <Box height="24px" width="121px">
                <Text
                  fontFamily="Poppins"
                  fontStyle="normal"
                  fontWeight="600"
                  fontSize="10.96px"
                  lineHeight="100%"
                  letterSpacing="-0.02em"
                  color="#FFFFFF"
                  mt="10.96px"
                  textAlign="center"
                >
                  {/* {owner_id} */}
                </Text>
              </Box>
            </Center>
            <Center>
              <Box height="24px" width="121px">
                <Text
                  fontFamily="Poppins"
                  fontStyle="normal"
                  fontWeight="400"
                  fontSize="9.59px"
                  lineHeight="100%"
                  letterSpacing="-0.02em"
                  color="#FFFFFF"
                  mt="4.96px"
                  textAlign="center"
                >
                  {json[3]}
                </Text>
              </Box>
            </Center>
            <Flex mt="78.255px" justifyContent="space-between" alignItems="center">
              <Box>
                <Image
                  src="/assets/icons/comment-icon.svg"
                  alt="comment"
                  width="16.44px"
                  height="16.44px"
                />
              </Box>
              <Box>
                <Image
                  src="/assets/icons/share-icon.svg"
                  alt="comment"
                  width="16.44px"
                  height="16.44px"
                />
              </Box>
              <Box>
                <Image
                  src="/assets/icons/save-post-icon.svg"
                  alt="comment"
                  width="16.44px"
                  height="16.44px"
                />
              </Box>
              <Box className="charge-filter-effect  rounded-full flex justify-around py-1 px-2 backdrop-blur-sm bg-white/30 ">
                <Image
                  src="../resources/Union.png"
                  alt="post rewarded"
                  width="14px"
                  height="21px"
                />
              </Box>

            </Flex>
          </Flex>
        </Flex>
      );
    }
  }
};

const ListFeeds: React.FC<{ searchKey: string }> = ({ searchKey }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<Array<Feed>>([]);
  const [postsClone, setPostsClone] = useState<Array<Feed>>([]);
  const { feeds } = useSelector(selectPosts);
  const nearState: any = nearStore((state) => state);
  const dispatch = useDispatch();
  const [showCharge, setShowCharge] = useState<boolean>(false);
  const [showShare, setShowShare] = useState<boolean>(false);
  const [sharablePost, setSharablePost] = useState<Feed | null>(null);
  const [chargingLoading, setChargingLoading] = useState<boolean>(false);

  /* clicked post */
  const [activePost, setActivePost] = useState<Feed>();

  /* Start of event tracking */
  const [action, setAction] = useState("click");
  const timerRef: any = useRef();
  const isLongPress: any = useRef();

  const AWS = require('aws-sdk');
  const filebase = new AWS.S3({
    endpoint: 'https://s3.filebase.com',
    signatureVersion: 'v4',
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  });

  function startPressTimer() {
    isLongPress.current = false;
    timerRef.current = setTimeout(() => {
      isLongPress.current = true;
      setAction("longpress");
    }, 500);
  }

  function handleOnClick(e: any) {
    console.log("handleOnClick");
    if (isLongPress.current) {
      setShowCharge(true);
      console.log("Is long press - not continuing.");
      setAction("click");
      return;
    }
    // handleSimpleCharge();
    setAction("click");
  }

  function onClick(e: any, post: Feed) {
    // alert(post.post_id)
    setActivePost(post);
    handleOnClick(e);
  }

  function handleOnMouseDown() {
    console.log("handleOnMouseDown");
    startPressTimer();
  }

  function handleOnMouseUp() {
    console.log("handleOnMouseUp");
    clearTimeout(timerRef.current);
  }

  function handleOnTouchStart() {
    console.log("handleOnTouchStart");
    startPressTimer();
  }

  function handleOnTouchEnd() {
    if (action === "longpress") return;
    console.log("handleOnTouchEnd");
    clearTimeout(timerRef.current);
  }

  /*  End of event tracking */

  useEffect(() => {
    if (isLoading) {
      initNearConnection(nearState);
      setIsLoading(false);
    }
  }, [isLoading]);

  useEffect(() => {
    useGetPosts(nearState, dispatch);
  }, [isLoading, nearState.accountId, nearState.pnftContract]);

  useEffect(() => {
    const getTempo = async () => {
      if (nearState.pnftContract) {
        let userIds = await nearState.pnftContract.get_users_ids({ user_id: nearState.accountId });
        let temposArray: (string | string[])[] = [];
        let finalTempoArray: string[] = [];
        userIds.forEach(async (userId: any) => {
          const params = {
            Key: `aerx-Tempo-for-${userId}`,
            Bucket: "aerx-tempo",
          };
          await filebase.getObject(params, (err: any, data: any) => {
            if (data) {
              const tempos = Buffer.from(data.Body, 'utf8').toString();
              const tempoArray = tempos.split("##aerx-tempo##");
              if (tempoArray.length > 1) {
                tempoArray.forEach((tempAry) => {
                  temposArray.push(tempAry);
                })
              } else {
                temposArray.push(tempoArray);
              }
            }
          })

        })
        nearState.setTempos(temposArray)
      }
    }
    getTempo();
  }, [isLoading, nearState.accountId, nearState.pnftContract]);

  useEffect(() => {
    if (feeds.length > 0) {
      manipulateFeeds(feeds, false);
    }
  }, [feeds]);

  //Todo: fix the post id conflict, make charge button disabled after clicking
  /*  handle charging */
  const handleSimpleCharge = async (postId: string) => {
    /* call the contract method to do simple charge */
    if (chargingLoading) return;
    setIsLoading(true);
    const post_id = Number(postId);
    // alert(post_id)
    try {
      await nearState.pnftContract
        ?.charge(
          {
            charger_id: nearState.accountId,
            post_id: post_id,
            amount: "1000000000000000000000000",
          },
          "300000000000000"
        )
        .then(() => {
          getBalance(nearState);
        });
      console.log("Post Charged successfully");
      toast.success("Post charged successfully");
    } catch (err) {
      console.error("Unable to charge post due to: ", err);
      toast.error("Unable to charge post");
    }
    initPostChargersList(
      post_id,
      nearState.accountId,
      nearState.accountId,
      false
    );
    const postCharge = {
      post_id: post_id,
      chargers: nearState.accountId,
    };
    setChargingLoading(false);
    dispatch(setPostChargers(postCharge));
  };

  //Todo: make confirm button disabled after clicking
  const handleValueBasedCharge = async (valueToCharge: number) => {
    setChargingLoading(true);
    const post_id = Number(activePost?.post_id);
    try {
      await nearState.pnftContract
        ?.charge(
          {
            charger_id: nearState.accountId,
            post_id: post_id,
            amount: `${valueToCharge}` + "000000000000000000000000",
          },
          "300000000000000"
        )
        .then(() => {
          getBalance(nearState);
        });
      console.log("Post Charged successfully");
      toast.success("Post charged successfully");
    } catch (err) {
      console.error("Unable to charge post due to: ", err);
      toast.error("Unable to charge post");
    }
    setChargingLoading(false);
    initPostChargersList(
      post_id,
      nearState.accountId,
      nearState.accountId,
      false
    );
    const postCharge = {
      post_id: post_id,
      chargers: nearState.accountId,
    };
    // alert(JSON.stringify(postCharge))
    dispatch(setPostChargers(postCharge));
    setShowCharge(false);
  };
  /*  end of handle charging*/

  const manipulateFeeds = async (feeds: Array<Feed>, forClone: boolean) => {
    const newList = [...feeds].reverse();
    let manipulatedFeeds: Feed[] = [];
    let row = 1;
    newList?.map((feed: Feed, index: number) => {
      if (row % 2 !== 0) {
        manipulatedFeeds.push({ ...feed, type: "text" });
        manipulatedFeeds.push(videoFeed);
      } else {
        manipulatedFeeds.push(tempoFeed);
        manipulatedFeeds.push({ ...feed, type: "text" });
      }
      row += 1;
      if (index === newList.length - 1) {
        if (!forClone) {
          setPosts(manipulatedFeeds);
          setPostsClone(manipulatedFeeds);
        } else {
          setPostsClone(manipulatedFeeds);
        }
      }
    });
  };

  useEffect(() => {
    handleSearchByPostTitle(searchKey);
  }, [searchKey]);

  const handleSearchByPostTitle = (searchKey: string) => {
    if (
      searchKey === "" ||
      searchKey === null ||
      searchKey?.replace(/\s/g, "").length === 0
    ) {
      setPostsClone(posts);
      return;
    }
    const filteredPosts = postsClone.filter((post: Feed) => {
      return post.metadata.title
        .toLowerCase()
        .includes(searchKey.toLowerCase());
    });
    manipulateFeeds(filteredPosts, true);
  };

  const initializeShare = (feed: Feed) => {
    setSharablePost(feed);
    setShowShare(true);
  };

  return (
    <>
      <Toaster />
      <div className="w-[487.72px]  flex  flex-wrap gap-2 gap-y-3">
        {postsClone.map((post: Feed, index: number) => (
          <div
            key={index}
            style={{
              width:
                post.type === "text"
                  ? "312.48px"
                  : post.type === "video"
                    ? "166.85px"
                    : "166.85px",
            }}
          >
            {post.type === "text" && (
              <TextPost
                feed={post}
                handleOnClick={(e: any, feed: Feed) => onClick(e, feed)}
                onClickCapture={(e: any, feed: Feed) =>
                  handleSimpleCharge(feed.post_id)
                }
                handleOnMouseDown={handleOnMouseDown}
                handleOnMouseUp={handleOnMouseUp}
                handleOnTouchStart={handleOnTouchStart}
                handleOnTouchEnd={handleOnTouchEnd}
                initializeShare={initializeShare}
              />
            )}
            {post.type === "video" && <VideoPost {...post} />}
            {post.type === "tempo" && renderTempo(nearState)}
          </div>
        ))}
      </div>
      {showCharge && (
        <ChargePost
          onClose={() => setShowCharge(false)}
          onCharge={handleValueBasedCharge}
          loading={chargingLoading}
        />
      )}
      {showShare && (
        <SharePost
          post={sharablePost as Feed}
          onClose={() => setShowShare(false)}
        />
      )}
    </>
  );
};
export default ListFeeds;
