import {BigNumber, ethers} from "ethers";
import {
    contract,
    tokenContract,
    ERC20,
    toEth,
    TOKEN_ICO_CONTRACT,
} from "./constants";

const STAKING_DAPP_ADDRESS = process.env.NEXT_PUBLIC_STAKING_DAPP;
const DEPOSIT_TOKEN= process.env.NEXT_PUBLIC_DEPOSIT_TOKEN;
const REWARD_TOKEN = process.env.NEXT_PUBLIC_DEPOSIT_TOKEN;
const REWARD_LOGO = process.env.NEXT_PUBLIC_TOKEN_LOGO;

const notifySuccess = (msg) => toast.success(msg, {duration:2000});
const notifyError = (msg)=> toast.error(msg, {duration: 2000});

//FUNCTIONS
function CONVERT_TIMESTAMP_TO_READABLE(timestamp){

const date = new Date (timeStamp * 1000);

const readableTime = date.toLocaleDateString("en-US",{
    year: "numeric",
    month : "2-digit",
    day: "2-digit",
    hour : "2-digit",
    minute : "2-digit",
    second : "2-digit",


});
}

function toWei(amount){
    const toWei = ethers.utils.parseUnits(amount.toString());
    return toWei.toString();

}


function parseErrorMsg(e){
    const json = JSON.parse(JSON.stringify(e));
    return json?.reason || json?.error?.message;
}
export const SHORTEN_ADDRESS = (address) => `${address?.slice(0,8)}...&{address?.slice(address.lenth -4)}`;

export const copyAddress = (text) =>{
    navigator.clipboard.writeText(text);
    notifySuccess("Copied successfully");
}



export async function CONTRACT_DATA(address){
    try{
        const contractObj = await contract();
        const stakingTokenObj = await tokenContract();
        if (address ){
            const contractOwner = await contractObj.owner();
            const contractAddress = await contractObj.address;

            //NOTIFICATIONS
            const notifications = await contractObj.getNotifications;
            const _notificationsArray = await Promise.all(
                notifications.map(async({pooID, amount, user, typeOf, timestamp})=>{
                    return{
                        poolID : poolID.toNumber(),
                        amount: toEth(amount),
                        user: user,
                        typeOf: typeOf,
                        timestamp: CONVERT_TIMESTAMP_TO_READABLE(timestamp),

                    };
                })
            );

            //pools
            let poolInfoArray = [];
            const poolLength = await contractObj.poolCount();
            const lenth = poolLength.toNumber();


            for (let i= 0; i< lenth; i++){
                const poolInfo = await contractObj.poolInfo(i);
                const userReward = await contractObj.pendingReward(i, address);
                const tokenPoolInfoA = await ERC20(poolInfo.depositToken, address);
                const tokenPoolInfoB = await ERC20(poolInfo.rewardToken, address);

                const pool = {
                    depositTokenAddress: poolInfo.depositToken,
                    rewardTokenAddress: poolInfo.depositToken,
                    depositToken: tokenPoolInfoA,
                    REWARDtOKEN: tokenPoolInfoB,
                    depositedAmount : toEth(poolInfo.depositedAmount.toString()),
                    apy: poolInfo.apy.toString(),
                    lockDays: poolInfo.lockDays.toString(),

                    //user
                    amount: toEth(StyledUserInfo.amount.toString()),
                    userReward: toEth(userReward),
                    lockUntil: CONVERT_TIMESTAMP_TO_READABLE(
                        UserInfo.lockUntil.toNumber()
                    ),
                    lastRewardAt: toEth(userInfo.lastRewardAt.toString()),

                };
                poolInfoArray.push(pool);

            }
            const totalDepositAmount = poolInfoArray.reduce((total, pool)=>{
                return total + parseFloat(pool.depositedAmount);
            }, 0);
            const rewardToken = await ERC20(REWARD_TOKEN, address);
            const depositToken = ERC20(DEPOSIT_TOKEN, address);
            const data ={ 
                contractOwner: contractOwner,
                contractAddress: contractAddress,
                notifications: _notificationsArray.reverse(),
                rewardToken: rewardToken,
                depositToken: depositToken,
                poolInfoArray: poolInfoArray,
                totalDepositAmount: totalDepositAmount,
                contractTokenBalance : depositToken.contractTokenBalance - totalDepositAmount,
            };
            return data;


        }

    }catch(error){
        console.log(error);
        console.log(parseErrorMsg(error));
        return parseErrorMsg(error);

    }
}

