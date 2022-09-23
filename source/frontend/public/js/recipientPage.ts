

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
		console.log('Recipient is ', recipient, 'pathParts: ',pathParts);
		let amountOrViewCurrencyIndex = recipientPartIndex + 1;
		let amountOrViewCurrency = pathParts[amountOrViewCurrencyIndex];
		let viewCurrency : SupportedViewCurrency | undefined;
		let sendCurrency : SupportedSendCurrency | undefined;
		if(RecipientPage.isSupportedViewCurrency(amountOrViewCurrency)) {
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
		console.log('Master params:', masterParams);
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
		const recipientAddress = RecipientPage.getRecipientAddress();
		console.log('Amount input value: ' + typeof sendAmountInputValue , sendAmountInputValue + ' hex: ' + sendAmountInWei.toHexString() + 'recipient: ', recipientAddress);
		try {
			await RecipientPage.initiateTransaction(
				recipientAddress,
				sendAmountInWei.toHexString(),
				accounts[0]
			);
		} catch(err: any) {
			if(err.code === 4001) {
				//user rejected tx signature request.
				signButton.disabled = false;
				signButton.innerText = RecipientPage.SIGN_TX_BUTTON_LABEL;
			}
		}

	},

	getRecipientAddress: function() : string {
		const recipientElement = document.getElementById('recipient');
		if(recipientElement === null || recipientElement?.textContent === null) {
			throw new Error('Could not find #recipient element.');
		} else {
			return recipientElement.textContent;
		}
	},

	//Adapated from https://docs.metamask.io/guide/ethereum-provider.html#example
	initiateTransaction: async function(
		toAddress: string,
		hexValue: string,
		from: string
	) {
		try {
			const result = await ethereum.request({
			method: 'eth_sendTransaction',
			params:
				[{
					from,
					to: toAddress,
					value: hexValue,
				}],
			});
			console.log('Got result from sending: ', result);
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


	getAddEthereumChainParameter(networkOptionValue: string) : AddEthereumChainParameter {
		let chainData = RecipientPage.getChainData(networkOptionValue);
		let explorerURLs : string[] = [];
		if(typeof chainData.explorers !== 'undefined') {
			for(let explorer of chainData.explorers) {
				explorerURLs.push(explorer.url);
			}
		}
		return {
			chainId: ethers.BigNumber.from(chainData.chainId).toHexString(), // A 0x-prefixed hexadecimal string
			chainName: chainData.name,
			nativeCurrency: chainData.nativeCurrency,
			rpcUrls: chainData.rpc,
			blockExplorerUrls: explorerURLs.length > 0 ? explorerURLs : undefined,
		}
	},

	//TODO: Load directly from https://github.com/ethereum-lists/chains
	//adding 'as const' after decimals: 18 or otherwise handling that
	getChainData(networkOptionValue: string) {
		switch(networkOptionValue) {
			case 'ETH':
				return {
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
				}
			case 'Goerli':
				return {
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
				}
			//case 'Goerli-alt':
			//	break;
			case 'Polygon':
				return {
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
				}
			case 'Mumbai':
				return {
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
				}
			case 'Optimism':
				return {
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
				};
			case 'OptimismGoerli':
				return {
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
				}
			case 'OptimismKovan':
				return {
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
				};
			default:
				throw new Error('Did not recognize network name: ' + networkOptionValue);
		}
	},

	async switchToNetwork(chainDetails: AddEthereumChainParameter) {
		//See https://stackoverflow.com/a/68267546
		try {
			// check if the chain to connect to is installed
			await window.ethereum.request({
				method: 'wallet_switchEthereumChain',
				params: [{ chainId: ethers.BigNumber.from(chainDetails.chainId).toHexString() }],
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
