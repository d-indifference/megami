<p align="center">
   <a href="https://fastpic.org/view/122/2023/0903/e158fd47353b16ea8cafbfc2a95ea50a.png.html" target="_blank">
      <img src="https://i122.fastpic.org/thumb/2023/0903/0a/e158fd47353b16ea8cafbfc2a95ea50a.jpeg" alt="megami logo">
   </a>
</p>

# Megami Imageboard Engine

Megami is a work-in-progress imageboard implementation using Nest.js

In this application, there is currently limited functionality, 
but we have just begun development, and you have every opportunity to 
follow it through to the final release :).

### Planned features
* Advanced capabilities and settings for creating and managing boards through the admin panel.
* Dark theme.
* REST API.
* Capability to attach various types of files.
* Tread catalogs and gallery.

### Planned features in next update
* Backend forms validation.
* Huge text collapsing.
* Rich markdown
* Hidden boards

## What does it contain?
We offer to assemble an imageboard based on multiple Docker containers, 
which will be explained further. 
Additionally, this section will cover the most important dependencies used in the project.

### Docker containers
* `megami-backend` - our main container with application.
* `megami-db` - container with PostgreSQL 13 database.
* `megami-pgadmin` - PgAdmin4 for easier Postgres management.

### Main dependencies
* `nestjs` - our precious backend framework, on which our application is built :).
* `prisma` - ORM for working with Postgres.
* `handlebars` - template engine for rendering pages.
* `bootstrap` - nuff said...
* `sass` - format CSS using better syntax.
* `luxon` - library for formatting dates.

## How to install it?
In this case, you have 2 installation methods, which we will explain further.

### Run the application with Docker

After saving the source code, **don't forget to rename the file `.env.sample` to `.env`.**
(We need to store in the repo file with sample of environment variables for more clarity)

Next run the following commands:

```sh
# If you forgot to rename the .env.sample file :)
$ mv .env.sample .env

# Build a megami application image
$ docker-compose build

# Run compose
$ docker-compose up
```
Then go to [localhost:8000](http://localhost:8000/).
And now you're awesome! Enjoy using the application!

### Classic Node.js installation

If you want to install the application without using Docker, you will need to perform the following set of actions:

1. Install and configure [PostgreSQL](https://www.postgresql.org/) 13. (I won't provide installation and setup instructions for Postgres here; you can find them on your own).
2. Install and configure [Node.js](https://nodejs.org/) 19.1.* (You can find all installation instructions on your own).
3. Additionally, if you wish, you can independently find and install any PostgreSQL client of your choice, such as PgAdmin or DBeaver.
4. Run `mv .env.sample .env` for creating a `.env` file
5. If you need, you can edit `.env` file and set here your own settings, such as DB connection, etc. The description of the environment variables used will be provided in the section below.
6. After all installations, please run the following commands:
    ```sh
    # Install dependencies
    $ npm i
   
    # Run Prisma migrations
    $ npx prisma migrate dev
   
    # Fill the database with pre-prepared topics (if desired)
    $ ts-node ./prisma/seed.ts
   
    # Run the application
    $ npm run start:dev
    ```
7. Then go to [localhost:3000](http://localhost:3000/). And enjoy using the application!

### Oops, I have some errors in the console :(
After running the application in Docker, there may be errors on first run related to permission issues in the `megami-pgadmin` container files.

This is done with the following commands:

```sh
$ docker exec -it -u root megami-pgadmin sh

$ chown -R pgadmin:pgadmin /var/lib/pgadmin

$ exit
```

## Project environment variables
* `MEGAMI_INTERNAL_PORT` - internal port for `megami-backend` docker container or main port of your application if you will run it without Docker.
* `MEGAMI_EXTTERNAL_PORT` - external port for `megami-backend` docker container. If you run the app by Docker, you should go to this port to start your application.
* `MEGAMI_VOLUMES_DIR` - directory name for Postgres and PgAdmin volumes if you run the app by Docker.
* `MEGAMI_APP_VOLUME` - application volume path for Docker.
* `MEGAMI_POSTGRES_VOLUME` - path to Postgres volume.
* `MEGAMI_PGADMIN_VOLUME` - path to PgAdmin volume.
* `MEGAMI_ASSETS_PUBLIC_DIR` - path to directory with public assets (CSS, JS, static images, etc.).
* `MEGAMI_ASSETS_VIEWS_DIR` - path to directory with handlebars views.
* `MEGAMI_FILES_DIR` - name of directory, where application stores uploaded files
* `MEGAMI_SKIP_DB_MIGRATION` - set it `true` if you want to skip database migration during application starting.
* `MEGAMI_SESSION_SECRET` - session secret key.
* `MEGAMI_PRIVATE_KEY` - secret key for passwords.
* `MEGAMI_ROOT_USER_EMAIL` - root user email for admin user created by default at first time.
* `MEGAMI_ROOT_USER_PASSWORD` - root user password for admin user created by default at first time.
* `MEGAMI_SKIP_ROOT_USER_CREATION` - set it `true` if you want to skip root user creation during application starting.
* `MEGAMI_SQL_CONSOLE_PASSWORD` - SQL console password. Without it you cannot use SQL console.
* `POSTGRES_HOST` - Postgres host.
* `POSTGRES_PORT` - Postgres port.
* `POSTGRES_USER` - Postgres username.
* `POSTGRES_PASSWORD` - Postgres password.
* `POSTGRES_DB` - Postgres database name.
* `PGDATA` - path to data which is stored in volume for `megami-db` container.
* `PGADMIN_DEFAULT_EMAIL` - default email for access to PgAdmin.
* `PGADMIN_DEFAULT_PASSWORD` - default password for access to PgAdmin.
* `PGADMIN_DATA` - path to data which is stored in volume for `megami-pgadmin` container.
* `PGADMIN_EXTERNAL_PORT` - external port if you run PgAdmin in docker container, go to this port.
* `DATABASE_URL` - Prisma connection string.

You can read more about Postgres and PgAdmin environment variables here:
* https://hub.docker.com/_/postgres - PostgreSQL.
* https://registry.hub.docker.com/r/dpage/pgadmin4 - PgAdmin 4.

## License
<a href="https://github.com/d-indifference/megami/blob/master/LICENSE">GPLV2 License</a>

Because we believe that open source is important.
