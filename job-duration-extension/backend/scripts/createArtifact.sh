#!/bin/bash
(npm run clean:release || :) \
&& echo "starting build" \
&& npm run build:ts \
&& npm run build:buildInfo \
&& echo "copy files for artifact" \
&& npm run copy:buildInfo \
&& npm run copy:config \
&& npm run copy:resources \
&& npm run copy:node_modules \
