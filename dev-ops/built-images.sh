#!/bin/bash

IMAGE_NAME="dhanasai/teachease"
TAG="latest"

DOCKERFILES=(
    "../app/Dockerfile.prod"
    "../server/Dockerfile.prod"
)

BUILD_CONTEXTS=(
    "../app"
    "../server"
)

for i in "${!DOCKERFILES[@]}"; do
    DOCKERFILE="${DOCKERFILES[$i]}"
    CONTEXT="${BUILD_CONTEXTS[$i]}"
    IMAGE_TAG="$(basename $(dirname $DOCKERFILE))"
    FULL_TAG="$IMAGE_NAME-$IMAGE_TAG:$TAG"

    echo "here is the full tag $FULL_TAG"
    
    echo "Building image for $DOCKERFILE with context $CONTEXT..."
    docker build -t $FULL_TAG -f "$DOCKERFILE" "$CONTEXT"
    
    echo "Tagging the image as 'latest' for $DOCKERFILE"
    docker tag $FULL_TAG "$IMAGE_NAME-$IMAGE_TAG:latest"
    
    echo "Pushing the images to Docker Hub for $DOCKERFILE..."
    docker push "$IMAGE_NAME-$IMAGE_TAG:latest"
    
    echo "Docker images for $DOCKERFILE pushed successfully!"
done
