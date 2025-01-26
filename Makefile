.PHONY: run
flask:
	flask --app flaskr run -h 0.0.0.0 --debug --reload

db_init:	
	flask --app flaskr init-db

start:
	docker compose up -d 

stop:
	docker compose down 

update:
	docker compose down 
	docker compose pull
	docker compose up -d --build

restart: 
	docker compose restart

remove:
	docker compose down -v
	docker compose rm -f
