const { ethers } = require("ethers");
// Arbitrum ()

// FILL IN THESE 3 YOURSELF
const provider = new ethers.providers.JsonRpcProvider('',42161);
const signer = new ethers.Wallet("", provider);
account = ""

// 0 wrapped Ether = 0x82aF49447D8a07e3bd95BD0d56f35241523fBab1
// 1 USD Coin (Arb1) (USDC) = 0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8
// 2 wrapped BTC = 0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f

indexToken = '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1'
indexTokens = ['0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
				'0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
				'0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
				'0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f'
				]

account = "0x7Ff2A8fe4cE4d321EB315E1CD8B929F5a93C4396"
isLong = [true,true,false,false]
// 0 wrapped Ether = 0x82aF49447D8a07e3bd95BD0d56f35241523fBab1
// 1 USD Coin (Arb1) (USDC) = 0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8
// 2 wrapped BTC = 0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f

collateralToken = '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8'
collateralTokens = ['0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
				'0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
				'0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
				'0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8'
				]
				
const PositionRouterContractAddress = "0xb87a436B93fFE9D75c5cFA7bAcFff96430b09868"
const prABI = require('./gmx-interface-master/src/abis/PositionRouter.json');
const PositionRouter = new ethers.Contract(PositionRouterContractAddress, prABI[0].abi, signer)

const ReaderRouterContractAddress = "0x22199a49A999c351eF7927602CFB187ec3cae489"
const rABI = require('./gmx-interface-master/src/abis/Reader.json');
const Reader = new ethers.Contract(ReaderRouterContractAddress, rABI[0].abi, signer)

const VaultContractAddress = "0x489ee077994B6658eAfA855C308275EAd8097C4A"
const vABI = require('./gmx-interface-master/src/abis/Vault.json');
const Vault = new ethers.Contract(VaultContractAddress, vABI[0].abi, signer)

const RouterContractAddress = "0xaBBc5F99639c9B6bCb58544ddf04EFA6802F4064"
const rtABI = require('./gmx-interface-master/src/abis/Router.json');
const Router = new ethers.Contract(RouterContractAddress, rtABI, signer)

var Client = require('node-rest-client').Client;
var client = new Client();

client.get("https://api.gmx.io/tokens", function (data, response) {
	// parsed response body as js object
	//console.log(data);
	tokens = data;
	//console.log(tokens)
	
	// raw response
	//console.log(response);
});

//availLiqLong()
//availLiqShort()
//getPositions()
//getBalance(indexToken)

// openPosition() calls isSwapNeeded and that calls getBalance
//openPosition(0)  // enter ETH long
//openPosition(2)  // enter ETH short

account = "0x7Ff2A8fe4cE4d321EB315E1CD8B929F5a93C4396"
//const account =  signer

openPosition(0)

async function getBalance(acct){
	outputbalance = await provider.getBalance(acct)
	return outputbalance;
}

