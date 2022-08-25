import os
import signal
import sys
from subprocess import Popen
import time
import argparse


def handle_ctrl_c(signal, frame):
    print("Killing all processes...")
    for p in processes:
        print("Killing " + p.args[0])
        p.kill()
    sys.exit(0)


signal.signal(signal.SIGINT, handle_ctrl_c)


parser = argparse.ArgumentParser(description='FIP')

parser.add_argument(
    '--frontend-port',
    metavar='frontend_port',
    type=str,
    help='the port to run the frontend on'
)

parser.add_argument(
    '--backend-port',
    metavar='backend_port',
    type=str,
    help='the port to run the backend on'
)

parser.add_argument(
    '--block-number',
    metavar='block_number',
    type=int,
    help='the block number to fork from'
)

parser.add_argument(
    '--rpc-url',
    metavar='rpc_url',
    type=str,
    help='the url of an ethereum rpc that supports debug_traceCall',
    required=True
)

parser.add_argument(
    '--etherscan-api-key',
    metavar='etherscan_api_key',
    type=str,
    help='an Etherscan API key to get verified contract ABIs',
    required=True
)

args = parser.parse_args()

frontend_port = args.frontend_port or 3000
backend_port = args.backend_port or 9000
block_number = args.block_number or 6500000
rpc_url = args.rpc_url
etherscan_api_key = args.etherscan_api_key

print("Running frontend on port " + str(frontend_port))
print("Running backend on port " + str(backend_port))
print("Forking chain from block " + str(block_number))
print("Using RPC at " + rpc_url)


environment = os.environ.copy()
environment["ANVIL_RPC_URL"] = "http://localhost:8545"
environment["BLOCK_NUMBER"] = str(block_number)
environment["DEBUG_RPC_URL"] = rpc_url
environment["FRONTEND_URL"] = "http://localhost:" + str(frontend_port)
environment["ETHERSCAN_API_KEY"] = etherscan_api_key

processes = [
    Popen([
        sys.executable,
        "-m",
        "flask",
        "--app",
        "../server/app",
        "run",
        "--port=" + str(backend_port),
    ], env=environment),
    Popen([
        sys.executable,
        "-m",
        "http.server",
        "--directory",
        "../frontend/build",
        str(frontend_port),
    ]),
    Popen([
        os.getcwd() + "/../foundry/target/debug/anvil",  # hardcode this for now
        "--fork-url",
        rpc_url,
        "--fork-block-number",
        str(block_number)
    ])
]


# Block and listen for Ctrl+C
while True:
    try:
        time.sleep(1)
    except KeyboardInterrupt:
        handle_ctrl_c()
