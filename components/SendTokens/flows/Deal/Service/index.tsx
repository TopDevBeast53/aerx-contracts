import React, { useState } from 'react'
import { NFT } from '../../../../../types/NFT';
import SelectNFTs from '../../Common/SelectNFT';
import ConfirmSendNFT from './ConfirmSendNFT';
import DealServiceCoins from './DealServiceCoins';
import DealServiceDetails from './DealServiceDetails';
import SendDealNFT from './SendDealNFT';

const InitializeDealService: React.FC = () => {
    const [flow, setFlow] = useState<number>(0); 
    const [transactionStatus, setTransactionStatus] = useState<'pending' | 'success' | 'failed'>('pending');
    const [selectedNFTs, setSelectedNFTs] = useState<Array<NFT>>([]);

    return (
        <div>
            {flow === 0 && <DealServiceCoins setFlow={setFlow} />}
            {flow === 1 && <DealServiceDetails setFlow={setFlow} />}
            {flow === 2 && <ConfirmSendNFT selectedNFTs={selectedNFTs} />}
        </div>
    )
}
export default InitializeDealService;