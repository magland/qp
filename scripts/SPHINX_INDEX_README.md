# Sphinx Documentation Index Extraction

## Overview

This directory contains a script to extract a complete index of all pages from any Sphinx-built documentation and map them to their source files.

## Available Indexes in Sphinx Documentation

Sphinx generates several index/inventory files:

1. **`objects.inv`** - Binary inventory file (zlib-compressed)
   - Contains 1,291 entries for DataLad docs
   - Indexes all documented objects: classes, functions, methods, attributes, etc.
   - Used for cross-referencing (`:func:`, `:class:`, etc.) and `intersphinx`
   - **Format**: Binary header + compressed data
   - **Use case**: API documentation, cross-project references

2. **`searchindex.js`** - JavaScript search index
   - Contains **143 pages** for DataLad docs
   - Has `docnames` array listing all documentation pages
   - Has `titles` array with page titles
   - Has `alltitles` mapping titles to documents
   - **Format**: JavaScript with JSON data
   - **Use case**: Full-text search, complete page listing ← **Best for getting all pages**

3. **`_sources/` directory** - Source files served by docs
   - Most Sphinx sites serve raw `.rst.txt` files
   - Accessible via "View page source" links
   - **Most reliable** source URL option (no guessing needed)

## The Script

**File**: `sphinx_pages_index.py`

### Features

- ✓ Extracts all pages from any Sphinx documentation by fetching `searchindex.js`
- ✓ Maps docnames to source `.rst` files
- ✓ **Prioritizes `_sources/` directory** for source URLs (most reliable)
- ✓ Optionally includes repository URLs (GitHub, etc.) when provided
- ✓ **Validates URLs** to ensure they're reachable (optional)
- ✓ Outputs JSON or text format
- ✓ Works with any Sphinx-hosted documentation

### Key Improvements (v2)

