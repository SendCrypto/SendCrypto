This document describes how to get this code running.

# Obtain a license
First, you'll need to obtain a [license](license.md).  

# Get a copy of the code
There are many ways to do this, but the easiest is probably to install
[GitHub Desktop](https://desktop.github.com/), then go to the
[repository homepage on GitHub](https://github.com/SendCrypto/SendCrypto)
and click the Code button in the upper right corner:  
![Screenshot of clicking 'Code' drop-down button in dark mode](images/CodeButton.png)  
and then click Open with GitHub Desktop.
You may need to select the folder where you want the code cloned to.  
For all further instructions, the folder where the repository is stored, where the
[main README](../README.md) can be found, will be referred to as INSTALLDIR.  
From GitHub Desktop, you can open this directory in your file explorer by clicking the
button in the middle row as shown:  
![Screenshot of GitHub Desktop with this repo open in dark mode](images/GitHubDesktop.png)  

# Set environment variables
**Before** you open any terminal or code editor to run this program, set the following environment variables:  
*(none at present)*

# Run the code
This is a Node application with an SQL backend.  The SQL piece may eventually migrate to TableLand but isn't there yet.  
To run, open a terminal and `cd` to INSTALLDIR.
If you haven't done so before (e.g. first-time install), run `npm i` to install dependencies.  
Then run `npm start`.  
