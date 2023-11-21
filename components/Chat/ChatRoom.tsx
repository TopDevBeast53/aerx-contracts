import React, { useEffect, useState, useRef } from "react"
import { Message } from "../../types/Message"
import { EMessageType } from "../../enums/EMessageType"
import { useDispatch, useSelector } from "../../store/store"
import {
  collapseChat,
  minimizeChat,
  selectModules,
} from "../../store/slices/modulesSlices"
import SendTokens from "../SendTokens"
import { IMessageItem } from "."
import {
  selectMessages,
  setDirectMessages,
} from "../../store/slices/messagesSlice"
import { Box, Button, Flex, Text } from "@chakra-ui/react"
import { SmoothCorners } from "react-smooth-corners"
import Image from "next/image"
import { Transaction } from "../../components/SendTokens/ui/Transaction"
import { nearStore } from "../../store/near"

const PrimaryHeader: React.FC = () => {
  const { chat } = useSelector(selectModules)
  const dispatch = useDispatch()
  const handleCollapseChat = () => {
    if (chat.default) {
      dispatch(minimizeChat())
    } else if (chat.minimized) {
      dispatch(collapseChat())
    }
  }
  return (
    <Flex className="flex justify-between relative max-h-[32px]">
      <Flex alignItems="center" gap="6px">
        <Image
          src={"/assets/icons/chat-room-header-ico.svg"}
          alt="valuengr"
          width={32}
          layout="fixed"
          height={32}
        />
        <Text
          fontFamily="Poppins"
          fontSize="14px"
          fontWeight="600"
          color="#ffffff"
          lineHeight="100%"
          letterSpacing="-0.02em"
        >
          Valuengr
        </Text>
      </Flex>
      <Flex alignItems="center">
        <Box className="cursor-pointer flex items-center hover:bg-black-light p-2 transition duration-150 ease-in-out rounded-[10px]">
          <Image
            src="/resources/Add Users.png"
            alt="Add new user"
            layout="fixed"
            width={18}
            height={18}
          />
        </Box>
        <Box
          className="cursor-pointer flex items-center hover:bg-black-light p-[3px]  transition duration-150 ease-in-out rounded-[10px]"
          onClick={handleCollapseChat}
        >
          <Image
            src="/resources/Hide.png"
            layout="fixed"
            alt="Menu"
            width={27}
            height={27}
          />
        </Box>
      </Flex>
    </Flex>
  )
}

