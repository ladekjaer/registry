#!/bin/bash
ip=$(ifconfig | sed -En 's/127.0.0.1//;s/.*inet (addr:)?(([0-9]*\.){3}[0-9]*).*/\2/p')
curl -fs "http://localhost:8080/push?ip=$ip&hostname=$(hostname)"
