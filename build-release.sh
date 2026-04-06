#!/bin/bash

# Automate the building of the APK for the project

# Set the working directory
WORKING_DIR=$(pwd)

# Set the output APK name
OUTPUT_APK="app-release.apk"

# Build the APK
cd $WORKING_DIR/app
./gradlew assembleRelease

# Move the APK to the output directory
mv app/build/outputs/apk/release/app-release.apk $WORKING_DIR/$OUTPUT_APK

echo "APK built and located at: $WORKING_DIR/$OUTPUT_APK"