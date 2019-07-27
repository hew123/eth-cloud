import React, {Component} from 'react';
import './App.css';
import web3 from './web3';
import ipfs from './ipfs';
import cloud from './cloud';
import 'react-bootstrap';

class App extends Component{

  state = {
    ownerAddress:'',
    contractAddress:'',
    buffer:'',
    naming:'',
    returnHash:'',
    transactionHash:'',
    dataList:'',
    numberOfItems:''
  };

    //get contract's info
    getHash = async(event) =>{
      event.preventDefault();

      //get hash from contract
      const contractAddress = await cloud.options.address;
      this.setState({contractAddress});

        try{
          await window.ethereum.enable();
          const accounts = await web3.eth.getAccounts();
          const ownerAddress = accounts[0];
          this.setState({ownerAddress});

          const idList = await cloud.methods.getDataByOwner(ownerAddress).call();
          console.log("the hash array is " + idList);
          const numberOfItems = idList.length;
          this.setState({numberOfItems});
          //const dataLink = "https://ipfs.io/ipfs/"+ipfsHash;
          //this.setState({dataLink});

          const dataList = [];

          for (var index in idList) {
            var data = await cloud.methods.datas(idList[index]).call();
            var link = "https://ipfs.io/ipfs/"+ data.ipfsHash;
            dataList.push(
            //<li key={idList[index]}> {data.name} : {link} </li>);
            <tr><td key={idList[index]}>  {data.name} </td>
            <td>  <a href={link}> {link} </a></td>
            </tr>);
            console.log("data is " + data.name + " :"+ data.ipfsHash);
          }

          /*const dataList = idList.map((id)=> {
            <li key={id}>
              {id} </li>
          });*/
          this.setState({dataList});

        } catch(error){
          console.log(error);
        }

        console.log("contract's info retrieved");

      };//end of onClick

      //uploading file
      captureFile = (event) =>{
        event.stopPropagation();
        event.preventDefault();
        let self = this;
        const file = event.target.files[0];
        let reader = new window.FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = async function(e) {
          var rawLog = reader.result;
          console.log(reader);
          const buffer = await Buffer.from(rawLog);
          self.setState({buffer});
          };
      };

      naming = (event) =>{
        event.stopPropagation();
        event.preventDefault();
        this.setState({naming:event.target.value});
      }
      //upload to ipfs
      onSubmit = async (event) =>{
        event.preventDefault();

        //user's metamask account
        try{
          await window.ethereum.enable();
          const accounts = await web3.eth.getAccounts();
          const user = accounts[0];
          console.log('Sending from Metamask account: ' + accounts[0]);


          //upload to ipfs
          await ipfs.add(this.state.buffer,(err,result) => {
            console.log(err,result);
            this.setState({returnHash:result[0].hash});

            //call contract methods
            cloud.methods.pushData(this.state.naming, this.state.returnHash).send(
              {from:accounts[0]},(error,transactionHash) => {
                console.log(transactionHash);
                this.setState({transactionHash});
              });
            })

          }catch(error){
            console.log(error);
          }

          /*const results = await ipfs.add(this.state.buffer);
          console.log("ipfs upload result: "+results);
          const hash = results[0].hash;
          console.log(hash);
          this.setState({returnHash:hash});*/
          //storehash.methods.saveHash(this.state.ipfsHash).send({from: user});
        };


    render(){
      return(
        <div className="App">
            <h3> upload a file to ipfs </h3>
            <form onSubmit={this.onSubmit}>
            name this file
            <input type="text" onChange={this.naming}/>
            <br/>
            <input type="file" onChange={this.captureFile}/>
                <button type="submit">
                    Upload to ipfs </button>
                    </form>
                    <hr/>


        <button onClick = {this.getHash}> Get Saved Hash </button>

          <table bordered responsive>
                <thead>
                  <tr>
                    <th>Tx Receipt Category</th>
                    <th>Values</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>Ethereum Contract Address</td>
                    <td>{this.state.contractAddress}</td>
                  </tr>
                  <tr>
                    <td>From Account</td>
                    <td>{this.state.ownerAddress}</td>
                  </tr>
                  <tr>
                    <td> number of items stored by this account</td>
                    <td>{this.state.numberOfItems}</td>
                  </tr>
                </tbody>
            </table>
            <h3>List of stored items by this account</h3>
            <table>
              <thead>
                <th>data name</th>
                <th>ipfs link </th>
              </thead>
              <tbody>{this.state.dataList}</tbody>
            </table>
     </div>
      );
    }
}

export default App;
