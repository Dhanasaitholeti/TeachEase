#!/bin/bash

if [[ "$1" == "up" ]]; then
    docker compose -f compose.prod.yml up -d
elif [[ "$1" == "down" ]]; then
    docker compose -f compose.prod.yml down
else
    echo "Usage: $0 {up|down}"
    exit 1
fi
