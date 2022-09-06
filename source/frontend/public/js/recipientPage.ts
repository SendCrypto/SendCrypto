

import { MostPages } from "./mostPages.js";

interface MasterParams {
	recipient ?: string,
	amount ?: number,
	amountCurrency ?: string,
	sendCurrency ?: string,
	network ?: string,
}

export const RecipientPage = {
	onPageLoad : function() {
		MostPages.onPageLoad();
		const masterParams = RecipientPage.getParamsFromPath();
		const recipient = masterParams.recipient;
		if(typeof recipient === 'string' && recipient.length > 0) {
			console.log('Recipient detected.', recipient);
			MostPages.setBlockVisibility('noRecipient', false);
			MostPages.setBlockVisibility('specifiedRecipient', true);
		} else {
			MostPages.setBlockVisibility('noRecipient', true);
			MostPages.setBlockVisibility('specifiedRecipient', false);
		}
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
}
