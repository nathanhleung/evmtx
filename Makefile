.PHONY: frontend frontend-build server cli anvil all

frontend:
	cd frontend && \
		npm run start

frontend-build:
	cd frontend && \
		npm install && \
		npm run build
		
server:
	cd server && python3 -m flask run --port 9000

cli:
	cd cli && python3 main.py --rpc-url http://142.132.152.124:8546

anvil:
	git submodule update --remote --merge && \
		cd foundry && cargo build

all: frontend-build anvil
	pip install -r requirements.txt && \
		make cli