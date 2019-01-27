#!/usr/bin/env sh

# abort on errors
set -e

# change npm verbosity
export npm_config_loglevel=error

# Install depedencies
npm install

# build the docs
npm run docs:build

mkdir docs/.vuepress/dist.repo
cd docs/.vuepress/dist.repo
git init .
git remote add origin https://$GH_USER:$GH_TOKEN@github.com/platyplus/platyplus.github.io.git
git pull origin master
cp -r ../dist/* ./
echo "*** pre-add ****"
git add .
ls -a

echo "*** diff ****"
git diff-index HEAD
echo "*** end diff ****"
if [[ ! `git diff-index --quiet HEAD` ]]; then
    # deploy to github pages
    git commit -m 'deploy'
    git push origin master
else
    echo "no changes"
fi
cd -

