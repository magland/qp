# qp

A multi-tenant AI chat platform that hosts specialized AI assistants, each accessible via different subdomains. Built with React, TypeScript, and Vite on the frontend, with a Next.js API backend.

## Chat Assistants

This repository supports seven specialized chat applications:

### 1. **stan-assistant**

Technical assistant for [Stan](https://mc-stan.org/) probabilistic programming. Provides guidance and code examples based on the Stan User's Guide and Reference Manual.

### 2. **nwb-assistant**

Assistant for [Neurodata Without Borders (NWB)](https://www.nwb.org/). Helps with PyNWB and related tools. Includes Jupyter integration for running Python code.

### 3. **neurosift-chat**

Explores and queries neuroscience datasets across DANDI Archive, OpenNeuro, and EBRAINS repositories. Features dataset search, NWB file analysis, and data visualization capabilities.

### 4. **dandiset-explorer**

Specialized assistant for exploring specific Dandisets with Python/Jupyter integration.

### 5. **test-chat**

Development testing assistant with Jupyter support.

### 6. **figpack-assistant**

Assistant for [Figpack](https://flatironinstitute.github.io/figpack/).

### 7. **bids-assistant**

Assistant for the [Brain Imaging Data Structure (BIDS)](https://bids.neuroimaging.io/) specification. Helps with organizing neuroimaging data according to BIDS standards.

## Architecture

- **Frontend**: React + Vite + TypeScript single-page application
- **Backend**: Next.js API (`nextjs/qp-api/`) handling chat persistence and LLM requests
- **Routing**: Subdomain-based assistant selection (e.g., `stan-assistant.vercel.app`)
- **LLM Integration**: OpenRouter for model flexibility
- **Storage**: MongoDB for chat history
- **Tools**: Custom tools per assistant (document retrieval, Python execution, dataset queries)

## Development

```bash
# Frontend
npm install
npm run dev

# Backend API
cd nextjs/qp-api
npm install
npm run dev
```
