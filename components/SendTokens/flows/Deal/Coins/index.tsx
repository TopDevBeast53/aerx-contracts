import { Fragment, useState } from 'react';
import DealSendCoins from './DealSendCoins';

const InitializeDealCoins = () => {
  const [flow, setFlow] = useState(0);

	return (
		<Fragment>
			{flow === 0 && <DealSendCoins setFlow={setFlow} />}
		</Fragment>
	);
};

export default InitializeDealCoins;
