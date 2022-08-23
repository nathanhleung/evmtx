.PHONY: frontend server cli

frontend:
	cd frontend && \
		npm install && \
		npm run build && \
		rm -rf ../server/static && \
		cp -r build ../server/static

server:
	cd server && python -m flask run --port 9000

cli:
	cd cli && python main.py