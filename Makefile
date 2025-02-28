.PHONY: run
dev:
	flask run --host=0.0.0.0 --debug	
init_db:
	python3 init_db.py