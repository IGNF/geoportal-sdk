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

# mix
function mix() {
  echo "####### Mix debug !"
  gulp --debug --mix
  gulp publish
  echo "####### Mix production !"
  gulp --production --mix
  gulp publish
  echo "####### Mix !"
  gulp --mix
  gulp publish
}

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

# vg
function vg() {
  echo "####### VG debug !"
  gulp --debug --vg
  gulp publish
  echo "####### VG production !"
  gulp --production --vg
  gulp publish
  echo "####### VG !"
  gulp --vg
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

while getopts "aomiv" opts
do
   case $opts in
     o)
        echo "#################################"
        echo "###### OpenLayers bundle ! ######"
        ol3
        ;;
     m)
        echo "#################################"
        echo "####### Mixte bundle ! ########"
        mix
        ;;
     i)
       echo "#################################"
       echo "####### Standalone + mixte itowns bundle ! ########"
       mixIt
       itowns
       ;;
     v)
        echo "#################################"
        echo "###### VirtualGeo bundle ! ######"
        vg
        ;;
     a)
        echo "#################################"
        echo "########## ALL bundle ! #########"
        ol3
        itowns
        mix
        mixIt
        vg
        ;;
     \?)
        echo "$OPTARG : invalide, use option : -a(all), -o(openlayers), -m(mix), -i(mix && itowns) or -v(virtualgeo) !"
        exit -1
        ;;
   esac
done

if [ $# -eq 0 ]
then
  echo "use option : -a(all), -o(openlayers), -m(mix), -i(mix && itowns) or -v(virtualgeo) !"
fi

echo "END"
exit 0
