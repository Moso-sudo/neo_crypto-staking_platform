import React,{useEffect, useState} from "react";
import {useAccount} from "wagmi";
//INTERNAL IMPORT
import {Header, HeroSection, 
  // Footer, 
    WithdrawModal,
      // Withdraw, 
      Partners,
       Statistics, 
       Token, 
       Loader, 
       Notification, 
       ICOSale, 
       Contact, 
       Pools,
       Ask, 
       PoolsModel} from "../Components";
       import {
        CONTRACT_DATA, 
        deposit,
        // withdraw,
        claimReward,
        addTokenToMetamask,
       } from "../Context/index";

const index = () => {
  const {address} =useAccount();
  const [loader, setLoader]=useState(false);
  const [contactUs, setContactUs] =useState(false);
  const [poolID, setPoolID] =useState();
  const [withdrawPoolID, setWithdrawPoolID]= useState();

  const  [poolDetails, setPoolDetails] = useState();
  const  [selectedPool, setSelectedPool]=useState();
  const  [selectedToken, setSelectedToken]=useState();
  const  LOAD_DATA = async ()=>{
    if(address){
      setLoader(true);
      const data = await CONTRACT_DATA(address);
      setPoolDetails(data);
    };
  };
  useEffect(()=>{
    LOAD_DATA();
  }, [address]);


  return (     
  <div className="bg-color">
  <Header/>
  <HeroSection
  poolDetails={poolDetails}
  addTokenToMetamask={addTokenToMetamask}
  />
  <Statistics poolDetails={poolDetails}/>
  <Pools setPoolID={setPoolID}
  poolDetails={poolDetails}
  setSelectedPool={setSelectedPool}
  setSelectedToken={setSelectedToken}
  />
  <Token poolDetails={poolDetails}/>
  {/* <Withdraw
  setWithdrawPoolID={setWithdrawPoolID}
  poolDetails={poolDetails}
  /> */}
  <Notification poolDetails={poolDetails}/>
  <Partners/>
  <Ask setContactUs={setContactUs} />
  {/* <Footer/> */}

  {/*Modal */}

  <PoolsModel
  deposit={deposit}
  poolID={poolID}
  address={address}
  selectedPool={selectedPool}
  selectedToken={selectedToken}
  setLoader={setLoader}
  />
  <WithdrawModal
  // withdraw={withdraw}
  withdrawPoolID={withdrawPoolID}
  address={address}
  setLoader={setLoader}
  claimReward={claimReward}
  />
  <ICOSale setLoader={setLoader}/>

  {
    contactUs && <Contact setContactUs={setContactUs}/>
  }
  {loader &&<Loader/>}
  </div>
  );
};

export default index;
