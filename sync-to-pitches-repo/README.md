## pitches

If the pitch is public, you can use this action to publish the public files(html, js, css) for the reveal-js docs to the public pitches repo.

Requires `SSH deploy key`

### Usage

```bash
name: Sync and Deploy

on:
  push:
    branches:
      - master

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout the repository
        uses: actions/checkout@v4

      - name: Sync to Pitches Repo
        uses: churnisa/actions/sync-to-pitches-repo@master
        with:
          repo-name: "pitches"
          ssh-private-key: ${{ secrets.SSH_DEPLOY_KEY }} 
          github-username: ${{ github.repository_owner }}



```