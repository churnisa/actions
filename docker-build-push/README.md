# Docker Build and Push

This action builds and pushes a Docker image to GitHub Container Registry (or other registries) upon merge to master/main branches. It's designed to be reusable across multiple projects.

## Features

- Automatic build and push to container registry
- Customizable Docker image name and tags
- Support for build arguments
- Multiple tagging strategies (including commit SHA)
- Uses Docker Buildx for optimized builds

## Requirements

- Repository needs `write` permission for the `packages` scope
- GitHub token or Personal Access Token with appropriate permissions

## Usage

```yaml
name: Build and Push Docker Image

on:
  push:
    branches: [ master, main ]

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    
    steps:
      - name: Checkout the repository
        uses: actions/checkout@v4
      
      - name: Build and push Docker image
        uses: churnisa/actions/docker-build-push@master
        with:
          image-name: my-app
```

## Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `image-name` | Name of the Docker image (without registry prefix) | Yes | - |
| `dockerfile-path` | Path to the Dockerfile | No | `./Dockerfile` |
| `build-context` | Docker build context | No | `.` |
| `registry` | Container registry URL | No | `ghcr.io` |
| `registry-username` | Username for registry authentication | No | `${{ github.actor }}` |
| `registry-password` | Password for registry authentication | No | `${{ github.token }}` |
| `tags` | Tags for the Docker image (comma-separated) | No | `latest` |
| `build-args` | Build arguments for Docker build (JSON format) | No | `{}` |


## Advanced Example

See the [examples directory](./examples) for complete workflow examples.


```yaml
name: Build and Push Docker Image

on:
  push:
    branches: [ master, main ]
  pull_request:
    branches: [ master, main ]

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    # Only push on merge to master/main, not on PRs
    permissions:
      contents: read
      packages: write
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Build and push Docker image
        uses: churnisa/actions/docker-build-push@master
        with:
          image-name: my-api-service
          dockerfile-path: './docker/Dockerfile.prod'
          tags: 'latest,stable,${{ github.sha }}'
          build-args: '{"NODE_ENV": "production", "API_VERSION": "1.2.3"}'
```