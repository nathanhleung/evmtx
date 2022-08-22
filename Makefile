.PHONY: frontend server

frontend:
	cd frontend && npm install && npm run build && cp -r build ../server/static

server:
	cd server && python -m flask run