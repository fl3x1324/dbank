import { Tab } from "bootstrap";
import React, { Component } from "react";
import { Tabs } from "react-bootstrap";
import Web3 from "web3";
import dBankA from "../abis/dBank.json";
import TokenA from "../abis/Token.json";
import dbank from "../dbank.png";
import "./App.css";

//h0m3w0rk - add new tab to check accrued interest

class App extends Component {
  async componentDidMount() {
    await this.loadBlockchainData();
  }

  async loadBlockchainData() {
    if (window.ethereum) {
      await window.ethereum.send("eth_requestAccounts");
      const web3 = new Web3(window.ethereum);
      this.setState({ web3 });
      const netId = await web3.eth.net.getId();
      console.log(`Net ID: ${netId}`);
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];
      if (account) {
        this.setState({ account });
      } else {
        window.alert("Please login with MetaMask");
      }
      try {
        const token = new web3.eth.Contract(
          TokenA.abi,
          TokenA.networks[netId].address
        );
        const dBank = new web3.eth.Contract(
          dBankA.abi,
          dBankA.networks[netId].address
        );
        const dBankAddress = dBankA.networks[netId].address;
        this.setState({ dBank, token, dBankAddress });
      } catch (err) {
        console.log(err);
        window.alert("Contracts not deployed to the current network");
      }
    } else {
      alert("Please install MetaMask or any supported web3 extension");
    }
  }

  async deposit(amount) {
    console.log(`To deposit (WEI): ${amount}`);
    if (this.state.dBank) {
      try {
        await this.state.dBank.methods
          .deposit()
          .send({ value: amount.toString(), from: this.state.account });
      } catch (err) {
        console.log(err);
      }
    }
    //in try block call dBank deposit();
  }

  async withdraw(e) {
    e.preventDefault();
    if (this.state.dBank) {
      try {
        await this.state.dBank.methods
          .withdraw()
          .send({ from: this.state.account });
      } catch (err) {
        window.alert(err);
      }
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      web3: null,
      account: "",
      token: null,
      dBank: null,
      balance: 0,
      dBankAddress: null,
    };
  }

  render() {
    return (
      <div className="text-monospace">
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="https://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={dbank} className="App-logo" alt="logo" height="32" />
            <b>dBank</b>
          </a>
        </nav>
        <div className="container-fluid mt-5 text-center">
          <br/>
          <h1>{/*add welcome msg*/}</h1>
          <h2>{/*add user address*/}</h2>
          <br/>
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
                  <Tab className="tabb" eventKey="deposit" title="Deposit">
                    <div>
                      <br />
                      How much would you like to deposit?
                      <br />
                      (min. amount is 0.01ETH)
                      <br />
                      (1 deposit at a time)
                      <br />
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          let amountWei = this.state.web3.utils.toWei(
                            this.depositAmount.value
                          );
                          this.deposit(amountWei).then();
                        }}
                      >
                        <div className="form-group mr-sm-2">
                          <br />
                          <input
                            type="number"
                            id="depositAmount"
                            className="form-control form-control-md"
                            step="0.01"
                            ref={(input) => (this.depositAmount = input)}
                            placeholder="amount..."
                            required
                          />
                        </div>
                        <button type="submit" className="btn btn-primary">
                          DEPOSIT
                        </button>
                      </form>
                    </div>
                  </Tab>
                  <Tab className="tabb" eventKey="withdraw" title="Withdraw">
                    <br/>
                    Do you want to withdraw + take interest?
                    <br/>
                    <br/>
                    <div>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        onClick={(e) => this.withdraw(e)}
                      >
                        WITHDRAW
                      </button>
                    </div>
                  </Tab>
                </Tabs>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
