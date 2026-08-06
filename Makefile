.PHONY: dev

BASE_URL ?= http://localhost:1313

dev:
	hugo server --bind 0.0.0.0 --baseURL $(BASE_URL)
