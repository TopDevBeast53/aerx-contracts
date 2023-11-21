import Image from 'next/image';
import React from 'react'
import { NFT } from '../../../../../types/NFT';
import Button from '../../../../Elements/Button';
import SelectCoin from '../../../../SelectCoin';
import StepIndicator from '../../../../StepIndicator';

interface IProps {
    selectedNFTs: Array<NFT>,
    setFlow: (flow:number) => void
}
const SendDealNFT: React.FC<IProps> = ({selectedNFTs, setFlow}) => {
    return (
        <div className='w-[300px]'>
        <div className='w-full flex justify-around'>
            <label className='text-white'>Deal:NFT's</label>
        </div>

        <div className='w-full mt-6'>
        <div className='px-2 w-full'>
                <div className='flex w-full justify-between bg-[#131313] px-4 py-3 rounded-[10px]'>
                    <label className='text-sm text-white opacity-[30%]'>Selected: {selectedNFTs.length}</label>
                    <Image src="/assets/icons/remove-icon.svg" width={15} height={15} 
                    className="opacity-[20%] cursor-pointer" alt="remove" />
                </div>

                <div className='mt-4 flex w-full justify-between bg-[#131313] px-3 py-[10px] rounded-[10px]'>
                    <div className='z-10'>
                    <SelectCoin />
                    </div>
                    <div className=''>
                        <input type='number' className='text-sm text-right text-white focus:outline-none bg-transparent w-[max-content]' placeholder='0' />
                    </div>
                </div>

                <div className='mt-4 flex w-full justify-between bg-[#131313] px-4 py-3 rounded-[10px]'>
                   <Image src="/assets/icons/time-icon.svg" width={20} height={20} alt="time" />
                   <label className='text-sm text-white '>15</label>
                   <label className='text-sm text-white opacity-[30%]'>min</label>
                </div>

               
                <div className='mt-4'>
                    <Button 
                     icon='/assets/icons/right-arrow-icon.svg'
                     label='Send'
                     onClick={() => setFlow(2)}
                    />
                </div>

                <div className='w-full flex my-6 justify-around'>
                <div className='flex gap-4'>
                    <StepIndicator />
                    <StepIndicator  bg="purple" />
                    <StepIndicator />
                </div>
                </div>
            </div>
        </div>
    </div>
    )
}
export default SendDealNFT;