async function openPosition(id){
	// MAYBE WE HAVE TO APPROVE EACH TIME.. MAYBE NOT
	/*approvePRCA = await Router.approvePlugin(PositionRouterContractAddress)
	console.log(approvePRCA)
	approveCollTokenRouter = await Router.approvePlugin(collateralTokens[id])
	console.log(approveCollTokenRouter) */
	
	// WE NOW HAVE TO "Approve the Router contract for the token and amount you would deposit as collateral for the position"
	// approveRouter = await Router.approve(indexToken,)
	
    // When trying to enter a long.. IF there is no ETH in the account AND no current positions... 
	// check for USD and IF there is USD then do a swap for ETH
	
	// When trying to enter a short.. If there is no USD balance AND no current positions...
	// check for any ETH above 0.003 ETH and SWAP for USD.. then enter Short
	
	leverage = 8.8
	
	positions = await Reader.getPositions(VaultContractAddress,account,collateralTokens,indexTokens,isLong)
	
	/*The returned array would be a list of values ordered by the positions (9 values):
			size 
				position size in USD
				value at: positionIndex * 9
			collateral
				position collateral in USD
				value at: positionIndex * 9 + 1
			averagePrice
				average entry price of the position in USD
				value at: positionIndex * 9 + 2
			entryFundingRate
				a snapshot of the cumulative funding rate at the time the position was entered
				value at: positionIndex * 9 + 3
			hasRealisedProfit
				1 if the position has a positive realised profit, 0 otherwise
				value at: positionIndex * 9 + 4
			realisedPnl 
				the realised PnL for the position in USD
				value at: positionIndex * 9 + 5
			lastIncreasedTime
				timestamp of the last time the position was increased
				value at: positionIndex * 9 + 6
			hasProfit
				1 if the position is currently in profit, 0 otherwise
				value at: positionIndex * 9 + 7
			delta
				amount of current profit or loss of the position in USD
				value at: positionIndex * 9 + 8

*/
	
	sizeETHLong = (positions[0].toString())/(Math.pow(10,30))
	sizeBTCLong = positions[9]
	sizeETHShort = (positions[18].toString())/(Math.pow(10,30))
	collateralETHShort = (positions[19].toString())/(Math.pow(10,30))
	entryPriceETHShort = (positions[20].toString())/(Math.pow(10,30))
	realisedPnlETHShort = (positions[26].toString())/(Math.pow(10,30))
	sizeBTCShort = positions[27]
	
	console.log(sizeETHShort + ' size of ETHShort in USD')
	console.log(collateralETHShort + ' collateralETHShort in USD')
	console.log(entryPriceETHShort + ' entryPriceETHShort')
	console.log(realisedPnlETHShort + ' realisedPnlETHShort')
	
	const genericERC20ABI = require('./gmx-interface-master/src/abis/ERC20.json');
	
	ethbalance = await getBalance(account)
	console.log(ethbalance + ' ETH')
	ethbalanceHR = ethers.utils.formatUnits(ethbalance, 18)
	console.log(ethbalanceHR)
	const usdcContractAdd = collateralTokens[2]
	const usdcContract = new ethers.Contract(usdcContractAdd, genericERC20ABI, provider);
	usdcBalance = await usdcContract.balanceOf(account)
	usdcDecimals = await usdcContract.decimals()
	console.log(usdcDecimals  + ' USDC Decimals')
	usdcBalance= ethers.utils.formatUnits(usdcBalance, usdcDecimals)
	console.log(usdcBalance + ' USDC')
	
	if (sizeETHShort==0&&sizeETHLong==0) {
		if (isLong[id]==true){
			console.log('Trying to enter long... ')
			console.log(ethbalanceHR + '  ethbalanceHR')
			if (ethbalanceHR<=0.015&&usdcBalance>0){
				console.log('ethbalanceHR==0&&usdcbalance>0... ')
				path = [indexTokens[id],collateralTokens[id]]
				//amountIn = (usdcBalance)*(Math.pow(10,30))
				amountIn = (usdcBalance)*(Math.pow(10,6))
				//amountIn = ethers.utils.hexlify(amountIn)
				console.log(amountIn + ' amountIn post hex')
				neededzeroesamountIn = 66 - amountIn.length
				for (c=0;c<neededzeroesamountIn;c++){
				amountIn += "0"
				}
				console.log(amountIn + ' amountIn after')
				console.log(amountIn + ' amountIn')
				minOut = amountIn.toString() // minimum amount to swap for.. can be 0 if no swap is required
				
			}
			//if (ethbalanceHR>0.015){
			if (ethbalanceHR>0.015&&usdcBalance==0){
				console.log('ethbalanceHR>0.015')
				path = [indexTokens[id]]
				//need same token that we're longing
				amountIn = (ethbalanceHR)*(Math.pow(10,18))
				//amountIn = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(amountIn))
				console.log(amountIn + ' amountIn post hex')
				neededzeroesamountIn = 66 - amountIn.length
				for (c=0;c<neededzeroesamountIn;c++){
				amountIn += "0"
				}
				console.log(amountIn + ' amountIn after')
				console.log(amountIn + ' amountIn')
				minOut = amountIn.toString() // minimum amount to swap for.. can be 0 if no swap is required
				
			}
			// FOR LOOP WHERE THE PRICE IS PULLED FROM API 
			// https://api.gmx.io/prices
			acceptablePrice = 1300//USD value of the max (for longs) or min (for shorts) index price acceptable when executing the request
		}
		if (isLong[id]==false){ 
			console.log('Trying to enter short... ')
			if (usdcbalance==0&&ethbalanceHR>=0.015){
				console.log('usdcbalance==0&&ethbalanceHR>0.003 ')
				path = [indexTokens[id],collateralTokens[id]]
			}
			if (usdcbalance>0){
				console.log('usdcbalance>5')
				//need a stable to short some other token 
				path = [collateralTokens[id]]
			}
			acceptablePrice =  0 //USD value of the max (for longs) or min (for shorts) index price acceptable when executing the request
		}
		sizeDelta = leverage*amountIn
		sizeDelta = sizeDelta.toString()
		console.log(sizeDelta + ' sizeDelta')
		amountIn = amountIn.toString()
		executionFee = await PositionRouter.minExecutionFee()
		console.log(executionFee + ' minExecutionFee')
		referralCode = 'winwinwin'
		referralCode = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(referralCode))
		console.log(referralCode + ' referralCode post hex')
		neededzeroes = 66 - referralCode.length
		for (c=0;c<neededzeroes;c++){
		referralCode += "0"
		}
		console.log(referralCode + ' referralCode after')
		// NOTE: There is an optional callback parameter at the end of createIncreasePosition to run a contract after execution or cancelling
		console.log(path)
		console.log(indexTokens[id])
		console.log(amountIn + ' amountIn')
		console.log(minOut + ' minOut')
		console.log(sizeDelta + ' sizeDelta')
		console.log(isLong[id] + ' isLong[id]')
		console.log(acceptablePrice + ' acceptablePrice')
		console.log(executionFee + ' executionFee')
		console.log(referralCode + ' referralCode')
		gasPrice = await provider.getGasPrice();
		gasPrice = gasPrice.toString()
		console.log(gasPrice + ' gasPrice')
		console.log(gasPrice + ' gasPrice')
		createIncreasePosition = await PositionRouter.createIncreasePosition(path,indexTokens[id],amountIn,minOut,sizeDelta,isLong[id],acceptablePrice,executionFee,referralCode,'0x7Ff2A8fe4cE4d321EB315E1CD8B929F5a93C4396',
		{gasLimit: gasPrice})
	}
	if (sizeETHShort>0){ // if size of ETH Short position currently is above 0
		console.log('We are already in an ETH Short: ' + sizeETHShort)
	}
	if (sizeETHLong>0){ // if size of ETH Long position currently is above 0
		console.log('We are already in an ETH Long: ' + sizeETHLong)
	}
}

async function getPositions(){
	account = await signer.getAddress()
	console.log(account)
}