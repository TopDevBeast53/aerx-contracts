import React, { useState } from 'react'
import SuccessPayment from '../../../Alerts/SuccessPayment';
import ErrorPayment from '../../../Alerts/ErrorPayment';
import InitializeSend from './InitializeSend';
import RequestCoins from './RequestCoins';
import SelectNFTs from '../Common/SelectNFT';
import { NFT } from '../../../../types/NFT';
import RequestNFT from './RequestNFT';

interface IProps {
    onClose: () => void;
}
const RequestFlow: React.FC<IProps> = ({onClose}) => {
    const [flow, setFlow] = useState<number>(0);
    const [transactionStatus, setTransactionStatus] = useState<'pending' | 'success' | 'failed'>('pending');
    const [selectedNFTs, setSelectedNFTs] = useState<Array<NFT>>([]);
    return (
        <div>
           {flow === 0 && transactionStatus === 'pending' && <InitializeSend setFlow={setFlow} />}
           {flow === 1 && transactionStatus === 'pending' && <RequestCoins  setTransactionStatus={(status) => setTransactionStatus(status)}/>}
           {flow === 2 && transactionStatus === 'pending' && <SelectNFTs  setNFTsSelected={setSelectedNFTs} setFlow={setFlow}  />}
           {flow === 3 && transactionStatus === 'pending' && <RequestNFT 
           setTransactionStatus={(status) => setTransactionStatus(status)}
           nfts={selectedNFTs} 
           allNfts={selectedNFTs}
           setSelectedNFTs={setSelectedNFTs}  />}
           {transactionStatus === 'success' && <SuccessPayment message='Invoice successful!'  onClose={onClose} />}
           {transactionStatus === 'failed' && <ErrorPayment message='The user denied the invoice' onClose={onClose} />}
        </div>
    )
}
export default RequestFlow;