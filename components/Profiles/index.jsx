import React from "react";
import Profile from "./Profile";
import ImagesCarousel from "./ImagesCarousel";
import Notifications from "./Notification";
import NftValues from "./NftValues";
import Collapsable from "./Collapsable";
import FlowFeeds from "../Flow/index";
import Circle from "./Circle";
import ChatRoom from "../Chat/ChatRoom";
import Space from "../Space/index";
import Wallets from "../BranchWallet/tokenWallet";
import WalletsHead from "./WalletsHead";
import Pools from "../BranchWallet/Pools";
import ExchangeToken from "../BranchWallet/ExchangeToken";
import NewSendToken from "../BranchWallet/NewSendToken";
import AddLiquidity from "../BranchWallet/AddLiquidity";
import RecieveToken from "../BranchWallet/RecieveToken";

import { useState } from "react";
import CircleList from "./CircleList";
import LogOut from "./LogOut";
import { useDispatch } from "../../store/store";
import { triggerSidebar } from "../../store/slices/modulesSlices";

// type Props = {
// }
// const [toggle,setToggle] = React.useState<boolean>(false)

function Index() {
  const dispatch = useDispatch();
  const [isToggle, setToggle] = useState(false);
  const [doubleClicked, setDoubleClicked] = useState(false);
  const [isOpenWallet, setOpenWallet] = useState(false);

  const [isUpload, setUpload] = React.useState(false);

  const [isExchange, setExchange] = React.useState(false);

  const [isPool, setPool] = React.useState(false);

  const [isLiquidity, setLiquidity] = React.useState(false);

  const [isRecieved, setRecieved] = React.useState(false);
  const [isCircle, setCircle] = React.useState(false);

  const [isLogout, setLogout] = React.useState(false);

  const logOutUser = () => {
    setLogout((prevState) => !prevState);
  };

  let zIndex;
  isLogout ? (zIndex = 1) : (zIndex = -8);

  const switchCircle = () => {
    setCircle((prevState) => !prevState);
  };

  const changeUpload = () => {
    setUpload((prevState) => !prevState);
  };
  const changeExchange = () => {
    setExchange((prevState) => !prevState);
  };
  const changePool = () => {
    setPool((prevState) => !prevState);
  };
  const changeLiquidity = () => {
    setLiquidity((prevState) => !prevState);
  };
  const changeRecieve = () => {
    setRecieved((prevState) => !prevState);
  };

  // change toggle state
  const toggleClick = () => {
    // toggle state
    dispatch(triggerSidebar());
    setToggle((prevState) => !prevState);
    // change toggle state
  };
  let index;

  // isToggle  ? index= -1 : index=1
  isCircle ? (index = 1) : (index = -1);

  const HoverClick = () => {
    // if (e.detail == 2) {
    setTimeout(() => {
      setDoubleClicked(true);
    }, 3000);
  };

  let profileCardTimeout;
  // Write a function to show the tooltip
  const ProfileCardEnter = () => {
    profileCardTimeout = setTimeout(() => {
      setDoubleClicked(true);
    }, 4000);
  };

  // Write a function to hide the tooltip
  const ProfileCardLeave = () => {
    clearInterval(profileCardTimeout);
    // setDoubleClicked(false);
  };

  const LeaveClick = () => {
    // if (e.detail == 2) {
    // setTimeout(() => {
    // setDoubleClicked(false);
    clearTimeout;
    // }, 3000);

    // }
  };
  const CircleClick = () => {
    // if (e.detail == 2) {

    setDoubleClicked((prevState) => !prevState);

    // }
  };

  //   const handleMouseLeave = () => {
  //     clearTimeout(delayHandler)
  // }

  const removeCircle = (e) => {
    if (e.detail == 1) {
      setDoubleClicked((prevState) => !prevState);
    }
  };
  const openWallet = () => {
    setOpenWallet((prevState) => !prevState);
  };

  const wallet = (
    <Wallets
      upload={changeUpload}
      exchange={changeExchange}
      pool={changePool}
      liquidity={changeLiquidity}
      changeAction={setToggle}
      toggle={isToggle}
      toggleWallet={openWallet}
      recieved={changeRecieve}
    />
  );
  return (
    <div
      id="profile"
      className=" bg-[#1E202100] flex  h-[100vh] overflow-hidden "
    >
      {isToggle && (
        <div>
          {!isOpenWallet ? (
            <div>
              <Profile
                toggle={toggleClick}
                profileEnter={ProfileCardEnter}
                circleClick={CircleClick}
                profileLeave={ProfileCardLeave}
                wallet={openWallet}
                removeCircle={removeCircle}
                switch={switchCircle}
                logOutUser={logOutUser}
                shadow={doubleClicked}
                recieved={changeRecieve}
                upload={changeUpload}
                exchange={changeExchange}
                pool={changePool}
                m={setDoubleClicked}
              />
              {/* <ProfileSection toggle={toggleClick} doubleClick={doubleClick}
                removeCircle={removeCircle}
              
              />
              <ImagesCarousel
                doubleClick={doubleClick}
                switch={switchCircle}
                removeCircle={removeCircle}
              />
              <WalletsHead wallet={openWallet} />
              <NftValues />
              <Notifications logOutUser={logOutUser} /> */}
              {/* <tokenWallet /> */}
              {isUpload && (
                <NewSendToken upload={changeUpload} toggleWallet={openWallet} />
              )}
              {isPool && <Pools pool={changePool} toggleWallet={openWallet} />}
              {isExchange && (
                <ExchangeToken
                  exchange={changeExchange}
                  toggleWallet={openWallet}
                />
              )}
              {isRecieved && (
                <RecieveToken
                  recieved={changeRecieve}
                  toggleWallet={openWallet}
                />
              )}
            </div>
          ) : (
            <div className=" h-[100vh]">
              {wallet}
              {isExchange && (
                <ExchangeToken
                  exchange={changeExchange}
                  toggleWallet={openWallet}
                />
              )}
              {isUpload && (
                <NewSendToken upload={changeUpload} toggleWallet={openWallet} />
              )}
              {isPool && <Pools pool={changePool} toggleWallet={openWallet} />}
              {isLiquidity && (
                <AddLiquidity
                  liquidity={changeLiquidity}
                  toggleWallet={openWallet}
                />
              )}
              {isRecieved && (
                <RecieveToken
                  recieved={changeRecieve}
                  toggleWallet={openWallet}
                />
              )}
            </div>
          )}
        </div>
      )}
      {/* {!isCircle && <CircleList switched={switchCircle} />} */}

      {!isToggle && (
        <Collapsable
          toggle={toggleClick}
          Toggle={isToggle}
          circle={isCircle}
          index={index}
        />
      )}

      {doubleClicked && <Circle circle={doubleClicked} remove={removeCircle} />}
    </div>
  );
}

export default Index;
