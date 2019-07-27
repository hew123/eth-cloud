pragma solidity ^0.4.25;

contract ethCloud {

  struct Data {
    string name;
    string ipfsHash;
  }

  Data[] public datas;

  mapping (uint => address) public dataToOwner;
  mapping (address => uint) public ownerDataCount;

  event newData(uint _id, string _name, string _hash);

  function pushData(string _name, string _hash) external {
    uint id = datas.push(Data(_name,_hash)) -1;
    dataToOwner[id] = msg.sender;
    ownerDataCount[msg.sender]++;
    emit newData(id, _name, _hash);
  }

  function getDataByOwner(address _owner) external view returns(uint[]) {
    uint[] memory result = new uint[](ownerDataCount[_owner]);
    uint counter = 0;
    for (uint i = 0; i < datas.length; i++) {
      if (dataToOwner[i] == _owner) {
        result[counter] = i;
        counter++;
      }
    }
    return result;
  }

  /*function getDataById(uint _id) external view returns(Data){
    return datas[_id];
  }*/
}
