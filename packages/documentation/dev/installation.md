---
title: Installation
---

# Installation of the development stack

## Requirements

### Docker

::: tip
Some developpers don't want to spend too much time in learning docker commands. [Portainer](https://www.portainer.io/) offers a great user interface to manage Docker.
:::

### Development dependencies

The docker compose files are automatically generated at every `git commit`. The script requires the package merge-yaml-cli to be installed.

```sh
npm i -g merge-yaml-cli
```

[Envsubst](https://www.gnu.org/software/gettext/manual/html_node/envsubst-Invocation.html) is also used in the script to start the services in development mode.
In Mac OSX, you can install it with brew:

```sh
brew install gettext
```

::: tip
It is recommended to install the [Hasura CLI](https://docs.hasura.io/1.0/graphql/manual/hasura-cli/install-hasura-cli.html).
:::

### VS Code

The recommended IDE is the excellent [VSCode](https://code.visualstudio.com). Once you'll have cloned the initial repository, it will probably suggest you to install the recommended extensions:

- Postgres
- Debugger for Chrome
- Docker
- Vetur
- Better comments
- Bracket Pair Colorizer
- Apollo
- prettier
- eslint

If you like dark themes to give your eyes some rest, you could try [Dracula](https://marketplace.visualstudio.com/items?itemName=dracula-theme.theme-dracula).

### Chrome DevTools extensions

Chrome extensions: Vue, Apollo

### Bit?

brew install bit

## Installation

### Clone the repository

```sh
git clone https://github.com/platyplus/platyplus.git
```

### Generate keys and secrets

### Update the /etc/hosts file

## Starting the stack

## Create an user
