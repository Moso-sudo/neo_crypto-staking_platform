import React from "react";

import ButtonCmp from "./RegularComp/ButtonCmp";

import InputField from "./RegularComp/InputField";

import ClickButton from "./RegularComp/ClickButton";

import Title from "./RegularComp/Title";

const Staking = ({

  poolDetails,
  sweep,
  setLoader
}) => {
  const [token, setToken] = useState({
    token:"",
    amount:"",
  });
  const CALLING_FUNCTION_SWEEP = async (token)=>{
    setLoader(true);
    console.log(pool)
    const receipt = await sweep(token);
    if(receipt){
      console.log(receipt);
      setLoader(false);
      window.location.reload();
    }
    setLoader(false)
  };

  return (
  <div className="tab-pane fade " id="tab-3"
  role="tabpanel">
    <div className="row">
      <div className="col-12">
        <div className="profile">
          <ul className="nav-nav-tabs section__tabs section__tabs--left"
          id="section__profile-tabs2" role="tablist">
            <ButtonCmp name={sweep} tab={"f4"} styleClass={"active"}/>
          </ul>
          <div className="tab-content">
            <div className="tab-pane fade show active" id="tab-f4"
            role="tabpanel"></div>
          </div>
          <div className="row">
            <Title title={"Withdraw staking token crypto currency"}/>
            <InputField
            size={"6"}
            type={"text"}
            title={"Token Address"}
            name={"amount2"}
            placeholder={`address`}
            handleChange={(e)=>
              setToken({...token, token: e.target.value})
            }
            />

            <InputField
            size={"6"}
            type={"text"}
            title={"Enter Amount"}
            name={"amount3"}
            placeholder={`${poolDetails?. contractTokenBalance} ${poolDetails?. deposiToken.symbol}`}
            handleChange={(e)=>
              setToken({...token, amount: e.target.value})
            }
            />
            <ClickButton name={"Withdraw"}
            handleClick={()=>CALLING_FUNCTION_SWEEP ()}/>
          </div>
        </div>
        
      </div>
    </div>
  </div>

  )
};

export default Staking;
