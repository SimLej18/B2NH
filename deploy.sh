#!/usr/bin/env sh
# abort on errors
set -e

# if you are deploying to a custom domain
echo 'b2nh.world' > CNAME

git init
git add -A
git commit -m 'deploy'
git push -f git@github.com:mesydel/slidedeck.git master:gh-pages
cd -
echo "Visit https://b2nh.world"