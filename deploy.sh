#!/usr/bin/env sh
# abort on errors
set -e

# if you are deploying to a custom domain
echo 'b2nh.world' > A

git init
git add -A
git commit -m 'deploy'
git push -f git@github.com:SimLej18/B2NH.git main:gh-pages
cd -
echo "Visit https://b2nh.world"