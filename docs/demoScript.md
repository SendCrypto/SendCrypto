Good morning! [1.7]
It's still early in the world of web3, [3.25/s] where even simple tasks like sending money to someone can be a daunting challenge for a newcomer to the tech. [8]
Asking for it clearly can be tricky for traditional webmasters too, [11.5/s] even with open-source examples like the metamask-onboarding repo, [15/s] because it involves scripting for the various steps of figuring out if a person has a wallet, if it's connected, figuring out what assets a person has that they might be able to send and where those assets are kept across L2s and mainnets, actually triggering a transaction, and waiting for confirmation. [29] That learning curve to getting things right might discourage some people altogether. 
[33/s]

SendCrypto makes things a lot easier for both that would-be sender and web developer.
[37.5]
In the web2 world, if you want to provide lots of private data to a centralized and sometimes censoring private business, [43.5/s]
you can go to PayPal and set up a PayPal.me link of the form PayPal.me/YourName/25 [49.5] where the optional number at the end is the amount of the payment. [52.5] 
You can then share this link with others who can click on it and after further confirming details with PayPal, send their money to your PayPal account. [59/s] 
PayPal also has an option to set up a donate button, [1:02] with an example shown [here](https://inkscape.org/release/inkscape-0.92.4/windows/64-bit/compressed-7z/dl/)
or [here](https://inkscape.org/support-us/donate/). [1:03.7/s] (This includes the added optional feature of monthly recurring donations, something SendCrypto doesn't currently have but hopefully will in the future.) 
[1:10.5/s]
SendCrypto is the web3 equivalent of Paypal.me, bringing the benefits of decentralization and access to cryptocurrency.  
[1:17/s]
There is a SendCrypto page for every blockchain address, also accessible by ENS addressing, and it's easy to create a link to the page where you are the recipient [1:24.5], which you can then share through any channel you want.  [1:27].
Optionally, you can specify the amount you want someone to be prompted to send when they click the link.  [1:32]
This can be a fixed amount, or you can dynamically program it in to some workflow, [1:36] or like so many fundraising e-mails and web pages you can 
give people options with different amounts in different links displayed side by side, including a custom option. 
[1:44.5] 
You can also convert those links to QR codes and put them up somewhere, [1:47.5] for example next to fixed-amount credit card tap squares like I recently saw at an event with a few different-price package options [1:54], or on the bottom of an invoice, for the amount of the invoice. 
[1:57]
Ideally, you should be able to specify this amount in terms of any crypto asset or common unit of account, including government-issued currencies. [2:04.5]
The default here is USD, with conversion to other government-issued currencies likely to be calculated through USD in an attempt to estimate equivalencies through the most liquid exchange markets. [2:15] However, I was out on planned travel for most of the hackathon period so this currency conversion piece isn't in place as of this video recording. [2:22] At the moment, you can only send an EVM network's native token and you have to specify the amount in ETH if you want to specify the amount at all. [2:29/s] If the network you want to transact on uses a different name, like MATIC on Polygon, that'll show up in the interface.  [2:35.5] Several chains are supported, prioritizing hackathon sponsors, and testnets are available if you click on the box to show them. [2:41.5]
There's also a link to learn more about whatever network you might select.
[2:45/s]
Here's an example of another project that looks pretty awesome, and [2:48.5] has posted a blockchain address for donations, [2:50.5] but there's no link there which makes donation as simple as a few clicks. [2:54] Following the instructions on the SendCrypto homepage, we [2:57] can create a link and embed that in the site instead. [2:59.5] In this demo video, I'm only editing my local view of that site, [3:03] to illustrate that its webmaster could easily make this change for everybody. [3:07] Then, someone coming to the page can just click the link, [3:10] enter an amount, and donate. [3:11.5] And if you stick around to see the transaction finalized, [3:14] there's a fun reward! [3:15.5]  Notifications to the sender and/or recipient may or may not be working right now but should allow the sender to include a memo, such as an invoice number, and make it easy for the recipient to respond with a few words of thanks.
[3:26.5]
Eventually, you'll be able to embed and customize the pages for which you are the recipient, [3:31] or where the recipient has designated you to customize their page, [3:34.5] 
making it easy to specify alternative forms of donation [3:37.5] such as a mailing address where a check can be mailed or other fundraising links that don't use 
cryptocurrency at all, [3:43] allowing the recipient to only have to post one fundraising link to a page that supports and even prioritizes the crypto option.  
[3:50]
Even if payers or donors don't use that option, the exposure will help communicate the message that this technology is becoming more mainstream, maybe making it worth learning more about.  
[3:58.5]
