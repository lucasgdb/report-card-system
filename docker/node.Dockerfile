# Image for the development containers: the Node version from package.json#devEngines plus the
# pnpm version from package.json#packageManager.
FROM node:26.13.0-slim

ARG PNPM_VERSION=12.16.1
RUN npm install --global pnpm@${PNPM_VERSION}

USER node
