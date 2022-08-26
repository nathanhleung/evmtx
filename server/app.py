import sys
from flask import Flask, jsonify, redirect, request, Response, abort
from flask_cors import CORS
from hexbytes import HexBytes
from web3 import Web3
import web3
import requests
import os
from util import tx_formatter, decode_function_data
from web3._utils.method_formatters import to_hex_if_integer
import json

app = Flask(__name__)
CORS(app)

anvil_rpc_url = os.environ['ANVIL_RPC_URL']
block_number = os.environ["BLOCK_NUMBER"]
debug_rpc_url = os.environ['DEBUG_RPC_URL']
os.environ['ETHERSCAN_API_KEY'] = "EJ3GF1MIGIS615UFJCPKBEIWNGY8W5CQTI"
etherscan_api_key = os.environ['ETHERSCAN_API_KEY']
frontend_url = os.environ['FRONTEND_URL']

if anvil_rpc_url is None:
    print("Please provide the ANVIL_RPC_URL environment variable!")
    sys.exit(1)

if block_number is None:
    print("Please provide the BLOCK_NUMBER environment variable!")
    sys.exit(1)

if debug_rpc_url is None:
    print("Please provide the DEBUG_RPC_URL environment variable!")
    sys.exit(1)

if etherscan_api_key is None:
    print("Please provide the ETHERSCAN_API_KEY environment variable!")
    sys.exit(1)

if frontend_url is None:
    print("Please provide the FRONTEND_URL environment variable!")
    sys.exit(1)

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

counter = 0


tx_data = {}
trace_result = {}
tx_hash = {}


@app.route("/")
def index():
    return redirect(frontend_url)


@app.route("/connection/local")
def local_connection():
    response = jsonify({"result": "false"})
    if local_w3.isConnected():
        response = jsonify({"result": "true"})
    return response


@app.route("/connection/remote")
def remote_connection():
    response = jsonify({"result": "false"})
    if debug_w3.isConnected():
        response = jsonify({"result": "true"})
    return response


@app.route("/gas-price", methods=["POST", "GET"])
def getGasPrice():
    response = jsonify({"gasPrice": gas_price})
    return response


@app.route("/transactions", methods=['GET'])
def allTransactions():
    return jsonify(tx_data)


@app.route("/transactions/new", methods=['POST'])
def sendTransaction():
    global counter
    try:
        calldata = tx_formatter({
            "to": local_w3.toChecksumAddress(request.form["to"]),
            "from": local_w3.toChecksumAddress(request.form["from"]),
            "value": int(request.form["value"]),
            "data": request.form["data"],
            "gasPrice": int(float(request.form["gasPrice"]) * 10e9) or gas_price * 10e9
        })
    except Exception as e:
        print(e)
        # 400 because this should only fail if the input is bad
        return repr(e), 400
    try:
        hash = local_w3.manager.request_blocking(
            "eth_sendUnsignedTransaction", [calldata])
        traceResults = sendDump(calldata, int(os.getenv("BLOCK_NUMBER")))
    except Exception as e:
        print(e)
        # 500 because this probably indicates a problem with Anvil
        return repr(e), 500

    trace_result[counter] = traceResults
    tx_data[counter] = calldata
    tx_hash[counter] = hash
    response = jsonify({
        "txHash": hash,
        "traceResults": Web3.toJSON(traceResults),
        "txData": Web3.toJSON(tx_data),
        "txIndex": counter
    })
    counter += 1

    return response


def trace_format(trace, identation_level=0):
    result = {
        "from": trace["from"],
        "to": trace["to"],
        "identation": identation_level,
        "status": False if "error" in trace else False
    }
    try:
        decoded_calldata = decode_function_data(HexBytes(trace["input"]))
        result["functionName"] = decoded_calldata[0]
        result["functionArgs"] = decoded_calldata[1]
        result["functionArgs"] = [str(arg) for arg in result["functionArgs"]]
        result["calldata"] = trace["input"]
    except ValueError:
        result["calldata"] = trace["input"]
    if "calls" in trace:
        result["subcalls"] = []
        for subtrace in trace["calls"]:
            result["subcalls"].append(
                trace_format(subtrace, identation_level + 1))
    return result


@app.route("/transactions/<transaction_id>", methods=["GET"])
# Gets the trace of the given transaction
def getTransaction(transaction_id):
    txId = int(transaction_id)
    if txId not in trace_result:
        return abort(404)

    trace = trace_result[txId]
    formatted_traces = trace_format(trace)
    response = jsonify({"results": Web3.toJSON(formatted_traces)})
    print(formatted_traces)
    return response


@app.route("/raw-transactions/<transaction_hash>", methods=["GET"])
# Gets raw transaction data for a given transaction
def getRawTransaction(transaction_hash):
    try:
        transaction = local_w3.eth.getTransaction(transaction_hash)
    except web3.exceptions.TransactionNotFound:
        return abort(404)
    return Response(Web3.toJSON(transaction), mimetype="application/json")


def sendDump(txData, block):
    dump = json.loads(local_w3.manager.request_blocking(
        "anvil_dumpStateJson", []))["accounts"]
    for addr, state in dump.items():
        state["nonce"] = to_hex_if_integer(state["nonce"])
        dump[addr] = state
    trace_result = debug_w3.manager.request_blocking(
        "debug_traceCall",
        [txData, to_hex_if_integer(block), {
            "stateOverrides": dump,
            "tracer": "callTracer"
        }])
    return trace_result


@app.route("/contracts/<contract_address>", methods=['GET'])
def getContractAbi(contract_address):
    print(etherscan_api_key)
    r = requests.get(url='https://api.etherscan.io/api' +
                     '?module=contract&action=getabi' +
                     '&address=' + contract_address +
                     '&apikey=' + etherscan_api_key)
    return json.loads(r.text)["result"]
