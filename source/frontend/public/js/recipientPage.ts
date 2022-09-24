

import { MostPages } from './mostPages.js';
import MetaMaskOnboarding from '@metamask/onboarding';
import { ethers } from 'ethers';

interface MasterParams {
	recipient ?: string,
	amount ?: number,
	sendCurrency ?: string,
	viewCurrency ?: SupportedViewCurrency,
	network ?: string,
}
interface MasterParamsWithRecipient extends MasterParams {
	recipient : string, //not optional here
}

const supportedSendCurrencies = ['ETH'];
const supportedViewCurrencies = ['USD'];
type SupportedSendCurrency = typeof supportedSendCurrencies[number];
type SupportedViewCurrency = SupportedSendCurrency | typeof supportedViewCurrencies[number];

//From https://docs.metamask.io/guide/rpc-api.html#wallet-addethereumchain
interface AddEthereumChainParameter {
	chainId: string; // A 0x-prefixed hexadecimal string
	chainName: string;
	nativeCurrency: {
		name: string;
		symbol: string; // 2-6 characters long
		decimals: 18;
	};
	rpcUrls: string[];
	blockExplorerUrls?: string[];
	iconUrls?: string[]; // Currently ignored.
}

//TODO: Load directly from https://github.com/ethereum-lists/chains
//adding 'as const' after decimals: 18 or otherwise handling that
const CHAINS_DATA = {
	'ETH': {
		"name": "Ethereum Mainnet",
		"chain": "ETH",
		"icon": "ethereum",
		"rpc": [
			"https://api.mycryptoapi.com/eth",
			"https://cloudflare-eth.com"
		],
		"faucets": [],
		"nativeCurrency": {
			"name": "Ether",
			"symbol": "ETH",
			"decimals": 18 as const
		},
		"infoURL": "https://ethereum.org",
		"shortName": "eth",
		"chainId": 1,
		"networkId": 1,
		"slip44": 60,
		"ens": {
			"registry": "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"
		},
		"explorers": [
			{
			"name": "etherscan",
			"url": "https://etherscan.io",
			"standard": "EIP3091"
			}
		]
	},
	'Goerli': {
		"name": "Görli",
		"title": "Ethereum Testnet Görli",
		"chain": "ETH",
		"rpc": [
			"https://goerli.infura.io/v3/${INFURA_API_KEY}",
			"wss://goerli.infura.io/v3/${INFURA_API_KEY}",
			"https://rpc.goerli.mudit.blog/"
		],
		"faucets": [
			"http://fauceth.komputing.org?chain=5&address=${ADDRESS}",
			"https://goerli-faucet.slock.it?address=${ADDRESS}",
			"https://faucet.goerli.mudit.blog"
		],
		"nativeCurrency": {
			"name": "Görli Ether",
			"symbol": "ETH",
			"decimals": 18 as const
		},
		"infoURL": "https://goerli.net/#about",
		"shortName": "gor",
		"chainId": 5,
		"networkId": 5,
		"ens": {
			"registry": "0x112234455c3a32fd11230c42e7bccd4a84e02010"
		},
		"explorers": [
			{
				"name": "etherscan-goerli",
				"url": "https://goerli.etherscan.io",
				"standard": "EIP3091"
			}
		]
	},
	//case 'Goerli-alt':
	//	break;
	'Polygon': {
		"name": "Polygon Mainnet",
		"chain": "Polygon",
		"rpc": [
			"https://polygon-rpc.com/",
			"https://rpc-mainnet.matic.network",
			"https://matic-mainnet.chainstacklabs.com",
			"https://rpc-mainnet.maticvigil.com",
			"https://rpc-mainnet.matic.quiknode.pro",
			"https://matic-mainnet-full-rpc.bwarelabs.com"
		],
		"faucets": [],
		"nativeCurrency": {
			"name": "MATIC",
			"symbol": "MATIC",
			"decimals": 18 as const
		},
		"infoURL": "https://polygon.technology/",
		"shortName": "matic",
		"chainId": 137,
		"networkId": 137,
		"slip44": 966,
		"explorers": [
			{
			"name": "polygonscan",
			"url": "https://polygonscan.com",
			"standard": "EIP3091"
			}
		]
	},
	'Mumbai': {
		"name": "Mumbai",
		"title": "Polygon Testnet Mumbai",
		"chain": "Polygon",
		"rpc": [
			"https://matic-mumbai.chainstacklabs.com",
			"https://rpc-mumbai.maticvigil.com",
			"https://matic-testnet-archive-rpc.bwarelabs.com"
		],
		"faucets": ["https://faucet.polygon.technology/"],
		"nativeCurrency": {
			"name": "MATIC",
			"symbol": "MATIC",
			"decimals": 18 as const
		},
		"infoURL": "https://polygon.technology/",
		"shortName": "maticmum",
		"chainId": 80001,
		"networkId": 80001,
		"explorers": [{
			"name": "polygonscan",
			"url": "https://mumbai.polygonscan.com",
			"standard": "EIP3091"
		}]
	},
	'Optimism': {
		"name": "Optimism",
		"chain": "ETH",
		"rpc": ["https://mainnet.optimism.io/"],
		"faucets": [],
		"nativeCurrency": {
			"name": "Ether",
			"symbol": "ETH",
			"decimals": 18 as const
		},
		"infoURL": "https://optimism.io",
		"shortName": "oeth",
		"chainId": 10,
		"networkId": 10,
		"explorers": [{
			"name": "etherscan",
			"url": "https://optimistic.etherscan.io",
			"standard": "EIP3091"
		}]
	},
	'OptimismGoerli': {
		"name": "Optimism Goerli Testnet",
		"chain": "ETH",
		"rpc": ["https://goerli.optimism.io/"],
		"faucets": [],
		"nativeCurrency": {
			"name": "Görli Ether",
			"symbol": "ETH",
			"decimals": 18 as const
		},
		"infoURL": "https://optimism.io",
		"shortName": "ogor",
		"chainId": 420,
		"networkId": 420
	},
	'OptimismKovan': {
		"name": "Optimism Kovan",
		"title": "Optimism Testnet Kovan",
		"chain": "ETH",
		"rpc": ["https://kovan.optimism.io/"],
		"faucets": ["http://fauceth.komputing.org?chain=69&address=${ADDRESS}"],
		"nativeCurrency": {
			"name": "Kovan Ether",
			"symbol": "ETH",
			"decimals": 18 as const
		},
		"explorers": [
			{
			"name": "etherscan",
			"url": "https://kovan-optimistic.etherscan.io",
			"standard": "EIP3091"
			}
		],
		"infoURL": "https://optimism.io",
		"shortName": "okov",
		"chainId": 69,
		"networkId": 69
	},
	'SKALE': {
		"name": "SKALE",
		"chain": "ETH",
		"rpc": ["https://eth-online.skalenodes.com/v1/hackathon-content-live-vega"],
		"nativeCurrency": {
			name: "SKALE FUEL",
			symbol: "sFUEL",
			decimals: 18 as const
		},
		"explorers": [
			{
			"name": "block explorer", //just a guess
			"url": "https://hackathon-content-live-vega.explorer.eth-online.skalenodes.com/",
			//"standard": "EIP3091" //just a guess
			}
		],
		"infoURL": "https://skale.space",
		"shortName": "skale",
		"chainId": parseInt('0xf45db2a', 16),
		"networkId": parseInt('0xf45db2a', 16)
	},
	'SKALE Testnet': {
	//This is as documented at https://docs.skale.network/develop/wallets/metamask
	//but doesn't work becuase the rpc endpoint doesn't respond to the chain_id request:
	//"Request for method 'eth_chainId on https://dev-testnet-v1-0.skalelabs.com/ failed."
	//For that reason, it's commented out of the UI.
		"name": "SKALE Testnet",
		"chain": "ETH",
		"rpc": ["https://dev-testnet-v1-0.skalelabs.com"],
		"nativeCurrency": {
			name: "SKALE FUEL",
			symbol: "sFUEL",
			decimals: 18 as const
		},
		"explorers": [
			{
			"name": "expedition",
			"url": "https://expedition.dev/?rpcUrl=https://dev-testnet-v1-0.skalelabs.com",
			//"standard": "EIP3091" //just a guess
			}
		],
		"infoURL": "https://skale.space",
		"shortName": "skale",
		"chainId": 344435,
		"networkId": 344435
	},
}

