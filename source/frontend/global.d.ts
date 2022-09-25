import type { MetaMaskInpageProvider } from '@metamask/providers';
declare global {
	var ethereum: MetaMaskInpageProvider; //see https://github.com/MetaMask/metamask-docs/issues/443
}
