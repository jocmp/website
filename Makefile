.PHONY: dev deploy

SITE_URL ?= https://jocmp-website.jocmp64.workers.dev

dev:
	npm run dev -- --host 0.0.0.0

deploy:
	EMDASH_SITE_URL=$(SITE_URL) npm run deploy
