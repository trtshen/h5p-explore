# H5P content upload and serving

## Development
1. *cd api-next-app* from project root directory
1. *npm run dev* to start local server
1. run *docker-compose up -d* in _docker-env_ folder to start mongodb

## Directory & prerequisites
1. api-next-app - the frontend & the backend (upload file from /home)
2. mongodb (use MongoDB Compass for GUI access)

### Progress:
- extract assets & config: `api-next-app/h5p_extract.sh`
- file upload & handling: `formidable`
- API to list uploaded H5P: `/api/h5p`
