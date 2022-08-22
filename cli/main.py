import signal
import sys
from subprocess import Popen
import time
import argparse


def handle_ctrl_c():
    print("Killing all processes...")
    map(lambda p: p.kill(), processes)
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

print("Running frontend on port " + str(args.port))
print("Forking chain from block " + str(args.block_number))

processes = [
    Popen([
        sys.executable,
        "-m",
        "flask",
        "--app",
        "../server/app",
        "run",
        "--port=" + str(args.port),
    ]),
    Popen([
        "anvil",
        "--fork-block-number",
        args.blocknumber
    ])
]

while True:
    try:
        time.sleep(1)
    except KeyboardInterrupt:
        handle_ctrl_c()
