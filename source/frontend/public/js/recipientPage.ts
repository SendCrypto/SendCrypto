

import { MostPages } from "./mostPages.js";

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
	},

	setSendAmount: function(
		amount: number | string = 0,
		skipPropagation = false,
	) {
		let amountInput = document.getElementById('sendAmount');
		if(!(amountInput instanceof HTMLInputElement)) {
			throw new Error('Could not find input to set sendAmount.');
		}
		amountInput.value = amount.toString();
	},
}
