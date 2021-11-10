# Audio Recorder for Crowdsourcing

## Environmental setup
- Linux environment
	- Install ffmpeg

- backend
	```
	cd backend
	python3 -m venv venv  # used python3.9.7 for development
	. venv/bin/activate
	pip install fastapi "uvicorn[standard]"
	```

- frontend
	- Install node.js (used node v14.18.0, yarn v1.22.15 for development)
	- Type the following
	```
	cd frontend
	yarn install
	```

## How to start development servers

1. Start the backend server
	```
	cd backend
	. venv/bin/activate
	python main.py
	```

1. Start the frontend server
	```
	cd frontend
	yarn start
	```
