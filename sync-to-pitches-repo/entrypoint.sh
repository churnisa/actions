#!/bin/bash

REPO_NAME=$INPUT_REPO_NAME
SSH_PRIVATE_KEY=$INPUT_SSH_PRIVATE_KEY
GITHUB_USERNAME=$INPUT_GITHUB_USERNAME

# Setup SSH
mkdir -p ~/.ssh
echo "$SSH_PRIVATE_KEY" > ~/.ssh/id_rsa
chmod 600 ~/.ssh/id_rsa
ssh-keyscan github.com >> ~/.ssh/known_hosts

# Check if gh pages exists in the Pitches repository exists. Create it if it does not

git config --global user.email "github-bot@users.noreply.github.com"
git config --global user.name "GitHub Bot"

if ! git ls-remote --exit-code --heads git@github.com:${GITHUB_USERNAME}/${REPO_NAME}.git gh-pages; then
  echo "Branch gh-pages does not exist. Creating a default index.html"

  # Clone the repository (it will fail silently if the repo is empty)
  git clone git@github.com:${GITHUB_USERNAME}/${REPO_NAME}.git || true

  mkdir -p ${REPO_NAME}

  cd ${REPO_NAME}

  # If the repository is completely empty, initialize it
  if [ ! -d ".git" ]; then
    git init
    git remote add origin git@github.com:${GITHUB_USERNAME}/${REPO_NAME}.git
  fi

  git checkout -b gh-pages

  ### checkout gh-pages branch whether it exists or not 

  # Create a default index.html page to push to gh-pages
  echo "<html><body><h1>Default Page</h1></body></html>" > index.html
  git add index.html
  git commit -m "Create gh-pages branch"
  
  git push -u origin gh-pages
fi


# for simplicities sake, remove all files that are not .html. This should handle diretories as well since all directories that have private files will have these files deleted so that the directories will remain empty
# Find all files and delete anything that's not .html or *_files directories
            
find . -type f ! -name "*.html" ! -name "*.css" ! -name "*.js" -exec rm -f {} \;
rm -rf .git
rm -rf .github


git clone --branch gh-pages git@github.com:${GITHUB_USERNAME}/${REPO_NAME}.git /tmp/pitches-repo
cd /tmp/pitches-repo/
find . -mindepth 1 -not -path './.git*' -exec rm -rf {} +
ls - lha
cd -
rsync -av --exclude=".git" --exclude="*.git*" --exclude=".github" ./ /tmp/pitches-repo/

cd /tmp/pitches-repo/
# Create a new index.html file with links to directories
echo "<html><body><h1>Directory Index</h1><ul>" > index.html

# Loop through all directories and add links to index.html
for dir in */; do
# Only add directories (not files)
if [ -d "$dir" ]; then
    dir_name=$(basename "$dir")
    echo "<li><a href=\"$dir_name\">$dir_name</a></li>" >> index.html
fi
done

echo "</ul></body></html>" >> index.html

git add .
git commit -m "Sync public files"
git push origin gh-pages
