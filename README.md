# Online Geometry Viewer
[![Build Status](https://travis-ci.org/sniok/OGV-meteor.svg?branch=eslint)](https://travis-ci.org/sniok/OGV-meteor)
[![IRC](https://img.shields.io/badge/chat-on%20irc%20channel-green.svg)](http://webchat.freenode.net/?channels=#brlcad)
[![IRC](https://img.shields.io/badge/join-mailing%20list-green.svg)](https://lists.sourceforge.net/lists/listinfo/brlcad-devel)

Online Geometry Viewer is an online web application, where users can upload, view
and share 3D CAD models. They can also host these models online, can like (love)
or comment on them. In a nutshell it can be looked at as a social blogging
platform for 3D models.

## Contribution Guidelines
TL;DR
We love contributions, if you want to contribute make sure you are on development branch to see the latest code. To prevent any duplicate work, please communicate if you are working on something.

The best (but not the only) way to contribute is
* Check if the issue you are trying to solve is already reported. (search the issue tracker)
* If it is already created, comment with your willingness to work on it.
* If it is not created, please create a new one. In any case try to inform about what you are working on.
* Make sure you are on latest code (`development` branch)
* Make sure when you make a Pull request, it is to the development branch.
* [optional] Assign a reviewer from one of the contributors, specially if you are new and have been talking to existing contributors.
* Never merge your own pull requests.
* Always check the "files changed" tab for any surprises.
* Be polite and nice.


## Install

Clone this repo

```sh
git clone https://github.com/BRL-CAD/OGV-meteor.git
```

### Debian and Ubuntu based Linux distributions
#### Using install script
```sh
./scripts/ubuntu_install.sh
```
You will be asked for sudo access twice (for node and mongo)

#### Manually
* Install Nodejs :

  * sudo apt-get install python-software-properties python g++ make
  * sudo add-apt-repository ppa:chris-lea/node.js
  * sudo apt-get update
  * sudo apt-get install nodejs

* Install mongoDB

  * sudo apt-get install mongodb

* Install Meteor

  * sudo apt-get install curl
  * curl https://install.meteor.com/ | sh

* Clone the OGV Repository

  * sudo apt-get install git
  * git clone https://github.com/BRL-CAD/OGV-meteor

### Mac based distributions

* Install brew by following the instructions [here](https://docs.brew.sh/Installation)

* Install Nodejs

  * brew install node

* Install mongoDB

    * brew tap mongodb/brew
    * brew install mongodb-community

* Install Meteor

  * brew install curl
  * curl https://install.meteor.com/ | sh

* Clone the OGV Repository

  * brew install git
  * git clone https://github.com/BRL-CAD/OGV-meteor

## Run
Move config.example.json to config.json and write admin password there.

To run app while developing use:
```
npm run start
```
Then open Browser and type in URL
```
http://localhost:3000
```

## Lint
To run ESlint check run
```
meteor npm run lint
```

## Build and deploy
### Ubuntu and macOS
To build OGV run build script
```
./scripts/build.sh
```
To start OGV run
```
../OGV-build/bundle/start.sh
```
App will be running at http://localhost:3000
