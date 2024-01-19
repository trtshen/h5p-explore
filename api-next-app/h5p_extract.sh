#!/bin/bash

# Rename .h5p to .zip
mv $1 ${1%.h5p}.zip

# Unzip the file
unzip ${1%.h5p}.zip -d extracted_content

# Copy the required files
cp -r extracted_content/content/ ./content

# Check if "libraries" folder exists
if [ -d "libraries" ]
then
    # Remove the extracted folder
    rm -rf extracted_content
else
    # Rename the extracted folder to "libraries"
    mv extracted_content libraries
fi