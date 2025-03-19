# SSL Content Sync and Update Action

This action is used by the `Historic Sabbath School` project. It synchronizes content from the `upload` branch to the `master` branch and updates the `lessons.json` file with language information based on the directory structure. It's designed to streamline the content management workflow for lessons organized by decade, year, quarter, and language.

## Features

- Automatic sync from `upload` branch to `master` branch using example workflow provided.
- Scans directory structure to find available languages
- Updates `lessons.json` with language information and correct number of weeks
- Fully automated process triggered by pushes to the `upload` branch

## Requirements

- Repository should have both `upload` and `master` branches
- Node.js environment (automatically set up by the workflow)
- `lessons.json` file at the root of the repository

## Directory Structure

The action expects a directory structure like this:

```
├── lessons.json
└── 1880s
    └── 1888
        ├── q1
        │   ├── en
        │   │   ├── week-01.md
        │   │   ├── week-02.md
        │   │   └── ...
        │   ├── luo
        │   │   ├── week-01.md
        │   │   └── ...
        │   └── swa
        │       ├── week-01.md
        │       └── ...
        └── ...
```

## Usage

```yaml
name: Content Sync and Update

on:
  push:
    branches: [upload]

jobs:
  sync-and-update:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout upload branch
        uses: actions/checkout@v4
        with:
          ref: upload
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Run Content Sync and Update Action
        uses: churnisa/actions/ssl-content-sync@master
```

## How It Works

1. When content is pushed to the `upload` branch, the action is triggered
2. The action checks out the `upload` branch and stores its content
3. It then checks out the `master` branch
4. Content from the `upload` branch is synced to the `master` branch
5. The script scans the directory structure to identify languages and count weeks
6. The `lessons.json` file is updated with language information
7. All changes are committed and pushed to the `master` branch

## Lessons.json Format

The action updates an existing `lessons.json` file with the following structure:

```json
{
  "lessons": [
    {
      "id": 1,
      "title": "Example Lesson",
      "year": 2023,
      "quarter": "Q4",
      "type": "quarterly",
      "description": "Example description",
      "weeks": 13,
      "languages": ["en", "swa", "luo"],
      "image": "/placeholder.svg?height=300&width=400",
      "slug": "example-lesson-2023-q4"
    }
  ]
}
```

## Advanced Configuration

To modify the behavior of this action, you can edit the `update-lessons-json.js` script or the action steps in `action.yml`.