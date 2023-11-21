import React, { useState } from 'react'
import { NFT } from '../../../../../types/NFT';
import SelectNFTs from '../../Common/SelectNFT';
import ConfirmSendNFT from './ConfirmSendNFT';
import SendDealNFT from './SendDealNFT';

const InitializeDealNFT: React.FC = () => {
    const [flow, setFlow] = useState<number>(0); 
    const [transactionStatus, setTransactionStatus] = useState<'pending' | 'success' | 'failed'>('pending');
    const [selectedNFTs, setSelectedNFTs] = useState<Array<NFT>>([]);

    return (
        <div>
            {flow === 0 && <SelectNFTs setNFTsSelected={setSelectedNFTs} setFlow={() => setFlow(1)}  />}
            {flow === 1 && <SendDealNFT selectedNFTs={selectedNFTs} setFlow={setFlow} />}
            {flow === 2 && <ConfirmSendNFT selectedNFTs={selectedNFTs} />}
        </div>
    )
}
export default InitializeDealNFT;