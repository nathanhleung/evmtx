import sys
from subprocess import Popen
import argparse

parser = argparse.ArgumentParser(description='FIP')

parser.add_argument(
	'Port',
	metavar='port',
	type=str,
	help='the port to run the frontend on'
)

processes = [
	Popen([
		sys.executable,
		"-m",
		"flask",
		"--app",
		"../server/app",
		"run"
	]),
	Popen([
		"anvil",
	])
]
