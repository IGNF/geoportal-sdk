#!/bin/bash

# On crée les dossiers utiles s'ils n'existent pas
if [ ! -d /home/docker/html/geoportal-sdk/dist ]
then
    mkdir -p /home/docker/html/geoportal-sdk/dist
else 
    rm -rf /home/docker/html/geoportal-sdk/dist/*
fi
if [ ! -d /home/docker/html/geoportal-sdk/samples ]
then
    mkdir -p /home/docker/html/geoportal-sdk/samples
else 
    rm -rf /home/docker/html/geoportal-sdk/samples/*
fi
if [ ! -d /home/docker/html/geoportal-sdk/jsdoc ]
then
    mkdir -p /home/docker/html/geoportal-sdk/jsdoc
else 
    rm -rf /home/docker/html/geoportal-sdk/jsdoc/*
fi
if [ ! -d /home/docker/html/geoportal-sdk/package ]
then
    mkdir -p /home/docker/html/geoportal-sdk/package
else 
    rm -rf /home/docker/html/geoportal-sdk/package/*
fi
if [ ! -d /home/docker/html/geoportal-sdk/node_modules ]
then
    mkdir -p /home/docker/html/geoportal-sdk/node_modules
else 
    rm -rf /home/docker/html/geoportal-sdk/node_modules/*
fi

# on attend que les containers nginx et access-lib soient prêts
until [ -f /home/docker/html/geoportal-extensions/package/geoportal-extensions-openlayers-local.tgz ]; do
  >&2 echo "Extensions package is unavailable - sleeping..."
  sleep 2
done
until [ -f /home/docker/html/geoportal-extensions/package/geoportal-extensions-itowns-local.tgz ]; do
  >&2 echo "Extensions package is unavailable - sleeping..."
  sleep 2
done
>&2 echo "Extensions packages are available !"

# Modification du package.json pour se baser sur la version d'extensions qui est en local
sed -i 's/"\s*geoportal-extensions-itowns\s*"\s*:\s*".*"/"geoportal-extensions-itowns": "file:\/home\/docker\/html\/geoportal-extensions\/package\/geoportal-extensions-itowns-local.tgz"/g' package.json
sed -i 's/"\s*geoportal-extensions-openlayers\s*"\s*:\s*".*"/"geoportal-extensions-openlayers": "file:\/home\/docker\/html\/geoportal-extensions\/package\/geoportal-extensions-openlayers-local.tgz"/g' package.json

# On build au cas où le code ait changé
pushd /home/docker/geoportal-sdk/
rm -rf node_modules package-lock.json && npm install
cp -r node_modules/* /home/docker/html/geoportal-sdk/node_modules/
npm run build
cp -rf ./dist/* /home/docker/html/geoportal-sdk/dist/
cp -rf ./samples/* /home/docker/html/geoportal-sdk/samples/
cp -rf ./jsdoc/* /home/docker/html/geoportal-sdk/jsdoc/
popd
pushd /home/docker/geoportal-sdk/scripts/release/
rm -rf ./ignf-geoportal-sdk*.tgz
bash build-pack.sh -a
cp ./ignf-geoportal-sdk-2d*.tgz /home/docker/html/geoportal-sdk/package/ignf-geoportal-sdk-2d-local.tgz
cp ./ignf-geoportal-sdk-3d*.tgz /home/docker/html/geoportal-sdk/package/ignf-geoportal-sdk-3d-local.tgz
popd

# # Observation des changements 
bash /home/docker/watchCommon.sh &
bash /home/docker/watchSamples.sh &
bash /home/docker/watchExtensions.sh &

# Lancement des serveurs pour les tests et observation des changements 
cd /home/docker/geoportal-sdk/ && npm run test:serve:docker 