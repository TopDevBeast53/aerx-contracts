import { time } from 'console';
import Image from 'next/image';
import React, { useState } from 'react'
import { NFT } from '../../../../../types/NFT';
import Button from '../../../../Elements/Button';
import StepIndicator from '../../../../StepIndicator';
import { nearStore } from "../../../../../store/near";

interface IProps {
    selectedNFTs: Array<NFT>
}
const ConfirmSendNFT: React.FC<IProps> = ({ selectedNFTs }) => {
    const [rotationDegree, setRotationDegree] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const nearState = nearStore((state) => state);

    setTimeout(() => {
        if (rotationDegree < 360) {
            setRotationDegree(rotationDegree + 1);
        }
        else {
            setRotationDegree(0);
        }
    }, 5);

    setTimeout(() => {
        setLoading(false);
    }, 2000);
    return (
        <div className='w-[300px] h-[max-content] pb-2 items-center flex flex-col'>
            <label className='text-white text-sm'>Deal NFT</label>
            <div className='w-full bg-green-500 relative flex justify-around  mt-[2em] ml-[1em]'>
                <div className='w-[80px]'>
                    {/* <Image src="/assets/icons/inactive-action-loader.svg" alt="loading" width={100} height={100} /> */}
                </div>

                {loading &&
                    <div className='absolute top-0 w-[100px]'>
                        <Image src="/assets/icons/active-action-loader.svg" alt="loading" width={80} height={80}
                            style={{
                                transform: `rotate(${rotationDegree}deg)`
                            }}
                        />
                    </div>
                }

                {!loading &&
                    <div className='absolute top-0 w-[100px]'>
                        <Image src="/assets/icons/success-action-loader.svg" alt="loading" width={80} height={80}
                        />
                    </div>
                }

                {loading &&
                    <div className='absolute mt-[10%] ml-2'>
                        <label className='text-white text-[11px] mr-6'>14:31</label>
                    </div>
                }
            </div>
            
            <div className='mt-[30%] w-full px-4 '>
                <div className='flex justify-around'>
                    <label className='text-white text-sm'>Information</label>
                </div>
                <div className='w-full flex items-center justify-between mt-4 '>
                    <label className='text-sm text-white opacity-[30%]'>User</label>
                    <div className='flex gap-2 items-center'>
                        <Image src={nearState.profile?.profileImg!} alt="" width={30} height={30} />
                        <label className='text-sm text-white opacity-[30%]'>{nearState.accountId}</label>
                    </div>
                </div>

                <div className='mt-2'>
                    {selectedNFTs.map((nft: NFT, index: number) => (
                        <div key={index} className='mt-2 flex justify-between  text-sm gap-2 items-center'>
                            <label className='text-white opacity-[30%]'>{index + 1}</label>
                            <label className='text-white'>{nft.name}</label>
                        </div>
                    ))}
                </div>

                <div className='mt-2 flex justify-between  text-sm gap-2 items-center'>
                    <label className='text-white opacity-[30%]'>Time</label>
                    <label className='text-white'>15 min</label>
                </div>

                <div className='mt-2 flex justify-between  text-sm gap-2 items-center'>
                    <label className='text-white opacity-[30%]'>Quantity</label>
                    <label className='text-white'>{nearState.serviceAmount} AEX</label>
                </div>

                <div className='w-full mt-4'>
                    {loading &&
                        <button className='bg-black-light p-2 mt-2 rounded-[10px] w-full justify-around  items-center flex'>
                            <div className='flex gap-2 items-center'>
                                <Image
                                    className='opacity-[30%]'
                                    src="/assets/icons/wait-icons.svg" alt="loading" width={25} height={25} />
                                <label className='text-sm text-white opacity-[30%]' style={{ fontWeight: 'bold' }}>Wait</label>
                            </div>
                        </button>
                    }{
                        !loading &&
                        <Button label='Received' icon='/assets/icons/white-tick-icon.svg' />
                    }
                </div>

                <div className='w-full flex my-6 justify-around'>
                    <div className='flex gap-4'>
                        <StepIndicator />
                        <StepIndicator />
                        <StepIndicator bg="purple" />
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ConfirmSendNFT;