#!/bin/bash

clean=""
if [[ $3 = "clean" ]]; then
    clean="--rmi all --volumes --remove-orphans"
fi

appOrServer="server"
if [[ $3 = "app" ]]; then
    appOrServer="app"
fi

if [[ $1 = "prod" || $1 = "dev" || $1 = "test" ]] && [[ $2 = "down" || $2 = "up" ]]; then
    fileEnv="compose.${1}.${appOrServer}.yml"
    downOrUp=$2

    if [[ $downOrUp = "down" ]]; then
        echo "Running docker-compose -f $fileEnv down"
        docker compose -f $fileEnv down $clean
    else
        echo "Running docker-compose -f $fileEnv $downOrUp -d"
        docker compose -f $fileEnv $downOrUp -d
    fi
else
    echo "Need to follow format: ./deploy.sh dev|test|prod down|up (app|server)?"
fi
