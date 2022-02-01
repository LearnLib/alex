# Configuration

On this page, you find information on how to configure ALEX.
Below, the exemplary `docker-compose.production.yml` file is shown.

```yaml
version: '3.7'

services:
  selenium-hub:
    image: selenium/hub:3
  
  # By default, there is one chrome and one firefox browser available

  chrome-node:
    image: selenium/node-chrome-debug:3
    shm_size: '2gb'
    depends_on:
      - selenium-hub
    environment:
      - HUB_HOST=selenium-hub
      - HUB_PORT=4444

  firefox-node:
    image: selenium/node-firefox-debug:3
    shm_size: '2gb'
    depends_on:
      - selenium-hub
    environment:
      - HUB_HOST=selenium-hub
      - HUB_PORT=4444

  # Add more Selenium nodes here that you want to use in ALEX.
  # Ensure that HUB_HOST is set to 'selenium-hub'.
  # Ensure that HUB_PORT is set to '4444'.

  alex-database:
    image: postgres:10
    environment:
      # Set stronger credentials for the database.
      # Leave the POSTGRES_DB variable untouched to 'alex'.
      # Leave the database port untouched to '5432'
      - POSTGRES_HOST_AUTH_METHOD=trust
      - POSTGRES_USER=sa
      - POSTGRES_DB=alex
    volumes:
      - alex-database:/var/lib/postgresql

  alex-frontend:
    image: ghcr.io/learnlib/alex/alex-frontend:unstable
    environment:
      # Update ALEX_BACKEND_ADDRESS to the production URL.
      # Update ALEX_BACKEND_PORT to the production port. 
      - ALEX_BACKEND_ADDRESS=http://localhost
      - ALEX_BACKEND_PORT=8000
    ports:
      # The default port of the frontend is 80.
      - 80:4200

  alex-backend:
    image: ghcr.io/learnlib/alex/alex-backend:unstable
    depends_on:
      - alex-database
      - selenium-hub
    volumes:
      - alex-database:/var/alex/backend/target/postgresql
    environment:
      - REMOTE_DRIVER=http://selenium-hub:4444/wd/hub
    ports:
      # The default port of the backend API is 8000.
      # If you change this value, update the ALEX_BACKEND_PORT 
      # variable in the 'alex-frontend' service.
      - 8000:8000

volumes:
  alex-database:
```

## Docker environment variables

### Backend

The following environment variables can be passed to the **alex-backend** service:

| Name        | Description                                 |
|-------------|---------------------------------------------|
| `GRID_HOST` | The host where the Selenium Grid is running |
| `GRID_PORT` | The port to the Selenium Grid               |

### Frontend

The following environment variables can be passed to the **alex-frontend** service:


| Name                   | Description                                      |
|------------------------|--------------------------------------------------|
| `ALEX_BACKEND_ADDRESS` | The URI to the ALEX API in production            |
| `ALEX_BACKEND_PORT`    | The port of the ALEX API in production           |
