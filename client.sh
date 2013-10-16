#!/bin/bash
ip=$(ifconfig | sed -En 's/127.0.0.1//;s/.*inet (addr:)?(([0-9]*\.){3}[0-9]*).*/\2/p' | head -n 1)
curl -fsm 30 "http://registry.ladekjaer.org/push?ip=$ip&hostname=$(hostname)"
