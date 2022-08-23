# FIP

Trace Ethereum transactions with Foundry

https://docs.google.com/document/d/1-w4HLSqg33S1ddFUrqK8TfzONr_gYvMFLGu2tBQc7Iw/edit

## Getting Started

### Running

1. Run `make frontend-build` to build the frontend static site
1. Run `git submodule update --init --recursive` to download our fork of Foundry
1. Run `pip install -r requirements.txt` to install Python dependencies
1. Run `make anvil` to build our fork of Foundry
1. Run `make cli` to run the app

### Development

- `make frontend` - run frontend development server
- `make frontend-build` - build frontend static site
- `make server` - run Flask server
- `make anvil` - build Foundry fork
- `make cli` - run CLI

### Troubleshooting

- Make sure you have a recent version of Rust installed (tested on Rust v1.63.0)
- Make sure you have a recent version of Node/NPM installed (tested on Node v16.14.0, NPM v8.3.1)

## Components

### CLI

The CLI is the main entry point to the program.

`python cli/main.py --port XXXX --block-number YYYY`

### Frontend

Allows users to view traces

### Server

The CLI runs the server. The server serves the frontend.

### Foundry

Run `git submodule update --init --recursive` to download our fork of Foundry (specifically, Anvil), then `make anvil` to compile it
