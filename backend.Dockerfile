FROM python:3.11-slim-buster
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y git curl libatomic1 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /backend

COPY backend/requirements.txt requirements.txt
COPY schema.prisma schema.prisma

RUN pip3 install -r requirements.txt
RUN prisma generate

COPY ./backend/src src

WORKDIR /backend/src

CMD [ "gunicorn","-k","uvicorn.workers.UvicornWorker","--bind","0.0.0.0:8081","app:app"]