export const RecipientPage = {
	SIGN_TX_BUTTON_LABEL: 'Sign transaction in wallet!',

	onPageLoad : function() {
		MostPages.onPageLoad();
		const masterParams = RecipientPage.getParamsFromPath();
		if (RecipientPage.recipientIsPresent(masterParams)) {
			RecipientPage.showSendPage(masterParams);
		} else {
			MostPages.setBlockVisibility('noRecipient', true);
			MostPages.setBlockVisibility('specifiedRecipient', false);
		}
	},

	recipientIsPresent: function(
		masterParams: MasterParams
	) : masterParams is MasterParamsWithRecipient {
		const recipient = masterParams.recipient;
		return (typeof recipient === 'string' && recipient.length > 0);
	},

	getParamsFromPath: function() : MasterParams {
		let pathname = window.location.pathname;
		if(pathname.startsWith('/')) { //trim if present
			pathname = pathname.substring(1);
		}
		let pathParts = pathname.split('/');
		let recipientPartIndex = 0; //may be different if subdomains are in use per #14
		let recipient = pathParts[recipientPartIndex];
		let amountOrViewCurrencyIndex = recipientPartIndex + 1;
		let amountOrViewCurrency = pathParts[amountOrViewCurrencyIndex];
		let viewCurrency : SupportedViewCurrency | undefined;
		let sendCurrency : SupportedSendCurrency | undefined;
		if(typeof amountOrViewCurrency === 'undefined') {
			//do nothing, but don't throw error when doing checks below
		} else if(RecipientPage.isSupportedViewCurrency(amountOrViewCurrency)) {
			viewCurrency = amountOrViewCurrency;
			amountOrViewCurrencyIndex++;
			amountOrViewCurrency = pathParts[amountOrViewCurrencyIndex];
		} else if (RecipientPage.isSupportedSendCurrency(amountOrViewCurrency)) {
			viewCurrency = amountOrViewCurrency;
			sendCurrency = amountOrViewCurrency;
			amountOrViewCurrencyIndex++;
			amountOrViewCurrency = pathParts[amountOrViewCurrencyIndex];
		}
		let amount : number | undefined = parseFloat(amountOrViewCurrency);
		if(isNaN(amount)) {
			amount = undefined;
		}
		let urlSearchParams = new URLSearchParams(window.location.search);
		let urlSearchParamsRecipient = urlSearchParams.get('to');
		if(urlSearchParamsRecipient !== null) {
			recipient = urlSearchParamsRecipient;
		}
		let urlSearchParamsViewCurrency = urlSearchParams.get('viewCurrency');
		if(urlSearchParamsViewCurrency !== null && RecipientPage.isSupportedViewCurrency(urlSearchParamsViewCurrency)) {
			viewCurrency = urlSearchParamsViewCurrency;
		}
		let urlSearchParamsSendCurrency = urlSearchParams.get('sendCurrency');
		if(urlSearchParamsSendCurrency !== null && RecipientPage.isSupportedSendCurrency(urlSearchParamsSendCurrency)) {
			sendCurrency = urlSearchParamsSendCurrency;
			viewCurrency = sendCurrency;
		}
		let urlSearchParamsAmount = urlSearchParams.get('amount');
		if(urlSearchParamsAmount !== null) {
			let urlSearchParamsAmountFloat = parseFloat(urlSearchParamsAmount);
			if(!isNaN(urlSearchParamsAmountFloat)) {
				amount = urlSearchParamsAmountFloat;
			}
		}
		return {
			recipient,
			amount,
			viewCurrency,
			sendCurrency,
		};
	},

	isSupportedViewCurrency: function(
		strIn: string
	) : strIn is SupportedViewCurrency {
		return supportedViewCurrencies.includes(strIn.toUpperCase());
	},

	isSupportedSendCurrency: function(
		strIn: string
	) : strIn is SupportedSendCurrency {
		return supportedSendCurrencies.includes(strIn.toUpperCase());
	},

	showSendPage: function(
		masterParams: MasterParamsWithRecipient
	) {
		const recipient = masterParams.recipient;
		MostPages.setBlockVisibility('noRecipient', false);
		MostPages.setBlockVisibility('specifiedRecipient', true);
		let recipientSpan = document.getElementById('recipient');
		if(recipientSpan === null) {
			throw new Error('Could not find span to set recipient.');
		}
		recipientSpan.innerText = recipient;
		RecipientPage.setSendAmount(masterParams.amount);
		RecipientPage.setViewAmount(masterParams.amount);
		RecipientPage.setViewCurrency(masterParams.viewCurrency);
		const signingButton = document.getElementById('signInWallet');
		if(!(signingButton instanceof HTMLButtonElement)) {
			throw new Error('Could not find onboarding button.');
		}
		RecipientPage.setupMetaMaskOnboarding(signingButton);
		RecipientPage.setNetworkOptionVisibility();
		const l2sCheckbox = document.getElementById('showL2s');
		const testNetsCheckbox = document.getElementById('showTestNets');
		if(l2sCheckbox instanceof HTMLInputElement && testNetsCheckbox instanceof HTMLInputElement) {
			l2sCheckbox.addEventListener('change', RecipientPage.setNetworkOptionVisibility);
			testNetsCheckbox.addEventListener('change', RecipientPage.setNetworkOptionVisibility);
		} else {
			console.error('Could not find network option checkboxes; not adding listeners.');
		}
		const networkSelector = document.getElementById('network');
		networkSelector?.addEventListener('change', RecipientPage.setEthName);
	},

	//Adapted from https://docs.metamask.io/guide/onboarding-library.html#using-vanilla-javascript-html
	setupMetaMaskOnboarding : function(
		onboardButton: HTMLButtonElement
	) {
		const onboarding = new MetaMaskOnboarding();
		let accounts: string[];

		const updateButton = () => {
			if (!MetaMaskOnboarding.isMetaMaskInstalled()) {
			onboardButton.innerText = 'Click here to install MetaMask!';
			onboardButton.onclick = () => {
				onboardButton.innerText = 'Onboarding in progress';
				onboardButton.disabled = true;
				onboarding.startOnboarding();
			};
			} else if (accounts && accounts.length > 0) {
				onboardButton.innerText = RecipientPage.SIGN_TX_BUTTON_LABEL;
				onboarding.stopOnboarding();
				onboardButton.disabled = false;
				onboardButton.onclick = () => {
					RecipientPage.initiateTransactionFromButton(onboardButton, accounts);
				};
			} else {
				// Not 'Click here to connect your blockchain wallet' because this is also the already-connected condition
				onboardButton.innerText = RecipientPage.SIGN_TX_BUTTON_LABEL;
				onboardButton.onclick = async () => {
					try {
						let accounts= await window.ethereum.request({
							method: 'eth_requestAccounts',
						}) as string[];
						RecipientPage.initiateTransactionFromButton(onboardButton, accounts);
					} catch (err: any) {
						if(err.code === -32002) {
							onboardButton.innerText = 'A connection request is pending; please open your blockchain wallet to confirm connection.';
							onboardButton.disabled = true;
						} else {
							console.error(err);
							throw(err);
						}
					}
				};
			}
		};

		updateButton();
		if (MetaMaskOnboarding.isMetaMaskInstalled()) {
			window.ethereum.on('accountsChanged', (newAccounts) => {
				accounts = newAccounts as string[];
				updateButton();
			});
		}
	},

	setEthName: function() {
		const networkOptionValue = RecipientPage.getSelectedNetwork();
		if(typeof networkOptionValue === 'undefined') {
			console.error('Cannot find selected network name to set native currency name, not setting it.');
			return; //without throwing
		}
		RecipientPage.getChainData(networkOptionValue);
		const chainData = RecipientPage.getChainData(networkOptionValue);
		const ethName = chainData.nativeCurrency.symbol;
		RecipientPage.setEthNameInList('sendCurrency', ethName);
		RecipientPage.setEthNameInList('viewCurrency', ethName);
	},

	setEthNameInList: function(
		listId: string,
		ethName: string,
	) {
		let list = document.getElementById(listId);
		if(!(list instanceof HTMLSelectElement)) {
			throw new Error('Could not find select list with id #' + listId + ' for setting native currency name.');
		}
		for(let option of list.options) {
			if(option.hasAttribute('data-isNative')) {
				option.innerText = ethName;
			}
		}
	},

	initiateTransactionFromButton: async function(
		signButton: HTMLButtonElement,
		accounts: string[]
	) {
		signButton.innerText = 'Signature pending; please open your blockchain wallet to confirm transaction.';
		signButton.disabled = true;
		const sendAmountInput = document.getElementById('sendAmount');
		if(!(sendAmountInput instanceof HTMLInputElement)) {
			console.error('Could not find amount input; not sending.');
			return;
		}
		const sendAmountInputValue = sendAmountInput.value;
		const sendAmountInWei = ethers.utils.parseEther(sendAmountInputValue);
		try {
			await RecipientPage.connectToSelectedNetwork();
			//@ts-ignore see https://github.com/MetaMask/providers/issues/200
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			/* Consider restoring this after debugging why tx rejection doesn't propagate
			const tx = await RecipientPage.initiateTransactionWithEthers(
				RecipientPage.getRecipientAddressAsDisplayed(),
				sendAmountInputValue,
				accounts[0],
				provider.getSigner()
			);*/
			const txHash = await RecipientPage.initiateTransaction(
				await RecipientPage.getRecipientAddress(provider),
				sendAmountInWei.toHexString(),
				accounts[0]
			);
			signButton.innerText = 'Transaction pending on network';
			let completedTxDetails = await RecipientPage.waitThrough429s(provider, txHash);
			signButton.innerText = 'Transaction initially confirmed on network!';
			const confirmationsNeeded = 6; //TODO: Allow recipient to specify
			if(completedTxDetails.confirmations < confirmationsNeeded) {
				completedTxDetails = await RecipientPage.waitThrough429s(provider, txHash, confirmationsNeeded);
			}
			signButton.innerText = 'Success: Transaction confirmed at least ' + confirmationsNeeded + 'x on network!';
		} catch(err: any) {
			if(err.code === 4001) {
				//user rejected tx signature request.
				signButton.disabled = false;
				signButton.innerText = RecipientPage.SIGN_TX_BUTTON_LABEL;
			}
		}
	},

	waitThrough429s: async function(
		provider: ethers.providers.Web3Provider,
		txHash: string,
		desiredConfirmations?: number
	) : Promise<ethers.providers.TransactionReceipt> {
		try {
			let completedTxDetails = await provider.waitForTransaction(txHash, desiredConfirmations);
			console.log('Successfully transferred from ' + completedTxDetails.from + ' to ' + completedTxDetails.to + '. Other details: ', completedTxDetails);
			return completedTxDetails;
		} catch(err: any) {
			if(err.code === -32603 && err.message.includes('429')) {
				console.warn('Got a 429 error when checking for status of tx ' + txHash + ': ' + err.message + '; will retry.');
				return RecipientPage.waitThrough429s(provider, txHash, desiredConfirmations);
			} else {
				throw err;
			}
		}
	},

	getRecipientAddressAsDisplayed: function() : string {
		const recipientElement = document.getElementById('recipient');
		if(recipientElement === null || recipientElement?.textContent === null) {
			throw new Error('Could not find #recipient element.');
		} else {
			return recipientElement.textContent;
		}
	},

	getRecipientAddress: async function(
		provider: ethers.providers.Provider
	) : Promise<string> {
		let displayedRecipient = RecipientPage.getRecipientAddressAsDisplayed();
		let ethersAddress = displayedRecipient;
		try {
			ethersAddress = ethers.utils.getAddress(displayedRecipient);
			return ethersAddress;
		} catch(err: any) {
			if(err.code === 'INVALID_ARGUMENT') {
				const resolvedAddress = await provider.resolveName(displayedRecipient);
				if(resolvedAddress !== null) {
					RecipientPage.setAlternativeNameWarning(); //clear this before check
					let reverseNameLookup = await provider.lookupAddress(resolvedAddress);
					if(reverseNameLookup !== displayedRecipient) {
						if(reverseNameLookup === null) {
							console.warn('Forward ENS lookup succeded, but reverse lookup failed. Will not show name-change warning in UI.');
						} else {
							RecipientPage.setAlternativeNameWarning(reverseNameLookup);
						}
					}
					return resolvedAddress;
				} else {
					throw new Error('Target address is not a valid Ethereum or ENS address.');
				}
			}
			throw err;
		}
	},

	//Pass undefined first param to get rid of the message
	setAlternativeNameWarning: function(
		reverseNameLookup?: string
	) {
		let messageSpan = document.getElementById('primaryENSDiffers');
		let otherNameSpan = document.getElementById('primaryENS');
		if(messageSpan === null || otherNameSpan === null) {
			throw new Error('Cannot find elements needed to show alternative name warning.');
		}
		if(typeof reverseNameLookup === 'undefined') {
			messageSpan.style.display = 'none';
		} else {
			otherNameSpan.innerHTML = reverseNameLookup;
			messageSpan.style.display = 'inline';
		}
	},

	//Adapated from https://docs.metamask.io/guide/ethereum-provider.html#example
	initiateTransaction: async function(
		toAddress: string,
		hexValue: string,
		from: string
	) : Promise<string> {
		try {
			const result = await ethereum.request({
			method: 'eth_sendTransaction',
			params:
				[{
					from,
					to: toAddress,
					value: hexValue,
					gas: '0x'+(21000).toString(16), //MetaMask can't estimate on some chains
				}],
			});
			return result as string;
			// The result varies by RPC method.
			// For example, this method will return a transaction hash hexadecimal string on success.
		} catch(err: any) {
			if(err.code !== 4001) {
				console.error('Got error from sending: ', err);
			}
			throw(err);
			// If the request fails, the Promise will reject with an error.
		}
	},

	initiateTransactionWithEthers: async function(
		toAddress: string,
		value: string,
		from: string,
		signer: ethers.Signer
	) : Promise<ethers.providers.TransactionResponse> {
		const tx = signer.sendTransaction({
			to: toAddress, //can be ENS
			value: ethers.utils.parseEther(value),
			from,
			gasLimit: 21000
		});
		//This point in the code is reached, but if the user
		//rejects the transaction, the promise never resolves or rejects.
		//See https://github.com/ethers-io/ethers.js/issues/3189
		return tx;
	},

	setSendAmount: function(
		amount: number | string = 0,
		skipPropagation = false,
	) {
		RecipientPage.setNumericValue(amount, 'sendAmount');
	},

	setViewAmount: function(
		amount: number | string = 0,
		skipPropagation = false,
	) {
		RecipientPage.setNumericValue(amount, 'viewAmount');
	},

	setNumericValue: function(
		amount: number | string = 0,
		inputId: string
	) {
		let inputElement = document.getElementById(inputId);
		if(!(inputElement instanceof HTMLInputElement)) {
			throw new Error('Could not find input #' + inputId + '.');
		}
		inputElement.value = amount.toString();
	},

	setViewCurrency: function(
		viewCurrency: SupportedViewCurrency = 'USD',
		skipPropagation = false
	) {
		let input = document.getElementById('viewCurrency');
		if(!(input instanceof HTMLSelectElement)) {
			throw new Error('Could not find select element to set view currency.');
		}
		RecipientPage.selectOptionWithValue(input, viewCurrency);
	},

	selectOptionWithValue: function(
		selectElement: HTMLSelectElement,
		value: string
	) {
		for(let option of selectElement.options) {
			if(option.value === value.toUpperCase()) {
				option.selected = true;
				return;
			}
		}
		console.warn('Could not find option with value ' + value + ' in list for ',selectElement);
	},

	setNetworkOptionVisibility: function() {
		const selectList = document.getElementById('network');
		if(!(selectList instanceof HTMLSelectElement)) {
			throw new Error ('Could not find network select list.');
		}
		const showTestNets = RecipientPage.getCheckboxValue('showTestNets');
		const showL2s = RecipientPage.getCheckboxValue('showL2s');
		for(let option of selectList.options) {
			if(option.hasAttribute('data-isTest') && option.hasAttribute('data-isL2')) {
				option.hidden = !(showL2s && showTestNets);
			} else if(option.hasAttribute('data-isTest')) { //L1 test net
				option.hidden = !(showTestNets);
			} else if(option.hasAttribute('data-isL2')) { //L2 main net
				option.hidden = !(showL2s);
			}
		}
	},

	setOptionsVisibility: function(
		selectList: HTMLSelectElement,
		attributeName: string,
		shouldBeShown: boolean
	) {
		for(let option of selectList.options) {
			if(option.hasAttribute(attributeName)) {
				option.hidden = !shouldBeShown;
			}
		}
	},

	getCheckboxValue: function(
		id: string
	) {
		let checkbox = document.getElementById(id);
		if(!(checkbox instanceof HTMLInputElement)) {
			throw new Error('Could not find checkbox with id ' + id);
		}
		return checkbox.checked;
	},

	connectToSelectedNetwork: async function() {
		const networkOptionValue = RecipientPage.getSelectedNetwork();
		if(typeof networkOptionValue === 'undefined') {
			console.error('Cannot find #network selectlist to know which network to connect to.');
		} else {
			const addEthereumChainParameter = RecipientPage.getAddEthereumChainParameter(networkOptionValue);
			await RecipientPage.switchToNetwork(addEthereumChainParameter);
			console.log('Connected to ' + networkOptionValue + '.');
		}
	},

	getSelectedNetwork: function() {
		const networkPicker = document.getElementById('network');
		if(!(networkPicker instanceof HTMLSelectElement)) {
			console.error('Cannot find #network selectlist.');
		} else {
			return networkPicker.value;
		}
	},

	getAddEthereumChainParameter(networkOptionValue: string) : AddEthereumChainParameter {
		let chainData = RecipientPage.getChainData(networkOptionValue);
		let explorerURLs : string[] = [];
		if(typeof chainData.explorers !== 'undefined') {
			for(let explorer of chainData.explorers) {
				explorerURLs.push(explorer.url);
			}
		}
		return {
			//Note: Don't use ethers.BigNumber.from(chainData.chainId).toHexString() as it zero-pads to an even number of nibbles
			chainId: '0x'+chainData.chainId.toString(16), // A 0x-prefixed hexadecimal string
			chainName: chainData.name,
			nativeCurrency: chainData.nativeCurrency,
			rpcUrls: chainData.rpc,
			blockExplorerUrls: explorerURLs.length > 0 ? explorerURLs : undefined,
		}
	},

	getChainData(networkOptionValue: keyof typeof CHAINS_DATA) {
		let retval = CHAINS_DATA[networkOptionValue];
		if(typeof retval === 'undefined') {
			throw new Error('Did not recognize network name: ' + networkOptionValue);
		} else {
			return retval;
		}
	},

	async switchToNetwork(chainDetails: AddEthereumChainParameter) {
		//See https://stackoverflow.com/a/68267546
		try {
			// check if the chain to connect to is installed
			await window.ethereum.request({
				method: 'wallet_switchEthereumChain',
				params: [{ chainId: chainDetails.chainId }],
			});
		} catch (error: any) {
			if (error.code === 4902 || error.code === -32603) {
				//chain not yet added: add it now
				try {
				await window.ethereum.request({
					method: 'wallet_addEthereumChain',
					params: [chainDetails],
				});
				} catch(err) {
					console.error(err);
					throw(err);
				}
			} else {
				throw error;
			}
		}
	},

}
