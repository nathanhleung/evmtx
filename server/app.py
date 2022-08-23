from flask import Flask, jsonify, redirect, request
from flask_cors import CORS

from web3 import Web3
import web3
import os

app = Flask(__name__)
CORS(app, resources={r"/": {"origins": "http://localhost:3000"}})

anvil_rpc_url = os.environ['ANVIL_RPC_URL']
block_number = os.environ["BLOCK_NUMBER"]
debug_rpc_url = os.environ['DEBUG_RPC_URL']
frontend_url = os.environ['FRONTEND_URL']

local_w3 = Web3(Web3.HTTPProvider(anvil_rpc_url))
debug_w3 = Web3(Web3.HTTPProvider(debug_rpc_url))
debug_w3.middleware_onion.inject(
    web3.middleware.geth_poa_middleware,
    layer=0
)
gas_price = int(debug_w3.eth.get_block(block_number)["baseFeePerGas"])


trace_result = {}


@app.route("/")
def index():
    return redirect(frontend_url, code=301)


@app.route("/connected")
def connected():
    response = jsonify({"result": "false"})
    if local_w3.isConnected():
        response = jsonify({"result": "true"})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route("/gasPrirce", methods=["POST", "GET"])
def getGasPrice():
    response = jsonify({"gasPrice": gas_price})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route("/sendTxn", methods=['POST'])
def sendTransaction():
    local_w3.eth.default_account = local_w3.toChecksumAddress(
        "0x70997970c51812dc3a010c7d01b50e0d17dc79c8")
    calldata = {
        "to": local_w3.toChecksumAddress(request.form["to"]),
        "from": local_w3.eth.default_account,
        "value": request.form["value"]
    }
    hexbytes = local_w3.eth.send_transaction(calldata)
    response = jsonify({
        "hexbytes": hexbytes.hex(),
    })
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route("/sendDump", methods=['POST', 'GET'])
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

    # construct call args, block num or hash, trace config, override
    # call_args = request.form["call_args"]
    # # get the parent block that we've used
    # block_n_hash = os.environ["BLOCK_NUM"]
    # config = {
    #     "stateoverrides": request.form["override"],
    #     "tracer": request.form["tracer"]
    # }
    # # send state changes back with debug_traceCall to alchemy

    # trace_result = w3.manager.request_blocking(
    #     "debug_traceCall",
    #     [call_args, block_n_hash, config],
    # )
    # response = jsonify({
    #   "trace": trace_result,
    # })
    assert local_w3.isConnected(), "Not connected"
    response = jsonify({"result": "false"})
    if local_w3.isConnected():
        response = jsonify({"result": "true",
                            })
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route("/getTrace", methods=['POST'])
def getTrace():
    return trace_result
