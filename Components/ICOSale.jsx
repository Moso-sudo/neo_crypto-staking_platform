import React, {useState, useEffect} from "react";
import  {useAccount} from "wagmi";

import  {IoMdClose} from "./ReactICON";
import { LOAD_TOKEN_ICO} from "../Context/constants";
import { BUY_TOKEN } from "../Context/index";

const CURRENCY  = process.env.NEXT_PUBLIC_CURRENCY;

const ICOSale = ({setLoader}) => {
  const {address} = useAccount();
  const [tokenDetails, setTokenDetails] = useState();
  const [quantity, setQuantity] = useState(0);


  useEffect(()=>{
    const loadToken= async ()=>{
      const token = await LOAD_TOKEN_ICO;
      setTokenDetails(token);
      console.log(token);
    };
    loadToken();
  }, [address]);
  const CALLING_FUNCTION_Buy_TOKEN= async (quantity)=>{
    setLoader(true);
    console.log(updatePrice);
    const receipt = await BUY_TOKEN(updatePrice);
    if(receipt){
      console.log(receipt);
      setLoader(false);
      window.location.reload();
    }
    setLoader(false);
  };


  return(
    <div className="modal modal--auto fade"
    id="modal-deposit1"
    tabIndex={-1}
    aria-labelledby="modal-deposit1"
    aria-hidden="true">


       <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal__content">
                  <button className="modal__close" type="button" data-bs-dismiss="modal" arai-label="close">
                    <i className="ti ti-x"><IoMdClose/></i>
                  </button>
                  <h4 className="modal__title"> {tokenDetails?.token.symbol} NEO ICO Token</h4>
                  <p className="modal__text">
                   participate in the <span>ongoing NEO ICO Token</span> sale stake  NEO and accumulate rewards
                  </p> 
                  <div className="modal__form">
                    <div className="form_group">
                      <label htmlFor="form__label">
                        ICO Supply:{""}
                        {`${tokenDetails?.tokenBal} $
                        {tokenDetails?.token.symbol}`}
                      </label>
                      <input type="text"
                      className="form__input" 
                      placeholder={`${tokenDetails?.token.symbol} : ${tokenDetails?.token.balance.toString().slice(0,12)}`}
                      onChange={(e)=>setQuantity(e.target.value)}/>
                    </div>

                    <div className="form_group">
                      <label htmlFor="form__label">
                        pay Amount
                      
                      </label>
                      <input type="text"
                      className="form__input" 
                      placeholder={`${Number(tokenDetails?.tokenPrice)* quantity} ${ CURRENCY }`}
                      disabled
                      />
                    </div>
                    <button className="form__btn"
                    type="button"
                    onClick={()=>
                      CALLING_FUNCTION_Buy_TOKEN(quantity)
                    }>
                      Buy {tokenDetails?.token.symbol}
                    </button>

                  </div>
               </div>
          </div>
          </div>

    </div>


  ) 
};

export default ICOSale;
