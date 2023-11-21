import React from "react";

import Wallets from "./tokenWallet";
import Pools from "./Pools"
import Collapse from "../Profiles/Collapse"
import Exchange from "./Exchange";
import Error from "./Error"
import Successful from "./Successful";
import SendTokens from "./SendTokens";
import SendingTokens from "./SendingTokens";
import NewPool from "./NewPool";
import CreateNewPool from "./CreateNewPool";
import Liquidity from "./Liquidity";
import AddLiquidity from "./AddLiquidity";
import SharePage from "./SharePage";
import ConfirmationPage from "./ConfirmationPage";

import tokenWallet from "./tokenWallet";
import NewProfile from "./NewProfile";




function index() {
  const [isToggle, setToggle] = React.useState(false);

  const [isUpload, setUpload] = React.useState(false)

  const [isExchange, setExchange] = React.useState(false)

  const [isPool, setPool] = React.useState(false)

  const [isLiquidity, setLiquidity] = React.useState(false)


  const toggleClick = () => {
    setToggle((prevState) => !prevState);
    // change toggle state
  }

  const changeUpload = () => {
    setUpload((prevState) => !prevState);
  }
  const changeExchange = () => {
    setExchange((prevState) => !prevState);
  }
  const changePool = () => {
    setPool((prevState) => !prevState);
  }
  const changeLiquidity = () => {
    setLiquidity((prevState) => !prevState);
  }

  const wallet = <Wallets
    upload={changeUpload}
    exchange={changeExchange}
    pool={changePool}
    liquidity={changeLiquidity}
    changeAction={setToggle}
    toggle={isToggle}
  />
  return (

    <div className=" bg-[#242424] flex  h-[100vh] overflow-hidden ">
      <Collapse toggle={toggleClick} Toggle={isToggle} />
      {isToggle && (
        <div>
          {wallet}
          {isExchange && <Exchange exchange={changeExchange} />}
          {isUpload && <SendingTokens upload={changeUpload} />}
          {isPool && <Pools pool={changePool} />}
          {/* {isLiquidity && <AddLiquidity liquidity={changeLiquidity}  />  } */}



          {/* <Error /> */}
          {/* <Successful /> */}
          {/* <AddLiquidity /> */}
          {/* <SharePage /> */}
          {/* <ConfirmationPage /> */}
        </div>
      )}
    </div>
  );
}

export default index;