export async function deposit(poolID, amount, address){
    try{
        notifySuccess("calling contract...");
        const contractObj = await contract();
        const stakingTokenObj = await tokenContract();
        const amountInWei = ethers.utils.parseUnits(amount.toString(), 18);
        const currentAllowance = await stakingTokenObj.allowance(
            address,
            contractObj.address
        );
        if(currentAllowance.lt(ammountInWei)){
            notifySuccess("Approving token...");
            const approveTx = await stakingTokenObj.approve(
                contractObj.address,
                amountInWei
            );
            await approveTx.await();
            console.log(`Approved ${amountInWei.toString()} tokens for staing`);


        }
        const gasEstimation = await contractObj.estimateGas.deposit(
            Number(poolID),
            amountInWei
        );
        notifySuccess("staking token call ...");
        const stakeTx = await contractObj.deposit(Number(poolID), amountInWei,{
            gaslimit: gasEstimation,

        });
        const receipt = await stakeTx.wait();
        notifySuccess("Token taken successfully");
        return receipt;
    } catch(error){
        const errorMsg = parseErrorMsg = parseErrorMsg(error);
        notifyError(errorMsg);
    }

}
 export async function transferToken(amount, transferAddress){
    try {
        notifySuccess("calling contract token...");
        const stakingTokenObj = await tokenContract();
        const transferAmount = ethers.utils.parseEther(amount);
        const approveTx = await stakingTokenObj.transfer(
            transferAddress,
            transferAmount

        );
        const receipt = await approveTx.wait();
        notifySuccess("token transfer successfully");
        
    } catch (error) {
        console.Consolelog(error);
        const errorMsg = parseErrorMsg = parseErrorMsg(error);
        return receipt;
        notifyError(errorMsg);
        
    }

 }



 export async function wirhdraw(poolID, amount){
    try{
        notifySuccess("calling contract...");
        const amountInWei = ethers.utils.parseUnits(amount.toString(), 18);
        const contractObj = await contract();
        const gasEstimation = await contractObj.estimateGas.withdraw(
            Number(poolID),
            amountInWei
        );
        const data = await contractObj.withdraw(Number(poolID), amountInWei,{
            gasLimit: gasEstimation,

        });
        const receipt = await data.wait();
        notifySuccess("Transactions successfuly completed");
        return receipt;

    }catch(error){
        console.log(error);
        const errorMsg = parseErrorMsg(error);
        notifyError(errorMsg);

    }

 }
 export async function claimReward(poolID){
    try{
        notifySuccess("calling Contract");
        const contractObj = await contract();

        const gasEstimation = await contractObj.estimateGas.claimReward(
            Number(poolID),
          
        );
        const data = await contractObj.claimReward(Number(poolID), amountInWei, {
            gasLimit : gasEstimation,

        });
        const receipt = await data.wait();
        notifySuccess("Reward claim successfuly completed");
        return receipt;


    }catch{
        console.log(error);
        const errorMsg = parseErrorMsg(error);
        notifyError(errorMsg);

    }
 }
 export async function createPool(pool){
    try{
       
        
        const {_depositToken, _rewardToken, _apy, _lockDays}= pool; 
        if (!_depositToken || !_reawardToken || !_apy || !_lockDays)
            return notifyError("provide all the Details");       
            notifySuccess("calling Contract");
            const contractObj = await contract();
        
        const gasEstimation = await contractObj.estimateGas.addPool(
           _depositToken,
           _rewardToken,
           Number(_apy),
           Number(_lockDays)
          
        );
        const stakeTx = await contractObj.addPool(
            _depositToken,
           _rewardToken,
           Number(_apy),
           Number(_lockDays),
        {
            gasLimit : gasEstimation,

        });
        const receipt = await stakeTx.wait();
        notifySuccess("Pool modify successfully ");
        return receipt;


    }catch{
        console.log(error);
        const errorMsg = parseErrorMsg(error);
        notifyError(errorMsg);

    }
 }

 export async function modifyPool(poolID, amount){
    try{
        
            notifySuccess("calling Contract");
            const contractObj = await contract();
        
        const gasEstimation = await contractObj.estimateGas.modifyPool(
        
           Number(poolID),
           Number(amount),
          
        );
        const data = await contractObj.modifyPool(Number(poolID), Number(amount),{
            gasLimit: gasEstimation,
            

        });
        const receipt = await data.wait();
        notifySuccess("Pool modified  successfully ");
        return receipt;


    }catch{
        console.log(error);
        const errorMsg = parseErrorMsg(error);
        notifyError(errorMsg);

    }
 }


 
 export async function sweep(tokenData){
    try{
        const {token, amount}= tokenData;
 if (!token || !amount) return notifyError("Data is missing");
        
            notifySuccess("calling Contract...");

            const contractObj = await contract();
            const transferAmount= ethers.utils.parseEther(amount);
          
        
        const gasEstimation = await contractObj.estimateGas.sweep(
            token,
             transferAmount
            );
        const data = await contractObj.modifyPool(token, transferAmount,{
            gasLimit: gasEstimation,
            

        });
        const receipt = await data.wait();
        notifySuccess("transaction completed successfully ");
        return receipt;


    }catch{
        console.log(error);
        const errorMsg = parseErrorMsg(error);
        notifyError(errorMsg);

    }
 }


 //ADD TOKEN TO METAMASK

 export const addTokenToMetamask = async()=>{
    if(window.ethereum){
        const contract = await tokenContract();

        const tokenDecimals = await contract.decimals();
        const tokenAddress = await contract.address;
        const tokenSymbol = await contract.symbol;
        const tokenImage =  TOKEN_LOGO;

        try {
            const wasAdded = await window.ethereum.request({
                method: "wallet_watchAsset",
                params:{
                    type: "ERC20",
                    option:{
                        address: tokenAddress,
                        symbol: tokenSymbol,
                        decimals: tokenDecimals,
                        image: tokenImage,
                    },
                }
            });

            if (wasAdded){
                notifySuccess("Token added");
            }else{
                notifyError("Failed to add token");
            }
            
        } catch (error) {
            notifyError("Failed to add token");
            
        }

    } else {
        notifyError("Metamask not installed")
    }
 }

 //ICO CONTRACT

