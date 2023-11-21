import Image from 'next/image';
import React, { useState } from 'react'
import { nearStore } from '../../../../../store/near';
import { selectActiveReceiver } from '../../../../../store/slices/receiverSlice';
import { useSelector } from '../../../../../store/store';
import Button from '../../../../Elements/Button';
import SelectCoin from '../../../../SelectCoin';
import SelectDealType from '../../../../SelectDealType';
import StepIndicator from '../../../../StepIndicator';

interface IProps {
   setFlow: (flow: number) => void;
}
const DealServiceDetails: React.FC<IProps> = ({ setFlow }) => {
   

    const handleSend = async () => {
        setFlow(2)
    }
    return (
        <div className='w-[300px]'>
           <div>
            <label>Selected type</label>
           </div>
        </div>
    )
}

export default DealServiceDetails;