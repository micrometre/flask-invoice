## A Flask REST API With Pdf invoice generator
### This repository implements a simple REST API using the Flask microframework.



#### To  run the app in docker
- Install Docker and Docker Compose .
    - [*Follow the official instruction*](https://docs.docker.com/engine/install/ubuntu/)
- Clone the repo

```shell
git clone  https://github.com/micrometre/flask-restgit
cd flask-restgit
docker compose up -d 
```





#### To  run the app in python virtual environment
1. Create a virtual environment:

```shell
python3 -m venv .venv 
#to create one named .venv.
```
2. Activate the virtual environment using 
```shell
. .venv/bin/activate.
```

3. Install the project in editable mode 
```shell
pip install -e . 
#This allows you to make changes to the code and test them without reinstalling.
```
#### Usage

1. Initialize the database:

```shell
flask --app flaskr init-db 
```

- Start the development server 
```shell
flask --app flaskr run --debug. 
```
*This will enable debugging features and make the API accessible at http://127.0.0.1:5000 in your browser.*
