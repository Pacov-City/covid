#/bin/sh
cd $(dirname $0)
git add . && git commit -m "publish" && git push
rm -rf build
yarn build \
&& cd build \
&& rsync -r * contabo:covid.pacov.city/html/ \
&& echo Published !