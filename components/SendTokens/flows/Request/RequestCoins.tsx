import React, { useState } from 'react'
import { nearStore } from '../../../../store/near';
import { selectActiveReceiver } from '../../../../store/slices/receiverSlice';
import {useDispatch, useSelector } from '../../../../store/store';
import Button from '../../../Elements/Button';
import SelectCoin from '../../../SelectCoin';
import StepIndicator from '../../../StepIndicator';
import Big from 'big.js';
import { Message } from "../../../../types/Message";
import { EMessageType } from "../../../../enums/EMessageType";
import { selectMessages, setDirectMessages } from '../../../../store/slices/messagesSlice';


interface IProps {
    setTransactionStatus: (status: 'pending' | 'success' | 'failed') => void;
}
const RequestCoins: React.FC<IProps> = ({ setTransactionStatus }) => {
    const { accountId } = useSelector(selectActiveReceiver)
    const nearState = nearStore((state) => state)
    const [loading, setLoading] = useState<boolean>(false);
    const [coins, setCoins] = useState<string>();
    const [amount, setAmount] = useState<string>();
    const [rawAmount, setRawAmount] = useState<number>();
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
            setRawAmount(value)
            const inputBigN = new Big(value || 0);
            const formattedInput = inputBigN.mul("10e23").toFixed(0);
            setAmount(`${formattedInput}`);
        }
        //else change colour

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

    const handleSend = async () => {
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
                content: `Requested ${rawAmount} AEX`,
                createdAt: Date.now().toString(),
                type: EMessageType.TEXT,
              };
            const newMessages = [...messages, newMessage];
            dispatch(setDirectMessages(newMessages));
            try {
                await uploadRequest(nearState.accountId, accountId, "CoinRequest", amount, "").then(() => {
                    setTransactionStatus('success')
                })
            } catch (err) {
                setTransactionStatus('failed')
            }
        }
        
    }
    return (
        <div className='w-[300px]'>
            <div className='w-full flex justify-around'>
                <label className='text-white'>Invoice</label>
            </div>

            <div className='w-full mt-6'>
                <div className='px-2 w-full'>
                    <div className='flex w-full justify-between bg-[#131313] p-2 rounded-[10px]'>
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
                    
                    <div className='mt-6'>
                        <Button
                            icon={!loading ? '/assets/icons/right-arrow-icon.svg' : ''}
                            label={loading ? 'Requesting...' : 'Request'}
                            onClick={() => handleSend()}
                        />
                    </div>

                    <div className='w-full flex my-6 justify-around'>
                        <div className='flex gap-4'>
                            <StepIndicator />
                            <StepIndicator bg="purple" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RequestCoins;
