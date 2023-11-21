import Big from 'big.js';
import Image from 'next/image';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { EMessageType } from '../../../../../enums/EMessageType';
import { nearStore } from '../../../../../store/near';
import { selectMessages, setDirectMessages } from '../../../../../store/slices/messagesSlice';
import { selectActiveReceiver } from '../../../../../store/slices/receiverSlice';
import {useDispatch, useSelector } from '../../../../../store/store';
import Button from '../../../../Elements/Button';
import SelectCoin from '../../../../SelectCoin';
import SelectDealType from '../../../../SelectDealType';
import StepIndicator from '../../../../StepIndicator';
import { Message } from "../../../../../types/Message";

interface IProps {
   setFlow: (flow: number) => void;
}
const DealServiceCoins: React.FC<IProps> = ({ setFlow }) => {
    const { accountId } = useSelector(selectActiveReceiver)
    const nearState = nearStore((state) => state)
    const [loading, setLoading] = useState<boolean>(false);
    const [coins, setCoins] = useState<string>();
    const [message, setMessage] = useState<string>("");
    const [amount, setAmount] = useState<string>();
    const [level, setLevel] = useState<number>(0)
    const dispatch = useDispatch();
    const { messages } = useSelector(selectMessages);
    const AWS = require("aws-sdk");
    const filebase = new AWS.S3({
    endpoint: "https://s3.filebase.com",
    signatureVersion: "v4",
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
    });

    
    const handleAmount = (e: { target: { value: any; }; }) => {
        const value = e.target.value;
        if (value > 0) {
            //change colour
            nearState.setServiceAmount(value)
            const inputBigN = new Big(value || 0);
            const formattedInput = inputBigN.mul("10e23").toFixed(0);
            setAmount(`${formattedInput}`);
        }
        //else change colour

    }
    const handleSend = async () => {
        setFlow(1)
    }

    const uploadRequest = async (caller: any, receiver: string | null, type: string, amount: string | undefined, message: string) => {
        const params = {
          Key: `aerx-${type} between ${caller},${receiver}`,
          Bucket: "aerx-requests",
        };
        try {
          filebase.getObject(params, (err: any, data: { Body: WithImplicitCoercion<string> | { [Symbol.toPrimitive](hint: "string"): string; }; }) => {
            if (err) {
              const param = {
                Key: `aerx-${type} between ${receiver},${caller}`,
                Bucket: "aerx-requests",
              };
              filebase.getObject(param, (err: any, data: { Body: WithImplicitCoercion<string> | { [Symbol.toPrimitive](hint: "string"): string; }; }) => {
                if (err) {
                  const aerx_request = {
                    Bucket: "aerx-requests",
                    Key: `aerx-${type} between ${[caller, receiver]}`,
                    Body:
                      "[" +
                      `"${Date.now()}",` +
                      " " +
                      `"${caller}",` +
                      " " +
                      `"${message}",` +
                      " " +
                      `"${amount}"` +
                      "]",
                    ContentType: `aerx-${type}`,
                    Metadata: {
                      sender: `${caller} `,
                      receiver: `${receiver} `,
                    },
                  };
                  filebase.putObject(aerx_request, (err: { stack: any; }, data: any) => {
                    if (err) {
                      console.log("Error! unable to upload Request ", err.stack);
                    } else {
                      console.log("Request uploaded succesfully ", data);
                    }
                  });
                } else {
                  const prevRequests = Buffer.from(data.Body, "utf8").toString();
                  const aerx_request = {
                    Bucket: "aerx-requests",
                    Key: `aerx-${type} between ${[receiver, caller]}`,
                    Body:
                      "[" +
                      `"${Date.now()}",` +
                      " " +
                      `"${caller}",` +
                      " " +
                      `"${message}",` +
                      " " +
                      `"${amount}"` +
                      "]" +
                      "##aerx-request##" +
                      `${prevRequests}`,
                    ContentType: `aerx-${type}`,
                    Metadata: {
                      sender: `${receiver} `,
                      receiver: `${caller} `,
                    },
                  };
                  filebase.putObject(aerx_request, (err: { stack: any; }, data: any) => {
                    if (err) {
                      console.log("Error! unable to upload Request ", err.stack);
                    } else {
                      console.log("Request uploaded succesfully ", data);
                    }
                  });
                }
              });
            } else {
              const prevRequests = Buffer.from(data.Body, "utf8").toString();
              const aerx_request = {
                Bucket: "aerx-requests",
                Key: `aerx-${type} between ${[caller, receiver]}`,
                Body:
                  "[" +
                  `"${Date.now()}",` +
                  " " +
                  `"${caller}",` +
                  " " +
                  `"${message}",` +
                  " " +
                  `"${amount}"` +
                  "]" +
                  "##aerx-request##" +
                  `${prevRequests}`,
                ContentType: `aerx-${type}`,
                Metadata: {
                  sender: `${caller} `,
                  receiver: `${receiver} `,
                },
              };
              filebase.putObject(aerx_request, (err: { stack: any; }, data: any) => {
                if (err) {
                  console.log("Error! unable to upload Request ", err.stack);
                } else {
                  console.log("Request uploaded succesfully ", data);
                }
              });
            }
          });
        } catch (err) {
          console.error("try caught error: ", err);
        }
      };

    const handleNextStep = async () => {
        if (accountId != null) {
            const newMessage: Message = {
                id: Date.now().toString(),
                sender: {
                  id: nearState.accountId,
                  name: nearState.accountId,
                },
                recipient: {
                  id: accountId!,
                  name: accountId!,
                  avatar: accountId!,
                },
                content: `Requested ${nearState.serviceAmount} AEX with the memo: ${message}`,
                createdAt: Date.now().toString(),
                type: EMessageType.TEXT,
              };
            const newMessages = [...messages, newMessage];
            dispatch(setDirectMessages(newMessages));
            try {
                await uploadRequest(nearState.accountId, accountId, "CoinDeal", amount, message).then(() => {
                    setFlow(2)
                })
            } catch (err) {
                toast.error("Unable to made deal Request try again later")
            }
        }
        
    }
    return (
        <div className='w-[300px]'>
            <div className='w-full flex justify-around'>
                <label className='text-white'>Send coins</label>
            </div>

            <div className='w-full mt-6'>
                <div className='px-2 w-full'>
                    <div>
                        <SelectDealType />
                    </div>
                    <div className='flex w-full mt-2 justify-between bg-[#131313] p-2 rounded-[10px]'>
                        <div className='z-10'>
                            <SelectCoin />
                        </div>
                        <div className=''>
                            <input
                                type='number'
                                className='text-sm text-right text-white focus:outline-none bg-transparent w-[max-content]'
                                placeholder='0'
                                onChange={handleAmount}
                            />
                        </div>
                    </div>
                    <div className='mt-2 flex justify-between'>
                        <label className='text-[11px] text-white opacity-[30%]'>Available to send</label>
                        <label className='text-[11px] text-white opacity-[30%]'>{nearState?.aexBalance} AEX</label>
                    </div>

                {level==0 && 
                <>
                   <div className='mt-4 flex w-full justify-between bg-[#131313] px-4 py-3 rounded-[10px]'>
                   <Image src="/assets/icons/time-icon.svg" width={20} height={20} alt="time" />
                   <label className='text-sm text-white '>15</label>
                   <label className='text-sm text-white opacity-[30%]'>min</label>
                  </div>

                    <div className='mt-4'>
                        <Button
                            icon={!loading ? '/assets/icons/right-arrow-icon.svg' : ''}
                            label={loading ? 'Sending...' : 'Send'}
                            onClick={() => setLevel(1)}
                            />
                    </div>

                    <div className='w-full flex my-6 justify-around'>
                        <div className='flex gap-4'>
                            <StepIndicator />
                            <StepIndicator bg="purple" />
                        </div>
                    </div>
                    </>
                    }
                {(level == 1) && 
                <>
                   <textarea className='w-full mt-4 bg-[#131313] px-4 py-3 rounded-[10px] text-white
                   text-[11px]
                   ' placeholder='Add a note'
                   rows={6}
                   style={{
                    resize: 'none'
                   }}
                   onChange={(e) => setMessage(e.target.value)}
                   />

                    <div className='mt-4'>
                        <Button
                            icon={!loading ? '/assets/icons/right-arrow-icon.svg' : ''}
                            label={loading ? 'Next level' : 'Next level'}
                            onClick={handleNextStep}
                            />

                    </div>

                    <div className='w-full flex my-6 justify-around'>
                        <div className='flex gap-4'>
                            <StepIndicator />
                            <StepIndicator bg="purple" />
                        </div>
                    </div>
                    </>
                    }
                </div>
            </div>
        </div>
    )
}

export default DealServiceCoins;