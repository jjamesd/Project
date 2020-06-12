
import { JsonRpc, Api } from "eosjs";
import ScatterJS from "@scatterjs/core";
import ScatterEOS from "scatterjs-plugin-eosjs2";
import axios from "axios";

const BALANCE_URL = "http://localhost:8181/balance/";
const APP_NAME = "MY_APP";

const network = ScatterJS.Network.fromJson({
  blockchain: "eos",
  chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
  host: "eos.greymass.com",
  port: 443,
  protocol: "https"
});

const transfer = (quantity, currentAccount, auth) => {
  return {
    account: "eosio.token",
    name: "transfer",
    authorization: [
      {
        actor: currentAccount.name,
        permission: auth
      }
    ],
    data: {
      from: currentAccount.name,
      to: 'mytestacc',
      quantity,
      memo: 'Paying for service'
    }
  };
};

async function main() {
  window.payFunds = payFunds;
  window.login = login;
  window.logout = logout;
  window.logoutBtn = logoutBtn;
  window.loginPage = loginPage;
  window.payPage = payPage;
  ScatterJS.plugins(new ScatterEOS());
}

async function logoutBtn() {
  await logout();
  window.location.href = `./index.html`;
}

async function payPage() {
  if (window.currentAccount == null) {
    await login();
  }

  document.getElementById("message").innerHTML = "";

  try {
    const balance = (await axios.get(BALANCE_URL + window.currentAccount.name))
      .data[0];
      document.getElementById('balance').innerHTML = balance;
  } catch (error) {}
  document.getElementById("userField").innerHTML = window.currentAccount.name;

  document.getElementById("logoutBtn").style.display = "block";
  document.getElementById("payBtn").style.display = "block";
}

async function loginPage() {
  await login();
  if (!window.currentAccount) {
    return;
  }
  document.getElementById("payPage").style.display = "block";
  document.getElementById("loginPage").style.display = "none";
  payPage();
}

async function payFunds() {
  if (window.currentAccount == null) {
    await login();
  }
  if (window.currentAccount == null) {
    alert("Open and unlock scatter fisrt");
    logout();
    return;
  }
  const rpc = new JsonRpc(network.fullhost());
  const eos = ScatterJS.eos(network, Api, { rpc, beta3: true });

  const amount = "0.01";
    let actions = [
    transfer(amount, window.currentAccount, window.currentAccount.authority),
  ];

  await eos.transact(
      {
        actions
      },
      {
        blocksBehind: 3,
        expireSeconds: 160
      }
    );
}


async function login() {
  try {
    const connected = await ScatterJS.connect(APP_NAME, { network });
    const result = await ScatterJS.scatter.getIdentity({ accounts: [network] });
    window.currentAccount = result.accounts[0];
  } catch (e) {
    alert("Please make sure Scatter is open and unlocked");
  }
}

async function logout() {
  window.currentAccount = null;
  try {
    ScatterJS.scatter.forgetIdentity();
  } catch (error) {}
}

main();
