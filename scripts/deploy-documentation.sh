#!/usr/bin/env sh

# abort on errors
set -e
git diff-index HEAD https://$GH_USER:$GH_TOKEN@github.com/platyplus/platyplus.github.io.git/docs
# navigate into the build output directory
if [[ ! `git diff-index --quiet HEAD https://$GH_USER:$GH_TOKEN@github.com/platyplus/platyplus.github.io.git/docs` ]]; then
    export npm_config_loglevel=error
    npm install
    # build the docs
    npm run docs:build
    cd docs/.vuepress/dist
    git init
    git add -A
    git commit -m 'deploy'
    git push -f https://$GH_USER:$GH_TOKEN@github.com/platyplus/platyplus.github.io.git master
fi

cd -
