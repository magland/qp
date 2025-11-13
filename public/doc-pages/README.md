# Documentation Indices

This directory contains auto-generated documentation indices in the figpack format.

These files are generated from the `doc-registry.yaml` file using the `scripts/doc_pages_index.py` script.

## Format

Each file follows the figpack schema:
```json
{
  "docPages": [
    {
      "title": "Page Title",
      "url": "https://example.com/page.html",
      "sourceUrl": "https://raw.githubusercontent.com/org/repo/branch/page.md",
      "includeFromStart": true
    }
  ]
}
```

## Updates

These files are automatically updated:
- Daily via GitHub Actions cron job (2 AM UTC)
- On changes to `doc-registry.yaml` or `scripts/doc_pages_index.py`
- Can be manually triggered via workflow_dispatch

## Usage

These indices can be used by QP assistants to retrieve documentation content dynamically.
