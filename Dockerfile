FROM golang:1.18.0-alpine as build
#RUN apk add build-base
RUN apk add git --repository http://mirrors.aliyun.com/alpine/v3.15/main/
RUN apk add libc-dev --repository http://mirrors.aliyun.com/alpine/v3.15/main/
RUN apk add gcc --repository http://mirrors.aliyun.com/alpine/v3.15/main/
ADD . /app
WORKDIR /app
ENV GO111MODULE=on
ENV GOPROXY="https://goproxy.cn,direct"
RUN go mod tidy
RUN go mod download
RUN go build -o server .


FROM alpine

WORKDIR /app
COPY --from=build /app/server /app
COPY ./log4go.xml /app
COPY ./data.db /app
COPY ./html /app/html
LABEL AUTHOR="joinsunsoft"
LABEL LANGUAGE="golang"
LABEL PRODUCT="docker"
LABEL COPYRIGHT="joinsunsoft"
LABEL DECLAIM="All right reserved by joinsunsoft"

RUN  mkdir /lib64 && ln -s /lib/libc.musl-x86_64.so.1 /lib64/ld-linux-x86-64.so.2

EXPOSE 8999

ENTRYPOINT  ["./server"]
