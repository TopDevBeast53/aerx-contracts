import React, { useState } from 'react'
import SuccessPayment from '../../../Alerts/SuccessPayment';
import ErrorPayment from '../../../Alerts/ErrorPayment';
import InitializeSend from './InitializeSend';
import SendCoins from './SendCoins';
import SelectNFTs from '../Common/SelectNFT';
import { NFT } from '../../../../types/NFT';
import SendNFT from './SendNFT';

interface IProps {
    onClose: () => void;
}
const SendFlow: React.FC<IProps> = ({onClose}) => {
    const [flow, setFlow] = useState<number>(0);
    const [transactionStatus, setTransactionStatus] = useState<'pending' | 'success' | 'failed'>('pending');
    const [selectedNFTs, setSelectedNFTs] = useState<Array<NFT>>([]);
    return (
        <div>
           {flow === 0 && transactionStatus === 'pending' && <InitializeSend setFlow={setFlow} />}
           {flow === 1 && transactionStatus === 'pending' && <SendCoins  setTransactionStatus={(status) => setTransactionStatus(status)}/>}
           {flow === 2 && transactionStatus === 'pending' && <SelectNFTs  setNFTsSelected={setSelectedNFTs} setFlow={setFlow}  />}
           {flow === 3 && transactionStatus === 'pending' && <SendNFT 
           setTransactionStatus={(status) => setTransactionStatus(status)}
           nfts={selectedNFTs} 
           setSelectedNFTs={setSelectedNFTs}  />}
           {transactionStatus === 'success' && <SuccessPayment onClose={onClose} />}
           {transactionStatus === 'failed' && <ErrorPayment onClose={onClose} />}
        </div>
    )
}
export default SendFlow;