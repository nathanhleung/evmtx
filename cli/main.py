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
    '--port',
    metavar='port',
    type=str,
    help='the port to run the frontend on'
)

parser.add_argument(
    '--block-number',
    metavar='block_number',
    type=int,
    help='the block number to fork from'
)

args = parser.parse_args()

port = args.port or 3000
block_number = args.block_number or 1000

print("Running frontend on port " + str(port))
print("Forking chain from block " + str(block_number))

processes = [
    Popen([
        sys.executable,
        "-m",
        "flask",
        "--app",
        "../server/app",
        "run",
        "--port=" + str(port),
    ]),
    Popen([
        "anvil",
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
