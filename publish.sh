#/bin/sh
cd $(dirname $0)
rm -rf build
yarn build
cd build
rsync -r * contabo:covid.pacov.city/html/