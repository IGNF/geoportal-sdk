#!/bin/bash

# -- option de nettoyage du répertoire
# par defaut, on ne le nettoie pas...
clean=false

##########
# doCmd()

doCmd () {
    cmd2issue=$1
    eval ${cmd2issue}
    retour=$?
    if [ $retour -ne 0 ] ; then
        printTo "Erreur d'execution (code:${retour}) !..."
        exit 100
    fi
}

##########
# printTo()

printTo () {
    text=$1
    d=`date`
    echo "[${d}] ${text}"
}

##########
# build()

build () {
    name=$1

    [ ${name} == "2d" ] && {
        main_directory="geoportal-sdk-2d"
    }

    [ ${name} == "3d" ] && {
        main_directory="geoportal-sdk-3d"
    }

    ucname=$(echo "${name}" | tr '[:lower:]' '[:upper:]')

    # binaires
    printTo "> dist/..."
    doCmd "mkdir -p ./${main_directory}/dist/"
    doCmd "cp ../../dist/${name}/*.js ./${main_directory}/dist/"
    doCmd "cp ../../dist/${name}/*.css ./${main_directory}/dist/"

    # sources
    printTo "> src/..."
    doCmd "mkdir -p ./${main_directory}/src/"
    doCmd "cp -r ../../src/Interface/ ./${main_directory}/src/."
    doCmd "cp -r ../../src/Utils/ ./${main_directory}/src/."
    doCmd "cp ../../src/Map.js ./${main_directory}/src/."
    doCmd "cp ../../src/SDK${ucname}.js ./${main_directory}/src/."

    doCmd "cp -r ../../src/OpenLayers/ ./${main_directory}/src/."
    [ ${name} == "3d" ] && {
        doCmd "cp -r ../../src/Itowns/ ./${main_directory}/src/."
    }

    # flag de compilation
    [ ${name} == "2d" ] && {
        doCmd 'find ./${main_directory}/src/ -type f -name "*.js" -exec sed -i "s/__SWITCH2D3D_ALLOWED__/false/g" {} +'
    }
    [ ${name} == "3d" ] && {
        doCmd 'find ./${main_directory}/src/ -type f -name "*.js" -exec sed -i "s/__SWITCH2D3D_ALLOWED__/true/g" {} +'
    }


    # package.json
    # lecture du package.json du projet
    export _PACKAGE_FIELD_NAME="SDK"${ucname}"Version"

    # - version :
    export _PACKAGE_VERSION=$(cat ../../package.json |
        perl -MJSON -0ne '
          my $DS = decode_json $_;
          my $field = $ENV{_PACKAGE_FIELD_NAME};
          print $DS->{$field};
        ')
    printTo "> package.json-version : ${_PACKAGE_VERSION}..."

    # - date
    export _PACKAGE_DATE=$(cat ../../package.json |
        perl -MJSON -0ne '
          my $DS = decode_json $_;
          my $field = "date";
          print $DS->{$field};
        ')
    printTo "> package.json-date : ${_PACKAGE_DATE}..."

    # modification du package.json : version & date de publication
    `cat "package-SDK${ucname}.json" |
        perl -MJSON -0ne '
        my $DS = decode_json $_;
        $DS->{version} = $ENV{_PACKAGE_VERSION};
        $DS->{date} = $ENV{_PACKAGE_DATE};
        print to_json($DS, {
          utf8 => 1,
          pretty => 1,
          indent => 1,
          space_before => 1,
          space_after => 1})
        ' > "./${main_directory}/package.json"`

    # sauvegarde du package.json
    printTo "> package.json..."
    doCmd "cp ./${main_directory}/package.json package-SDK${ucname}.json"

    # README & LICENCE
    printTo "> resources..."
    doCmd "cp ../../README-SDK-${ucname}.md ./${main_directory}/README.md"
    doCmd "cp ../../LICENCE-${ucname}.md ./${main_directory}/LICENCE.md"

    # npm pack
    printTo "> npm pack..."
    doCmd "cd ./${main_directory}"
    doCmd "npm pack"
    doCmd "cd .."
    doCmd "mv ./${main_directory}/*.tgz ."

    # clean
    if [ ${clean} == true ]
    then
        printTo "> clean..."
        doCmd "rm -rf ./${main_directory}/dist/ ./${main_directory}/src/"
        doCmd "rm ./${main_directory}/README.md"
        doCmd "rm ./${main_directory}/LICENCE.md"
        doCmd "rm ./${main_directory}/package.json"
        doCmd "rmdir ./${main_directory}/"
    fi
}

################################################################################
# MAIN
################################################################################
printTo "BEGIN"

printTo "> "

opts=`getopt -o ha23 --long help,all,2d,3d -n 'build-pack.sh' -- "$@"`
eval set -- "${opts}"

while true; do
    case "$1" in
        -h|--help)
            echo "Il faut au prealable construire les binaires :"
            echo "  > npm run build"
            echo ""
            echo "Attention, la date et la version sont extraites du package.json principal."
            echo "Par contre, les dependances ne sont pas gérées par le script..."
            echo ""
            echo "Usage :"
            echo "    `basename $0` - construction du package TGZ à publier dans NPM"
            echo "    -h|--help          Affiche cette aide."
            echo "    -2|--2d            build : 2D,"
            echo "    -3|--3d            build : 3D,"
            echo "    -a|--all           build : All."
            echo ""
            echo "Par defaut, les repertoires ne sont pas supprimés."
            echo "Le package validé, on se place dans le répertoire pour la publication :"
            echo "  > npm login"
            echo "  > npm publish"
            exit 0
            ;;

        -2|--2d)
            printTo "> Build 2d"
            build "2d"
            shift ;;

        -3|--3d)
            printTo "> Build 3d"
            build "3d"
            shift ;;

        -a|--all)
            printTo "> Build all !"
            build "2d"
            build "3d"
            shift ;;

        --)
            shift
            break
            ;;

        \?)
            printTo "$OPTARG : option invalide : all, 2d, 3d !"
            exit -1
            ;;
   esac
done

printTo "END"
exit 0
