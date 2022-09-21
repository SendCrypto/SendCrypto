

import { MostPages } from "./mostPages.js";
import MetaMaskOnboarding from '@metamask/onboarding';

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

export const RecipientPage = {
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
		let amount : number | undefined = parseInt(amountOrViewCurrency);
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
				onboardButton.innerText = 'Connected';
				onboardButton.disabled = true;
				onboarding.stopOnboarding();
			} else {
				onboardButton.innerText = 'Click here to connect your blockchain wallet';
				onboardButton.onclick = async () => {
					await window.ethereum.request({
					method: 'eth_requestAccounts',
					});
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

}
