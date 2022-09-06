export const MostPages = {
	onPageLoad : function() {
		MostPages.addFaviconsToHead();
	},

	//Add tags per instructions from realfavicongenerator.net
	addFaviconsToHead: function() {
		const head = document.getElementsByTagName('head')[0];
		if(typeof head === 'undefined') {
			console.error('Cannot find head element to add favicon metadata; skipping that.');
			return;
		}
		head.append(
			MostPages.createElementWithAttributes(
				'link',
				{
					rel: "apple-touch-icon",
					sizes: "180x180",
					href: "/apple-touch-icon.png",
				}
			),
			MostPages.createElementWithAttributes(
				'link',
				{
					rel: "icon",
					type: "image/png",
					sizes: "32x32",
					href: "/favicon-32x32.png",
				}
			),
			MostPages.createElementWithAttributes(
				'link',
				{
					rel: "icon",
					type: "image/png",
					sizes: "16x16",
					href: "/favicon-16x16.png",
				}
			),
			MostPages.createElementWithAttributes(
				'link',
				{
					rel: "manifest",
					href: "/site.webmanifest",
				}
			),
			MostPages.createElementWithAttributes(
				'link',
				{
					rel: "mask-icon",
					href: "/safari-pinned-tab.svg",
					color: "#66bb6a",
				}
			),
			MostPages.createElementWithAttributes(
				'meta',
				{
					name: "msapplication-TileColor",
					content: "#b6ecf6",
				}
			),
			MostPages.createElementWithAttributes(
				'meta',
				{
					name: "theme-color",
					content: "#b6ecf6",
				}
			),
		);
	},

	createElementWithAttributes: function<
		EN extends keyof HTMLElementTagNameMap
	> (
		tagName: string & EN,
		attributes: { [index: string] : string }
	) : HTMLElementTagNameMap[EN] {
		const result = document.createElement(tagName);
		for(let attributeName in attributes) {
			result.setAttribute(attributeName, attributes[attributeName]);
		}
		return result;
	},

}
