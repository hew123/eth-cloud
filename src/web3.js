import Web3 from 'web3';

//const web3 = new Web3(window.web3.currentProvider);
//const web3 = new Web3(window.ethereum);

var web3;

if(window.ethereum) //modern dapp browsers
   web3 = new Web3(window.ethereum);
else if(window.web3) //legacy dapp browsers
   web3 = new Web3(window.web3.currentProvider);
else
  console.log("something is wrong");

export default web3;