const SecondaryHeader: React.FC<{
  activeMessage: IMessageItem
}> = ({ activeMessage }) => {
  const nearState: any = nearStore((state) => state);
  const babylonViewer = nearState.babylonViewer;
  
  const load3d = async(avatarUrl: string | string[]) => {
    if (avatarUrl?.includes(".glb")) {
      const babylon = document.getElementById("babylon-element-chat-room");
      if (babylonViewer) {
        if (babylon) {
          new babylonViewer.DefaultViewer(babylon, {
            extends: "none",
            templates: {
              main: {
                html: "<canvas id='my-babylon-canvas' style='height: 100%;width: 100%;flex: 1;touch-action: none;' class='babylonjs-canvas' touch-action='none'></canvas>",
                params: {
                  ["no-escape"]: true,
                  ["babylon-font"]: `https://viewer.babylonjs.com/babylon.woff`,
                },
              },
              ["loadingScreen"]: {
                html: "<img id='loading-image' style='height: 2rem;width: 2rem;' src='{{loadingImage}}' >",
                params: {
                  ["backgroundColor"]: "#0000004d",
                  ["loadingImage"]: "https://cdn.discordapp.com/attachments/922880841238065176/1024013739395141682/Loader.png"
                }
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
              url: avatarUrl,
              // scaling: {
              //   x: 3.5,
              //   y: 3,
              //   z: 3,
              // },
              // position: {
              //   x: 0,
              //   y: -2,
              //   z: 1
              // }
            },
          })
        }
        
      }else{
        console.log("Babylon is null")
      }
    }


  }

  // useEffect(() => {
   
  //     (async () => {
  //       await load3d(activeMessage?.avatar)
  //       console.log("babylon chatroom is working")
  //     })();
    
  // }, [activeMessage?.avatar])

   
  
  

  return (
    <Flex
      // mt="17.65px"
      gap=""
      className="flex mt-3 justify-between   relative mb-1"
    >
      <Flex alignItems="center" className="relative left-1   ">
        <Button variant="link" minWidth="unset" marginRight="8px">
          <Image
            src="/icons/back-button.svg"
            width="20px"
            height="20px"
            alt="Chat back button"
            className="rounded-full"
          />
        </Button>
        {!activeMessage?.avatar.includes(".glb") && (
          <Image
            src={activeMessage?.avatar || "/assets/images/avatar-1.svg"}
            width="27.4px"
            height="27.4px"
            alt="Avatar"
            priority
            className="rounded-full"
          />
        )}
        {activeMessage?.avatar.includes(".glb") && (
          <Box
            width="27.4px"
            height="27.4px"
            borderRadius="13.7px"
            borderColor="white"
            border="1px solid"
          >
            <div
              id="babylon-element-chat-room"
              style={{ width: "100%", height: "100%" }}
            ></div>
          </Box>
        )}
        <Flex
          flexDirection="column"
          className="ml-2 w-fit"
          gap="2.74"
          // ml="8.22px"
          // width="166px"
        >
          <Text
            fontFamily="Poppins"
            fontSize="14px"
            fontWeight="500"
            color="#FFFFFF"
            lineHeight="100%"
            letterSpacing="-0.02em"
          >
            {activeMessage?.name || "Anna Bylik"}
          </Text>
          <Text
            fontFamily="Poppins"
            fontSize="12px"
            fontWeight="400"
            color="#FFFFFF80"
            lineHeight="100%"
            letterSpacing="-0.02em"
          >
            Last seen recently
          </Text>
        </Flex>
      </Flex>
      <Flex gap="14px" alignItems="center">
        <Image
          src="/assets/icons/audio-call-icon.svg"
          alt="Phone"
          layout="fixed"
          className="cursor-pointer hover:scale-110  transition ease-in-out duration-400 "
          width={18}
          height={18}
        />
        <Image
          src="/assets/icons/video-call-icon.svg"
          alt="Video"
          layout="fixed"
          className="cursor-pointer hover:scale-110  transition ease-in-out duration-400 "
          width={18}
          height={18}
        />
      </Flex>
    </Flex>
  )
}

const MessagesWrapper: React.FC<{ activeReceiver: IMessageItem }> = ({
  activeReceiver,
}) => {
  const userId: string = "2"
  const [isScroll, setIsScroll] = useState<boolean>(true)
  const messageRef = useRef<HTMLDivElement | null>(null)
  const nearState = nearStore((state) => state)
  const dispatch = useDispatch()
  const { messages } = useSelector(selectMessages)

  const RenderSenderMessage: React.FC<{
    content: string
    type: EMessageType
  }> = ({ content, type }) => {
    return (
      <SmoothCorners corners="35">
        <div className="flex justify-end">
          <div className="  mr-2 bg-black-light p-4 px-4 w-[max-content] max-w-[90%] rounded-[20px] rounded-br-[2px]">
            {type === EMessageType.TEXT && (
              <p className="text-white text-[11px]">{content}</p>
            )}
            {type === EMessageType.AUDIO && (
              <Image
                src="/assets/icons/audio-icon.svg"
                alt="voice note"
                width={20}
                height={20}
              />
            )}
          </div>
        </div>
      </SmoothCorners>
    )
  }

  const RenderRecipientMessage: React.FC<{
    content: string
    type: EMessageType
  }> = ({ content, type }) => {
    return (
      <SmoothCorners corners="35">
        <div className=" bg-primary p-3 px-4 w-[max-content] max-w-[90%] ml-2 rounded-[20px] rounded-bl-[2px]">
          {type === EMessageType.TEXT && (
            <p className="text-white text-[11px]">{content}</p>
          )}
          {type === EMessageType.AUDIO && (
            <Image
              src="/assets/icons/audio-icon.svg"
              alt="voice note"
              width={100}
              height={30}
              className=""
            />
          )}
        </div>
      </SmoothCorners>
    )
  }

  const RenderAction: React.FC<{ content: string; time: string }> = ({
    content,
    time,
  }) => {
    return (
      <div className="rounded-[20px] border-white border border-opacity-[15%]  flex justify-between px-4 py-3 items-center border-dashed">
        <div className="flex gap-2 items-center">
          <Image
            src="/assets/icons/save-icon.svg"
            alt="save"
            width={30}
            height={30}
          />
          <label className="text-white font-bolder">{content}</label>
          <label className="text-sm">Received</label>
        </div>
        <div>
          <label className="text-sm">{time}</label>
        </div>
      </div>
    )
  }

  const handleScroll = (event: any) => {
    let isScrolling
    setIsScroll(true)
    clearTimeout(isScrolling)
    isScrolling = setTimeout(() => {
      setIsScroll(false)
    }, 4000)
  }

  // useEffect(() => {
  //   window.addEventListener("scroll", handleScroll)

  //   return () => {
  //     window.removeEventListener("scroll", handleScroll)
  //   }
  // }, [])

  useEffect(() => {
    messageRef.current?.lastElementChild?.scrollIntoView()
  }, [messages])

  return (
    <div
      className={`h-full text-center overflow-y-scroll ${
        isScroll
          ? " transition ease-in-out duration-300"
          : " scrollbar-hide transition ease-in-out duration-300"
      }`}
      // height="746%"
      // width="100%"
      ref={messageRef}
      // pb="25px"
      onScroll={handleScroll}
    >
      {messages.map(
        (
          { sender, recipient, content, type, createdAt }: Message,
          index: number
        ) => (
          <div key={index} className="mt-4">
            {type !== EMessageType.ACTION && (
              <>
                {sender?.id === nearState.accountId && (
                  <RenderSenderMessage content={content} type={type} />
                )}
                {sender?.id !== nearState.accountId && (
                  <RenderRecipientMessage content={content} type={type} />
                )}
              </>
            )}
            {type === EMessageType.ACTION && (
              <RenderAction content={content} time={createdAt as string} />
            )}
          </div>
        )
      )}
    </div>
  )
}

const SendMessage: React.FC<{
  onSend: () => void
  activeReceiver: IMessageItem
}> = ({ onSend, activeReceiver }) => {
  const [message, setMessage] = useState<string>("")
  const [prevChatsBetweenUsers, setPrevChatsBetweenUsers] = useState<string>("")
  const [prevChats, setPrevChats] = useState<string>()
  const nearState = nearStore((state) => state)
  const { messages } = useSelector(selectMessages)

  const dispatch = useDispatch()

  const AWS = require("aws-sdk")
  const filebase = new AWS.S3({
    endpoint: "https://s3.filebase.com",
    signatureVersion: "v4",
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  })

  const getChat = (caller: string, receiver: string) => {
    const params = {
      Key: `aerx-chat between ${caller},${receiver}`,
      Bucket: "aerx-chats",
    }
    try {
      return filebase.getObject(params, (err: any, data: any) => {
        if (err) {
          const param = {
            Key: `aerx-chat between ${receiver},${caller}`,
            Bucket: "aerx-chats",
          }
          filebase.getObject(param, (err: any, data: any) => {
            if (err) {
              console.log("Chat does not exist")
            } else {
              const prevChat = Buffer.from(data.Body, "utf8").toString()
              nearState.setPrevChats(prevChat)
              setPrevChats(prevChat)
              return prevChat
            }
          })
        } else {
          const prevChat = Buffer.from(data.Body, "utf8").toString()
          nearState.setPrevChats(prevChat)
          setPrevChats(prevChat)
          return prevChat
        }
      })
    } catch (err) {
      console.error("try caught error: ", err)
    }
  }

  //Todo: use a function to handle the init chat on second try and env to handle the aerxchat secretkey
  const sendMessage = async (
    caller: string,
    receiver: string,
    message: string
  ) => {
    const params = {
      Key: `aerx-chat between ${caller},${receiver}`,
      Bucket: "aerx-chats",
    }
    try {
      filebase.getObject(params, (err: any, data: any) => {
        if (err) {
          const param = {
            Key: `aerx-chat between ${receiver},${caller}`,
            Bucket: "aerx-chats",
          }
          filebase.getObject(param, (err: any, data: any) => {
            if (err) {
              const aerx_chat = {
                Bucket: "aerx-chats",
                Key: `aerx-chat between ${[caller, receiver]}`,
                Body:
                  "[" +
                  `"${Date.now()}", ` +
                  " " +
                  `"${caller}",` +
                  " " +
                  `"${message}"` +
                  "]",
                ContentType: "aerx-chat",
                Metadata: {
                  sender: `${caller} `,
                  receiver: `${receiver} `,
                },
              }
              filebase.putObject(aerx_chat, (err: any, data: any) => {
                if (err) {
                  console.log("Error! unable to upload chat ", err.stack)
                } else {
                  console.log("Chat uploaded succesfully ", data)
                }
              })
            } else {
              const prevChat = Buffer.from(data.Body, "utf8").toString()
              const aerx_chat = {
                Bucket: "aerx-chats",
                Key: `aerx-chat between ${[receiver, caller]}`,
                Body:
                  "[" +
                  `"${Date.now()}", ` +
                  " " +
                  `"${caller}",` +
                  " " +
                  `"${message}"` +
                  "]" +
                  "##aerx-chat##" +
                  `${prevChat}`,
                ContentType: "aerx-chat",
                Metadata: {
                  sender: `${receiver} `,
                  receiver: `${caller} `,
                },
              }
              filebase.putObject(aerx_chat, (err: any, data: any) => {
                if (err) {
                  console.log("Error! unable to upload chat ", err.stack)
                } else {
                  console.log("Chat uploaded succesfully ", data)
                }
              })
            }
          })
        } else {
          const prevChat = Buffer.from(data.Body, "utf8").toString()
          const aerx_chat = {
            Bucket: "aerx-chats",
            Key: `aerx-chat between ${[caller, receiver]}`,
            Body:
              "[" +
              `"${Date.now()}", ` +
              " " +
              `"${caller}",` +
              " " +
              `"${message}"` +
              "]" +
              "##aerx-chat##" +
              `${prevChat}`,
            ContentType: "aerx-chat",
            Metadata: {
              sender: `${caller} `,
              receiver: `${receiver} `,
            },
          }
          filebase.putObject(aerx_chat, (err: any, data: any) => {
            if (err) {
              console.log("Error! unable to upload chat ", err.stack)
            } else {
              console.log("Chat uploaded succesfully ", data)
            }
          })
        }
      })
    } catch (err) {
      console.error("try caught error: ", err)
    }
  }

  const handleSendMessageCapture = async () => {
    await getChat(nearState.accountId, activeReceiver.accountId)
  }

  const handleSendMessage = async () => {
    await getChat(nearState.accountId, activeReceiver.accountId)
    console.log(activeReceiver.accountId)
    const textArea = document.getElementById("textarea")!

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: {
        id: nearState.accountId,
        name: nearState.accountId,
      },
      recipient: {
        id: activeReceiver.accountId,
        name: activeReceiver.name,
        avatar: activeReceiver.avatar,
      },
      content: message,
      createdAt: Date.now().toString(),
      type: EMessageType.TEXT,
    }

    const newMessages = [...messages, newMessage]
    dispatch(setDirectMessages(newMessages))

    try {
      if (message !== "") {
        await sendMessage(
          nearState.accountId,
          activeReceiver.accountId,
          message
        )
      }
      setMessage("")
    } catch (error) {
      console.error("Error while sending message")
      setMessage("")
    }
  }

  return (
    <Flex className="flex bg-black-dark w-full max-h-[36px]">
      <Flex gap="6px" grow={1} alignItems="center">
        <Image
          src="/assets/icons/tag-icon.svg"
          alt="Tag"
          className="cursor-pointer hover:scale-110 transition ease-in-out duration-300"
          layout="fixed"
          width="20px"
          height="20px"
        />
        <input
          type="text"
          pattern="/^\s*$/"
          placeholder="Type message..."
          value={message}
          className={`placeholder-[#565656] placeholder:text-[15px] h-full tracking-[-0.02em] leading-4 block items-stretch bg-transparent  focus:outline-none text-white text-[13px]  `}
          required
          style={{
            resize: "none",
          }}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDownCapture={(e) => {
            if (e.key === "Enter") {
              const resultMessage: boolean = message.trim().length === 0
              if (!resultMessage) {
                handleSendMessageCapture()
              }
            }
          }}
          onKeyDown={(e) => {
            const resultMessage: boolean = message.trim().length === 0

            if (!resultMessage) {
              if (e.key === "Enter") {
                handleSendMessage()
              }
            }
          }}
        />
      </Flex>
      <div className="w-max">
        <Image
          src="/resources/Group 55371.png"
          alt="send message"
          width="36px"
          height="36px"
          className="cursor-pointer hover:bg-black-light rounded-full transition ease-in-out duration-300  "
          onClick={onSend}
        />
      </div>
    </Flex>
  )
}

const ChatRoom: React.FC<{
  activeMessage: IMessageItem
}> = ({ activeMessage }) => {
  const [initializeSendToken, setInitializeSendToken] = useState<boolean>(false)
  return (
    <>
      {initializeSendToken && (
        <SendTokens onClose={() => setInitializeSendToken(false)} />
      )}
      <div className="p-3 flex flex-col z-0 h-full">
        <PrimaryHeader />
        <SecondaryHeader activeMessage={activeMessage} />
        <div className="grow flex flex-col justify-between  ">
          <MessagesWrapper activeReceiver={activeMessage} />
          {/* <Transaction
            amount={"+12000"}
            time={"21.37"}
            situation={"Received"}
          /> */}
          <SendMessage
            onSend={() => setInitializeSendToken(true)}
            activeReceiver={activeMessage}
          />
        </div>
      </div>
    </>
  )
}

export default ChatRoom
