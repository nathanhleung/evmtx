from flask import Flask, jsonify, request
from flask_cors import CORS

from web3 import Web3
import os

app = Flask(__name__)
CORS(app, resources={r"/": {"origins": "http://localhost:3000"}})
w3 = Web3(Web3.HTTPProvider('http://127.0.0.1:8545/'))
# w3 = Web3(Web3.HTTPProvider(os.environ['WEB3_PROVIDER']))
trace_result = {}


@app.route("/")
def index():
    return "<p>Hello world</p>"

@app.route("/connected")
def connected():
  response = jsonify({"result": "false"})
  if w3.isConnected():
      response = jsonify({"result": "true"})
  response.headers.add('Access-Control-Allow-Origin', '*')
  return response


@app.route("/sendTxn", methods=['POST'])
def sendTransaction():
    w3.eth.default_account = w3.toChecksumAddress(
        "0x70997970c51812dc3a010c7d01b50e0d17dc79c8")
    calldata = {
        "to": w3.toChecksumAddress(request.form["to"]),
        "from": w3.eth.default_account,
        "value": request.form["value"]
    }
    hexbytes = w3.eth.send_transaction(calldata)
    response = jsonify({
      "hexbytes": hexbytes.hex(),
    })
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route("/sendDump", methods=['POST'])
def sendDump():
    """
    override = 
      balance
      nonce
      code
      state
      stateDiff
    """
    # receive request

    # connect to geth
    w3 = Web3(Web3.HTTPProvider(
        '142.132.152.124:8546'))
    # construct call args, block num or hash, trace config, override
    call_args = request.form["call_args"]
    # get the parent block that we've used
    block_n_hash = os.environ["BLOCK_NUM"]
    config = {
        "stateoverrides": request.form["override"],
        "tracer": request.form["tracer"]
    }
    # send state changes back with debug_traceCall to alchemy

    trace_result = w3.manager.request_blocking(
        "debug_traceCall",
        [call_args, block_n_hash, config],
    )
    response = jsonify({
      "trace": trace_result,
    })
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route("/getTrace", methods=['POST'])
def getTrace():
  return trace_result
