# Demo for Docker Swarm Cluster

## Prerequisites

-   Linux Distros with Docker
    -   [Debian](https://deb.debian.org/debian/dists/bookworm/main/installer-amd64/current/images/)
    -   [Docker](https://www.docker.com/)

## Run

**Please modify SERVER_URL first in [docker-compose.yaml](docker-compose.yaml)**

```bash
docker stack deploy -c docker-compose.yaml my-custer
```

## API Docs

[http://localhost:3000/doc](http://localhost:3000/doc)

## License

MIT
