#!/bin/bash

# Extract the base filename without the extension
baseName=$(basename "$1" .h5p)

echo "Extracting H5P file:" $1
# Rename .h5p to .zip
mv $1 ./uploads/${baseName}.zip

# Unzip the file
unzip ./uploads/${baseName}.zip -d ./uploads/${baseName}_extracted

# Copy the required files
mkdir -p ./uploads/${baseName}/
cp -r ./uploads/${baseName}_extracted/content/* ./uploads/${baseName}/

# Check if "libraries" folder exists
if [ -d "libraries" ]
then
    # Remove the extracted folder
    rm -rf ./uploads/${baseName}_extracted
else
    # Rename the extracted folder to "libraries"
    mv ./uploads/${baseName}_extracted libraries
fi

# Remove the zip file
rm ./uploads/${baseName}.zip

# Remove the "content" folder
# rm -rf ./uploads/"${baseName}"
