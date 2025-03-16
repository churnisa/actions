#!/bin/bash

# This script is included for consistency with other actions, 
# though the actual functionality is implemented via composite steps.
# defined in action.yml

echo "Using Docker Build and Push Action"
echo "Image name: $INPUT_IMAGE_NAME"
echo "Registry: $INPUT_REGISTRY"
echo "Using Dockerfile at: $INPUT_DOCKERFILE_PATH"
