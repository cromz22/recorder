#!/bin/bash

# Execute this script in the recorder/backend directory.

mkdir audio
cd audio
for ow in orig wav; do
	mkdir -p ${ow}/train ${ow}/dev ${ow}/test
done
