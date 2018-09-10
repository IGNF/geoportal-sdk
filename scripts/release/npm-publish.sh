#!/bin/bash

# répertoire d'execution
_PWD=`pwd`

# chemins des répertoires
_DIR_SCRIPTS="${_PWD}/scripts/release"
_DIR_CONFIG_NPM="${_DIR_SCRIPTS}/config_npm"
_DIR_DIST="${_PWD}/dist"
_NPM_SCOPE="@ignf-geoportal"
_DIR_PUBLISH="${_PWD}/publish/${_NPM_SCOPE}"


[ -d "${_DIR_PUBLISH}" ] && {
    eval "rm -rf ${_DIR_PUBLISH}"
}
eval "mkdir -p ${_DIR_PUBLISH}/sdk-2d/dist"
eval "mkdir -p ${_DIR_PUBLISH}/sdk-3d/dist"

eval "cp -r ${_DIR_DIST}/sdk-2d/. ${_DIR_PUBLISH}/sdk-2d/dist"
eval "cp -r ${_DIR_DIST}/sdk-3d/. ${_DIR_PUBLISH}/sdk-3d/dist"
eval "cp LICENCE-2D.md ${_DIR_PUBLISH}/sdk-2d/LICENCE.md"
eval "cp LICENCE-3D.md ${_DIR_PUBLISH}/sdk-3d/LICENCE.md"
eval "cp README-SDK-2D.md ${_DIR_PUBLISH}/sdk-2d/README.md"
eval "cp README-SDK-3D.md ${_DIR_PUBLISH}/sdk-3d/README.md"
eval "cp ${_DIR_CONFIG_NPM}/package-SDK2D.json  ${_DIR_PUBLISH}/sdk-2d/package.json"
eval "cp ${_DIR_CONFIG_NPM}/package-SDK3D.json  ${_DIR_PUBLISH}/sdk-3d/package.json"
