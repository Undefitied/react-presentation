#!/bin/bash

NODE_ENV=production EXTERNAL_URL=5.35.242.81 node app.js 2>> error.log 1>> output.log &