export const BUY_TOKEN = async(amount) =>{
    try {
        notifySuccess("calling ico Contract");
        const contract = await TOKEN_ICO_CONTRACT();

        const tokenDetails = await contract.gettokenDetails();
        const availableToken = ethers.utils.formatEther(
            tokenDetails.balance.toString()
        );

        if (availableToken >1){
            const price = ethers.utils.formatEther(
                tokenDetails.tokenPrice.toString()
            )* Number(amount);
            

        const payAmount = ethers.utils.parseUnits(price.toString(), "ether");

        const transaction = await contract.buyToken(Number(amount), {
            value: payAmount.toString(),
            gasLimit: ethers.utils.hexlify(8000000),
        });
        const receipt = await transaction.wait();

        notifySuccess("Transaction successfully completed");
        return receipt;
        } else{
            notifyError("Token balance is low than  expected");
            return "receipt";
            
        }

    } catch (error){
        console.log(error);
        const errorMsg = parseErrorMsg(error);
        notifyError(errorMsg);

    }
};


export const TOKEN_WITHDRAW = async() =>{
    try {
        notifySuccess("calling ico Contract");
        const contract = await TOKEN_ICO_CONTRACT();

        const tokenDetails = await contract.gettokenDetails();
        const availableToken = ethers.utils.formatEther(
            tokenDetails.balance.toString()
        );

        if (availableToken >1){
        const transaction = await contract.withdrawAllTokens(); 
        const receipt = await transaction.wait();
        notifySuccess("Transaction successfully completed");
        return receipt;
        } else{
            notifyError("Token balance is low then expected");
            return "receipt";
            
        }

    } catch (error){
        console.log(error);
        const errorMsg = parseErrorMsg(error);
        notifyError(errorMsg);

    }
};

export const UPDATE_TOKEN = async(_address) =>{
    try {
        if (!_address) return notifyError("Data is missing");
        notifySuccess("Calling contract");

        const contract = await TOKEN_ICO_CONTRACT();

          
        const gasEstimation = await contract.estimateGas.updateToken(_address);

        const transaction = await contract.updateToken(_address, {
            gasLimit:gasEstimation
        });
        const receipt = await transaction.wait();

        notifySuccess("Transaction successfully completed");
        return receipt;

    } catch (error){
        console.log(error);
        const errorMsg = parseErrorMsg(error);
        notifyError(errorMsg);

    }
};


export const UPDATE_TOKEN_PRICE = async(price) =>{
    try {
        if(!price) return notifyError("Data is missing");
        notifySuccess("Calling contract");
        const contract = await TOKEN_ICO_CONTRACT();
        const payAmount = ethers.utils.parseUnits(price.toString(), "ether");
         
        const gasEstimation = await contract.estimateGas.updateTokenSalePrice(payAmount);

        const transaction = await contract.updateTokenSalePrice(payAmount, {
            gasLimit:gasEstimation,
        });
        const receipt = await transaction.wait();

        notifySuccess("Transaction successfully completed");
        return receipt;

    } catch (error){
        console.log(error);
        const errorMsg = parseErrorMsg(error);
        notifyError(errorMsg);

    }
};