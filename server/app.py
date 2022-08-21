from flask import Flask, jsonify, request
from web3 import Web3
import os

app = Flask(__name__)
w3 = Web3(Web3.HTTPProvider('http://127.0.0.1:8545/')) 
# w3 = Web3(Web3.HTTPProvider(os.environ['WEB3_PROVIDER']))

@app.route("/")
def index():
  return "<p>Hello world</p>"

@app.route("/connected")
def connected():
  if w3.isConnected():
    return "<p>Connected</p>"
  else:
    return "<p>Not connected</p>"
  

@app.route("/sendTxn", methods=['POST'])
def sendTransaction():
  w3.eth.default_account = w3.toChecksumAddress("0x70997970c51812dc3a010c7d01b50e0d17dc79c8")
  calldata = {
    "to": w3.toChecksumAddress(request.form["to"]),
    "from": w3.eth.default_account,
    "value": request.form["value"]
  }
  hexbytes = w3.eth.send_transaction(calldata)
  response = {
    "hexbytes": hexbytes.hex(),
  }
  return response