1. **No more hallucinated URLs** - Uses actual `_sources/` directory when available
2. **Renamed `github_url` → `source_url`** - More generic, doesn't assume GitHub
3. **Added `--validate` option** - Checks if URLs are actually reachable (uses concurrent checks for speed)
4. **Both URLs available** - When `--source-repo` is provided, both `source_url` and `repo_source_url` are included
5. **Figpack format support** - New `--format figpack` option outputs in [figpack](https://flatironinstitute.github.io/figpack/) schema

### Usage

```bash
# Simplest usage - auto-detects _sources/ directory
./sphinx_pages_index.py https://nwb-schema.readthedocs.io/en/latest/

# With repository URLs (provides both _sources/ and GitHub URLs)
./sphinx_pages_index.py https://docs.datalad.org/en/stable/ \
  --source-repo https://github.com/datalad/datalad/blob/maint/scripts/source

# Validate that URLs are reachable
./sphinx_pages_index.py https://nwb-schema.readthedocs.io/en/latest/ --validate

# Save to file
./sphinx_pages_index.py https://nwb-schema.readthedocs.io/en/latest/ \
  -o index.json

# Text format output
./sphinx_pages_index.py https://docs.datalad.org/en/stable/ \
  --source-repo https://github.com/datalad/datalad/blob/maint/scripts/source \
  --format text

# Figpack format (compatible with figpack schema)
./sphinx_pages_index.py https://docs.datalad.org/en/stable/ \
  --format figpack -o doc-pages.json
```

### Output Format

**JSON** (default):
```json
{
  "docs_url": "https://nwb-schema.readthedocs.io/en/latest/",
  "has_sources_dir": true,
  "total_pages": 6,
  "pages": [
    {
      "docname": "credits",
      "title": "Credits",
      "html_url": "https://nwb-schema.readthedocs.io/en/latest/credits.html",
      "rst_filename": "credits.rst",
      "source_url": "https://nwb-schema.readthedocs.io/en/latest/_sources/credits.rst.txt"
    },
    ...
  ]
}
```

With `--source-repo` option:
```json
{
  "docs_url": "https://docs.datalad.org/en/stable/",
  "has_sources_dir": true,
  "source_repo_url": "https://github.com/datalad/datalad/blob/maint/scripts/source",
  "total_pages": 143,
  "pages": [
    {
      "docname": "acknowledgements",
      "title": "Acknowledgments",
      "html_url": "https://docs.datalad.org/en/stable/acknowledgements.html",
      "rst_filename": "acknowledgements.rst",
      "source_url": "https://docs.datalad.org/en/stable/_sources/acknowledgements.rst.txt",
      "repo_source_url": "https://github.com/datalad/datalad/blob/maint/scripts/source/acknowledgements.rst"
    },
    ...
  ]
}
```

With `--validate` option:
```json
{
  "docs_url": "...",
  "pages": [...],
  "validation": {
    "validated": true,
    "total_checked": 6,
    "valid_count": 6,
    "invalid_count": 0,
    "invalid_urls": []
  }
}
```

**Figpack** format (compatible with [figpack](https://flatironinstitute.github.io/figpack/) schema):
```json
{
  "docPages": [
    {
      "title": "Acknowledgments",
      "url": "https://docs.datalad.org/en/stable/acknowledgements.html",
      "sourceUrl": "https://docs.datalad.org/en/stable/_sources/acknowledgements.rst.txt",
      "includeFromStart": true
    },
    {
      "title": "Background and motivation",
      "url": "https://docs.datalad.org/en/stable/background.html",
      "sourceUrl": "https://docs.datalad.org/en/stable/_sources/background.rst.txt",
      "includeFromStart": true
    },
    ...
  ]
}
```

**Text** format:
```
Sphinx Documentation Index
================================================================================
Documentation URL:  https://nwb-schema.readthedocs.io/en/latest/
Has _sources/ dir:  True
Total Pages:        6
================================================================================

credits
  Title:      Credits
  HTML:       https://nwb-schema.readthedocs.io/en/latest/credits.html
  RST File:   credits.rst
  Source URL: https://nwb-schema.readthedocs.io/en/latest/_sources/credits.rst.txt
...
```

## Source URL Priority

The script uses the following priority for source URLs:

1. **`_sources/` directory** (e.g., `https://example.com/scripts/_sources/page.rst.txt`)
   - Always preferred when available
   - Direct from the docs site (most reliable)
   - Accessible via "View page source" links

2. **Repository URL** (e.g., GitHub)
   - Only when provided via `--source-repo`
   - Useful for linking to editable source
   - Both URLs included in output when available

3. **No source URL**
   - If neither is available, only HTML URLs are provided
   - Use `--source-repo` option to add repository links

## Validation Feature

The `--validate` option checks if source URLs are actually reachable:

```bash
./sphinx_pages_index.py https://example.com/scripts/ --validate
```

Features:
- Uses concurrent checking (10 parallel workers) for speed
- Tries HEAD requests first, falls back to GET if needed
- Reports progress every 10 URLs
- Shows summary of valid/invalid URLs
- Lists invalid URLs in output (up to 10 shown in stderr)

Example output:
```
Validating source URLs for 143 pages...
  Checking 143 URLs...
  Progress: 10/143 URLs checked
  ...

  Validation complete:
    ✓ Valid:   143
    ✗ Invalid: 0
```

## Examples

### NWB Format Documentation (has _sources/)
```bash
./sphinx_pages_index.py https://nwb-schema.readthedocs.io/en/latest/ -o nwb.json
# Uses _sources/ directory automatically
```

### DataLad Documentation (with GitHub repo)
```bash
./sphinx_pages_index.py https://docs.datalad.org/en/stable/ \
  --source-repo https://github.com/datalad/datalad/blob/maint/scripts/source \
  -o datalad.json
# Provides both _sources/ URLs and GitHub URLs
```

### Sphinx Documentation with Validation
```bash
./sphinx_pages_index.py https://www.sphinx-doc.org/en/master/ --validate
# Checks that all source URLs are reachable
```

### Python Documentation
```bash
./sphinx_pages_index.py https://docs.python.org/3/ \
  --source-repo https://github.com/python/cpython/blob/main/Doc \
  --format text
```

### Figpack Format Output
```bash
# Generate doc-pages.json in figpack schema
./sphinx_pages_index.py https://docs.datalad.org/en/stable/ \
  --format figpack -o doc-pages.json

# The output will be compatible with figpack, with all pages having includeFromStart: true
# Useful for integration with figpack-based documentation systems
```

## Command-Line Options

- `docs_url` - Base URL of Sphinx documentation (required)
- `--source-repo URL` - Source repository base URL (optional, also accepts `--github-repo` or `--github`)
- `-o FILE`, `--output FILE` - Output file (default: stdout)
- `--format {json,text,figpack}` - Output format (default: json)
  - `json` - Full metadata with all fields
  - `text` - Human-readable text format
  - `figpack` - Compatible with [figpack](https://flatironinstitute.github.io/figpack/) schema (`{docPages: [...]}`)
- `--validate` - Validate that source URLs are reachable (optional, slower)

## Notes

- The script works with any Sphinx documentation, regardless of hosting
- No authentication required for public documentation
- `_sources/` directory is a standard Sphinx feature (most sites have it)
- Validation is optional but recommended to verify URLs
- Compatible with Python 3.6+
