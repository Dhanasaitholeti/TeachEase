# Command Sheet for ./start.sh Script

## Description

This script is used to start the application and perform necessary setup tasks.

## Usage

### Format

```
./start.sh <environment> <action> <component>
```

### Parameters

- `<environment>`: The environment to deploy to. Options are `dev`, `test`, or `prod`.
- `<action>`: The action to perform. Options are `up` or `down`.
- `<component>`: The component to manage. Options are `app` or `server`.

### Examples

- Start the application in development environment:
  ```
  ./start.sh dev up app
  ```
- Start the server in development environment:

  ```
  ./start.sh dev up server
  ```

- Stop the app in production environment:

  ```
  ./start.sh prod down app
  ```

- Stop the server in production environment:

  ```
  ./start.sh prod down server
  ```

- Start the server in test environment:
  ```
  ./start.sh test up server
  ```
- Stop the application in development environment and clean up resources:
  ```
  ./start.sh dev down app clean
  ```

### Notes

- The `clean` option can be added to the `down` action to remove images, volumes, and orphan containers.
- Ensure Docker is installed and running before executing the script.
