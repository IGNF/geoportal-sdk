#!/bin/bash

# Script de construction des bundles ainsi que de deploiement
# sur le serveur de sources
#  - TODO choix des bundles à construire
#  - TODO mise en place d'un "Build Number" unique et commune à tous les bundles
#         ex. fichier build.number avec un numéro qui est incrementé aprés chaque execution
#  - TODO gulp publish --build-number
#  - TODO gérer la publication des bundles sur le depot de sources (mercurial ou git)
#         hg commit -m "building bundles ${build.number}..."
#         hg outgoing | sed -n -e 3p  | cut -d: -f3 (ex. 944ed81fd2b6)
#         hg push

echo "BEGIN"

# mix itowns
function mixIt() {
  echo "####### Mix itowns debug !"
  gulp --debug --mixIt
  gulp publish
  echo "####### Mix itowns production !"
  gulp --production --mixIt
  gulp publish
  echo "####### Mix itowns !"
  gulp --mixIt
  gulp publish
}

# ol3
function ol3() {
  echo "####### OL debug !"
  gulp --debug --ol
  gulp publish
  echo "####### OL !"
  gulp --ol
  gulp publish
  echo "####### OL production !"
  gulp --production --ol
  gulp publish
}

# itowns
function itowns() {
  echo "####### iTowns debug !"
  gulp --debug --itowns
  gulp publish
  echo "####### iTowns production !"
  gulp --production --itowns
  gulp publish
  echo "####### iTowns !"
  gulp --itowns
  gulp publish
}

npm install

while getopts "aoi" opts
do
   case $opts in
     o)
        echo "#################################"
        echo "###### OpenLayers bundle ! ######"
        ol3
        ;;
     i)
       echo "#################################"
       echo "####### Standalone + mixte itowns bundle ! ########"
       mixIt
       itowns
       ;;
     a)
        echo "#################################"
        echo "########## ALL bundle ! #########"
        ol3
        itowns
        mixIt
        ;;
     \?)
        echo "$OPTARG : invalide, use option : -a(all), -o(openlayers), -i(mix && itowns) !"
        exit -1
        ;;
   esac
done

if [ $# -eq 0 ]
then
  echo "use option : -a(all), -o(openlayers), -i(mix && itowns)!"
fi

echo "END"
exit 0
