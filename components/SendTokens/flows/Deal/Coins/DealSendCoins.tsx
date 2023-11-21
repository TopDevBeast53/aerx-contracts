import React from 'react'
import StepIndicator from '../../../../StepIndicator'
import Image from 'next/image'
import Button from '../../../../Elements/Button'
import SelectCoin from '../../../../SelectCoin'

interface IProps {
  setFlow: (flow: number) => void
}

const DealSendCoins: React.FC<IProps> = ({ setFlow }) => {
  return (
    <div className='w-[344px] pb-4 px-4'>
      <h1 className='text-white text-center mb-6 font-medium'>Deal</h1>
      <div className='flex flex-col gap-4'>
        <div className='flex w-full mt-2 justify-between bg-[#131313] p-4 rounded-[15px]'>
          <div className='z-10'>
            <SelectCoin />
          </div>
          <div className=''>
            <input
              type='number'
              className='text-sm text-right text-white focus:outline-none bg-transparent w-[max-content]'
              placeholder='0'
            />
          </div>
        </div>
        <label htmlFor="" className='flex justify-between text-sm font-medium'>
          <p className='text-[#5e5e5e]'>Available to send</p>
          <p className='text-[#5e5e5e]'>102.48283 AEX</p>
        </label>
        <div className="flex items-center gap-[7px]">
          <div className='h-[1px] bg-[#303030] w-full' />
          <Image src='/assets/icons/exchange.svg' width='55px' height='55px' alt='exchange-icon' className='text-[#303030] my-[6px]' />
          <div className='h-[1px] bg-[#303030] w-full' />
        </div>
        <div className='flex w-full mt-2 justify-between bg-[#131313] p-4 rounded-[15px]'>
          <div className='z-10'>
            <SelectCoin />
          </div>
          <div className=''>
            <input
              type='number'
              className='text-sm text-right text-white focus:outline-none bg-transparent w-[max-content]'
              placeholder='0'
            />
          </div>
        </div>
        <div className='flex w-full justify-between bg-[#131313] p-4 rounded-[10px]'>
          <Image
            src='/assets/icons/time-icon.svg'
            width={20}
            height={20}
            alt='time'
          />
          <label className='text-sm text-white'>0</label>
          <label className='text-sm text-white opacity-[30%]'>min</label>
        </div>
      </div>
      <div className='my-6'>
        <Button
          icon='/assets/icons/right-arrow-icon.svg'
          label='Send'
        />
      </div>
      <div className="flex justify-center gap-4 mb-4">
        <StepIndicator bg='purple' />
        <StepIndicator />
        <StepIndicator />
      </div>
    </div>
  )
}

export default DealSendCoins