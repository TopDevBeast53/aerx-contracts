import React, { useState } from 'react'
import  Modal  from '../Modal';
import DealFlow from './flows/Deal';
import InitializeTransaction from './flows/InitializeTransaction';
import RequestFlow from './flows/Request';
import SendFlow from './flows/Send';

interface IProps{
    onClose: () => void;
}
const SendTokens : React.FC<IProps> = ({onClose}) => {
    const [flow, setFlow] = useState<number>(0);
    return (
        <Modal onClose={onClose}>
            <div>
               {flow === 0 && <InitializeTransaction setFlow={setFlow} />}
               {flow === 1 && <SendFlow  onClose={onClose}/>}
               {flow === 2 && <RequestFlow  onClose={onClose}/>}
               {flow === 3 && <DealFlow onClose={onClose}/>}
            </div>
        </Modal>
    )
}

export default SendTokens;