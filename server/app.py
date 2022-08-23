from flask import Flask, jsonify, request, send_from_directory, redirect, url_for
from flask_cors import CORS
from web3 import Web3
import web3
import os

app = Flask(__name__)
CORS(app)
w3 = Web3(Web3.HTTPProvider("http://142.132.152.124:8546"))
w3.middleware_onion.inject(web3.middleware.geth_poa_middleware, layer=0)
trace_result = {}


@app.route("/")
def index():
    """
    Redirects the root / route to the /app route which 
    serves the frontend
    """
    return redirect(url_for('frontend_app', path='index.html'), 301)


@app.route("/app/<path:path>")
def frontend_app(path):
    return send_from_directory('static', path)


@app.route("/connected")
def connected():
    if w3.isConnected():
        return "true"
    else:
        return "false"


@app.route("/sendTxn", methods=['POST'])
def sendTransaction():
    try:
        w3.eth.default_account = w3.toChecksumAddress(
            "0x70997970c51812dc3a010c7d01b50e0d17dc79c8")
        calldata = {
            "to": w3.toChecksumAddress(request.form["to"]),
            "from": w3.toChecksumAddress(request.form["from"]),
            "value": request.form["value"],
            "data": request.form["data"],
            "gasPrice": request.form["gasPrice"],
            "gasLimit": request.form["gasLimit"],
        }
        hexbytes = w3.eth.send_transaction(calldata)
        response = {
            "hexbytes": hexbytes.hex(),
            "status": 200
        }
        return response
    except ValueError as e:
        return e


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
    response = {
        "trace": trace_result,
        "status": 200
    }
    return response


@app.route("/getTrace", methods=['POST'])
def getTrace():
    return trace_result
