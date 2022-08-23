from flask import Flask, jsonify, redirect, request
from flask_cors import CORS

from web3 import Web3
import web3
import web3.auto.gethdev as GethDev
import os

app = Flask(__name__)
CORS(app, resources={r"/": {"origins": "http://localhost:3000"}})

anvil_rpc_url = os.environ['ANVIL_RPC_URL']
block_number = os.environ["BLOCK_NUMBER"]
debug_rpc_url = os.environ['DEBUG_RPC_URL']
frontend_url = os.environ['FRONTEND_URL']

local_w3 = Web3(Web3.HTTPProvider(anvil_rpc_url))
local_w3.middleware_onion.inject(
    web3.middleware.geth_poa_middleware,
    layer=0
)

debug_w3 = Web3(Web3.HTTPProvider(debug_rpc_url))
debug_w3.middleware_onion.inject(
    web3.middleware.geth_poa_middleware,
    layer=0
)
gas_price = int(debug_w3.eth.get_block(block_number)["baseFeePerGas"])


trace_result = {}


@app.route("/")
def index():
    return redirect(frontend_url)


@app.route("/connected")
def connected():
    response = jsonify({"result": "false"})
    if local_w3.isConnected():
        response = jsonify({"result": "true"})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route("/gasPrice", methods=["POST", "GET"])
def getGasPrice():
    response = jsonify({"gasPrice": gas_price})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route("/sendTxn", methods=['POST'])
def sendTransaction():
    calldata = {
        "to": local_w3.toChecksumAddress(request.form["to"]),
        "from": local_w3.toChecksumAddress(request.form["from"]),
        "value": request.form["value"],
        "data": request.form["data"]
    }
    hexbytes = local_w3.eth.send_transaction(calldata)
    
    stateDiff = local_w3.manager.request_blocking("anvil_dumpStateJson", [])

    
    response = jsonify({
        "hexbytes": hexbytes.hex(),
    })
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


def sendDump():
    """
    override = 
      balance
      nonce
      code
      state
      stateDiff
    pass in:
      block_num 
      call_args
      override
    """
    # get dump
    w3 = Web3(Web3.HTTPProvider('http://127.0.0.1:8545/'))
    dump = w3.manager.request_blocking("anvil_dumpStateJson", [])
    print(dump)
    # connect to geth
    w3 = Web3(Web3.HTTPProvider("http://142.132.152.124:8546"))
    w3.middleware_onion.inject(web3.middleware.geth_poa_middleware, layer=0)
    assert not GethDev.w3.isConnected(), "Not connected"
    # construct call args, block num or hash, trace config, override
    w3.eth.default_account = w3.toChecksumAddress(
        "0x70997970c51812dc3a010c7d01b50e0d17dc79c8")
    # calldata = {
    #     "to": w3.toChecksumAddress(request.form["to"]),
    #     "from": w3.eth.default_account,
    #     "value": request.form["value"]
    # }
    # get the parent block that we've used
    #block_n_hash = os.environ["BLOCK_NUM"]
    #block_n_hash = request.form["block_num"]
    tracer = ""
    with open('tracer.txt') as f:
      tracer = f.readlines()
    config = {
        #"stateoverrides": request.form["override"],
        "tracer": tracer
    }
    #print(tracer)
    ## send state changes back with debug_traceCall to alchemy

    # trace_result = w3.manager.request_blocking(
    #     "debug_traceCall",
    #     [calldata, block_n_hash, config],
    # )
    # response = jsonify({
    #   "trace": trace_result,
    # })
    response = jsonify({
      "trace": "hi"
    })
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route("/getTrace", methods=['POST'])
def getTrace():
    return trace_result
