#!/usr/bin/env sh
rm -rf .git

# abort on errors
set -e

# change npm verbosity
export npm_config_loglevel=error

# Install depedencies
npm install

# TODO: run tests
# TODO: enable a smart way to deploy:
# 1. pull/clone the github gh page repo into the ci image
# 2. build the dist
# 3. if dist files changed, commit and push
mkdir -p docs/.vuepress/dist
echo "*** dist ****"
cd docs/.vuepress/dist
ls
echo "*** init ****"
git init
git remote add origin https://$GH_USER:$GH_TOKEN@github.com/platyplus/platyplus.github.io.git
git pull origin master
git branch -a
echo "*** init done ****"
ls
cd -

# build the docs
npm run docs:build

cd docs/.vuepress/dist
echo "*** pre-add ****"
ls
git add -A

echo "*** diff ****"
git diff-index HEAD
echo "*** diff dot ****"
git diff-index HEAD .
echo "*** end diff ****"
if [[ ! `git diff-index --quiet HEAD .` ]]; then
    # deploy to github pages
    git commit -m 'deploy'
    git push origin master
else
    echo "no changes"
fi
cd -

