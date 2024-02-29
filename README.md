# H5P content upload and serving

## Running nextjs app locally
1. Run the web with *npm run dev*
2. in the index page of the app, upload a h5p file (there is no error handling for file upload, make sure you upload correct file generated from [Lumi App](https://app.lumi.education/#download)

### Accessing the API
1. Once the next server is running locally, you can start using the local API for accessing the successfully uploaded H5P content
2. You'll know the API from directory `./src/pages/api`. For example link format: `localhost:8080/api/file?filename=sample` 

## Development
1. *cd api-next-app* from project root directory
2. *npm run dev* to start local server
3. run *docker-compose up -d* in _docker-env_ folder to start mongodb
4. make sure *.env* has proper value inserted (required for file storage server: AWS)  

## Directory & prerequisites
1. api-next-app - the frontend & the backend (upload file from /home)
2. mongodb (use MongoDB Compass for GUI access)

### Progress:
- extract assets & config: `api-next-app/h5p_extract.sh`
- file upload & handling: `formidable`
- API to list uploaded H5P: `/api/h5p`
