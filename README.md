# toss-register
Monorepo for the registering platform of the TOSS
 
## Getting started - frontend team
> If you are working on the backend, jump to the [Getting started - backend team](#getting-started---backend-team) section.
 
### Copy the env file
You will need to copy the `.env.example` file to a new `.env`. You do not have to change the `DATABASE_USER` and `DATABASE_PASSWORD`, but you can if you want to. If you do, do not forget to change the `DATABASE_URL` to match the new values (but do not change anything else !).
 
### Install Docker
If you don't have it, install docker on your machine. You can find the installation instructions [here](https://docs.docker.com/get-docker/).
 
### Launch the database, backend and db studio
Just run `docker-compose up` in the root of the project!
 
This will start
- a postgres database at port 5432
- the backend at port 8081
- the db studio at port 5555.
- a container to run the migrations. It will exit after running the migrations.
 
### Access the database
You can now visit the [db studio](http://localhost:5555) to view the database, and view or modify its contents.
 
### See and test the API routes
The swagger documentation can be found at [http://localhost:8081/docs](http://localhost:8081/docs) when the backend is running.
 
### Frontend
The frontend is a react app, its code is in the [frontend](frontend) folder.
 
#### Installing and running
 
Go into the frontend folder using `cd frontend`
 
Install the requirements using `pnpm install` or `npm install`(slower)
 
You can now execute the project using: `pnpm run dev` or `npm run dev`(slower)
 
## Getting started - backend team
### Copy the env file
You will need to copy the `.env.example` file to a new `.env`. You do not have to change the `DATABASE_USER` and `DATABASE_PASSWORD`, but you can if you want to. If you do, do not forget to change the `DATABASE_URL` to match the new values (but do not change anything else !).
 
> Notice that the IP used in the `DATABASE_URL` env variable is `127.0.0.1` and not `10.0.0.4`. This ensures the backend can connect to the database when running in your machine instead of in the network of containers, where the IP of the database is `10.0.0.4`. Ask @hugoleborso if you want to know more about this!
 
### Database
 
Setup the database by running `docker-compose up --build db` or `docker compose up --build db prisma-studio` in the root of the project.
This will start the postgres database at port 5432, and the prisma studio at port 5555 too if you used the second command.
 
The database will be initialized with the tables specified in the `schema.prisma` file. You will need another terminal to run the backend and frontend.
 
To run migrations, use `docker-compose up prisma-migrate` in the root of the project. This will generate a container to run the migrations. It will exit after running the migrations.
 
Make sure to be in the toss-register folder when running `prisma generate`, not in the backend folder.
 
#### Troubleshooting
You might need to use sudo to run docker-compose.
If you see an error like docker daemon not running, you can start it using `sudo systemctl start docker`, or launch the docker desktop application.
 
If you still have issues with the database, you can try to stop and remove all containers using `docker-compose down`, delete the associated volumes in Docker Desktop and then start them again.
> ⚠️ Deleting the volumes will delete all the data in your local database, so be careful.
 
### Backend
 
#### Installing and running
 
Create a virtual environment using `python3.11 -m venv toss-register-env` (`python -3.11 -m venv toss-register-env` on Windows I believe)
(You might be able to use any python3.11 version, but 3.11.5 is the one used in development)
 
On mac and linux, run `source toss-register-env/bin/activate` to activate the environnemnt.
On windows, run `.\toss-register-env\Scripts\activate` to activate the environnemnt.
 
Go into the backend folder using `cd backend`
 
Install the requirements using `pip install -r requirements.txt`
 
After you installed all the requirements and started all the services, you can now execute the project using: `python3 src` using python3 or simply `python src` depending on your installation.
 
#### Swagger
The swagger documentation can be found at [http://localhost:8081/docs](http://localhost:8081/docs) when the backend is running.
 
### Frontend
The frontend is a react app, its code is in the [frontend](frontend) folder.
You will need to copy the `.env.example` file to `.env` and fill in the values, as you want them.
 
#### Installing and running
 
Go into the frontend folder using `cd frontend`
 
Install the requirements using `pnpm install` or `npm install`(slower)
 
You can now execute the project using: `pnpm run dev` or `npm run dev`(slower)