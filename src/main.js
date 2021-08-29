import "regenerator-runtime/runtime";
import * as nearAPI from "near-api-js";
import getConfig from "./config";
import Big from 'big.js';

const BOATLOAD_OF_GAS = Big(3).times(10 ** 13).toFixed();
const SUGGESTED_DONATION = '0';

let nearConfig = getConfig(process.env.NODE_ENV || "development");
window.nearConfig = nearConfig;

// Connects to NEAR and provides `near`, `walletAccount` and `contract` objects in `window` scope
async function connect() {
  console.log("enter connect")
  // Initializing connection to the NEAR node.
  window.near = await nearAPI.connect(Object.assign(nearConfig, { deps: { keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore() }}));

  // Needed to access wallet login
  window.walletAccount = new nearAPI.WalletConnection(window.near);

  // Initializing our contract APIs by contract name and configuration.
  window.contract = await near.loadContract(nearConfig.contractName, {
    viewMethods: ['getAllPhone'],
    changeMethods: ['addPhone', 'deletePhone'], 
    sender: window.walletAccount.getAccountId()
  });
}


//sign-in
document.getElementById("signInBtn").addEventListener('click', login, false); 
function login() {
  console.log('login')
    walletAccount.requestSignIn(nearConfig.contractName, 'phone book');
}

//signoutBtn
document.getElementById("signoutBtn").addEventListener('click', logout, false); 
function logout() {
  console.log('logout')
  walletAccount.signOut();
  window.location.replace(window.location.origin + window.location.pathname)
}

//updateBtn
document.getElementById("updateBtn").addEventListener('click', update, false); //update 
function update(){
  console.log("update")
  updateUI()
  // var indexNum = 1
  // contract.deletePhone(
  //   { index: indexNum },
  //   BOATLOAD_OF_GAS,
  //   Big(SUGGESTED_DONATION || '0').times(10 ** 24).toFixed()
  // )
}

//save
document.getElementById("saveBtn").addEventListener('click', save, false); 
function save(){
  var inpVal = document.getElementById("inp").value;
  console.log(inpVal,'inpVal')
  contract.addPhone(
    { text: inpVal },
    BOATLOAD_OF_GAS,
    Big(SUGGESTED_DONATION || '0').times(10 ** 24).toFixed()
  ).then(updateUI())
}

//UpdateUI
function updateUI() {
  var signoutBtn = document.getElementById('singOutBlock')
  var signInBtn = document.getElementById('singInBlock')
  if (!window.walletAccount.getAccountId()) {
    console.log('if')
    signInBtn.style.display = 'block'
    signoutBtn.style.display = 'none'
    Array.from(document.querySelectorAll('.sign-in')).map(it => it.style = 'display: block;');
  } else {
    console.log('else')
    signInBtn.style.display = 'none'
    signoutBtn.style.display = 'block'
    Array.from(document.querySelectorAll('.after-sign-in')).map(it => it.style = 'display: block;');
    contract.getAllPhone().then(messages => {
      console.log(messages)
      setHTML(messages.reverse())
    });
  }
}

//del
function fn(e){
  console.log(e,'del')
}
function setHTML(arr){
  var html = ''
  console.log("setHTML")
  var list_container = document.getElementById('list_container')
  arr.forEach((el,index)=>{
    html+=`<div class="row">`
    html+=`<div class="list_d">`
    html+=`<div class="text_list">`
    html+=`<p>${index+1}:${el.text} </p>`
    html+=`<p>${el.sender}</p>`
    html+=`</div>`
    html+=`<div class="delBtn" id="del" onclick="fn()"><button id="delbutton" >删除</button></div>`
    html+=`</div>`
    html+=`</div>`
  })
  list_container.innerHTML = html
}

window.nearInitPromise = connect()
  .then(updateUI)
  .catch(console.error);
