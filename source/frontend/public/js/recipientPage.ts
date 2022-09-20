

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

const supportedViewCurrencies = ['USD'];
const supportedSendCurrencies = ['ETH'];
type SupportedViewCurrency = SupportedSendCurrency | typeof supportedViewCurrencies[number];
type SupportedSendCurrency = typeof supportedSendCurrencies[number];

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
		return {
			recipient,
		};
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
	},
}
