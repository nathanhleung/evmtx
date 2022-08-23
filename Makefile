.PHONY: frontend server cli

frontend:
	cd frontend && \
		npm install && \
		npm run start

server:
	cd server && python -m flask run --port 9000

cli:
	cd cli && python main.py

anvil:
	cd foundry && cargo build
