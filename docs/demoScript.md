Good morning! 
It's still early in the world of web3, where even simple tasks like sending money to someone can be a daunting challenge for a newcomer to the tech.
Asking for it clearly can be tricky for traditional webmasters too, even with open-source examples like the metamask-onboarding repo, because it involves scripting for the various steps of figuring out if a person has a wallet, if it's connected, figuring out what assets a person has that they might be able to send and where they're kept across L2s and mainnets, actually triggering a transaction, and waiting for confirmation. That learning curve to getting things right might discourage some people altogether. 

SendCrypto makes things a lot easier for both that would-be sender and web developer.

In the web2 world, if you want to provide lots of private data to a centralized and sometimes censoring private business,
you can go to PayPal and set up a PayPal.me link of the form PayPal.me/YourName/25 where the optional number at the end is the amount of the payment.  
You can then share this link with others who can click on it and after further confirming details with PayPal, send their money to your PayPal account.  
PayPal also has an option to set up a donate button, with an example shown [here](https://inkscape.org/release/inkscape-0.92.4/windows/64-bit/compressed-7z/dl/)
or [here](https://inkscape.org/support-us/donate/). (This includes the added optional feature of monthly recurring donations, something SendCrypto doesn't currently have but hopefully will in the future.) 

SendCrypto is the web3 equivalent of that, bringing the benefits of decentralization and access to cryptocurrency.  

There is a SendCrypto page for every blockchain address, also accessible by ENS addressing, and it's easy to create a link to the page where you are the recipient, which you can then share through any channel you want.  
Optionally, you can specify the amount you want someone to be prompted to send when they click the link.  
This can be a fixed amount, or you can dynamically program it in to some workflow, or like so many fundraising e-mails and web pages you can 
give people options with different amounts in different links displayed side by side, including a custom option.  
You can also convert those links to QR codes and put them up somewhere, for example next to fixed-amount credit card tap squares as shown in this real-world example that predates this project, or on the bottom of a bill, for the amount of the bill. 

Ideally, you should be able to specify this amount in terms of any crypto asset or common unit of account, including government-issued currencies.
The default here is USD, with conversion to other government-issued currencies likely to be calculated through USD in an attempt to estimate equivalencies through the most liquid exchange markets. However, I was out on planned travel for most of the hackathon period so this currency conversion piece isn't in place yet. At the moment, you can only send an EVM network's native token and you have to specify the amount in ETH if you want to specify the amount at all. If the network you want to transact on uses a different name, like MATIC on Polygon, that'll show up in the interface.  Several chains are supported, prioritizing hackathon sponsors, and testnets are available if you click on the box to show them. 
There's also a link to learn more about whatever network you might select.

Here's an example of another project that looks pretty awesome, and has posted a blockchain address for donations, but there's no link there which makes donation as simple as a few clicks. Following the instructions on the SendCrypto homepage, we can create a link and embed that in the site instead. In this demo video, I'm only editing my local view of that site, to illustrate that its webmaster could easily make this change for everybody. Then, someone coming to the page can just click the link, enter an amount, and donate. And if you stick around to see the transaction finalized, there's a fun reward!  Notifications to the sender and/or recipient may or may not be working right now but should allow the sender to include a memo, such as an invoice number, and make it easy for the recipient to respond with a few words of thanks.

Eventually, you'll be able to embed and customize the pages for which you are the recipient, or where the recipient has designated you to customize their page, 
making it easy to specify alternative forms of donation such as an address where a check can be mailed or other fundraising links that don't use 
cryptocurrency at all, allowing the recipient to only have to post one fundraising link to a page that supports and even prioritizes the crypto option.  

Even if payers or donors don't use that option, the exposure will help communicate the message that this technology is coming and becoming more mainstream, maybe making it worth learning more about.  
