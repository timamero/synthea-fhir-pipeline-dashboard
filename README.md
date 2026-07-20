# Synthea FHIR Pipeline & Dashboard

**Status:** In active development

## Introduction

This project takes synthetic patient data from Synthea (FHIR format) through a full path: ingestion and transformation in Databricks, storage as queryable Delta tables, exposure through a lightweight API, and visualization in a small React dashboard. It started as a focused Databricks/PySpark learning exercise and has been extended into a small end-to-end application to demonstrate the full stack from raw data to a usable interface.

## Overview

Raw FHIR Bundles are parsed and flattened using PySpark into four Delta tables (Patient, Encounter, Condition, Observation). A Databricks SQL Warehouse exposes those tables over a queryable endpoint, which a small API layer wraps to serve clean, purpose-built JSON responses. A React dashboard consumes that API to render a single, focused visualization rather than a broad analytics suite — the goal is depth and correctness in one working slice, not breadth.

## Features

- FHIR Bundle parsing with an explicit schema, avoiding Spark's schema-inference conflicts across resource types
- Flattened, validated Delta tables for Patient, Encounter, Condition, and Observation resources
- API layer serving aggregated query results from the Delta tables
- React dashboard displaying condition frequency by gender as an interactive chart
- Documented pipeline design, including issues encountered and how they were resolved

## Architecture

```
Synthea FHIR Bundles (JSON)
        │
        ▼
Databricks (PySpark) — parse, flatten, validate
        │
        ▼
Delta Tables (patients, encounters, conditions, observations)
        │
        ▼
Databricks SQL Warehouse
        │
        ▼
API layer — queries the warehouse, returns JSON
        │
        ▼
React Dashboard — top conditions by gender
```

_(architecture diagram)_

## Tech Stack

| Layer                      | Technology               |
| -------------------------- | ------------------------ |
| Ingestion & transformation | Databricks, PySpark      |
| Storage                    | Delta Lake               |
| Query layer                | Databricks SQL Warehouse |
| API                        | FastAPI (Python)         |
| Frontend                   | React + Vite             |
| Version control            | GitHub                   |

## Repository Structure

```
synthea-fhir-pipeline-dashboard/
├── notebooks/
│   └── fhir_delta_pipeline.ipynb   # FHIR ingestion and Delta table pipeline
├── api/
│   └── ...                         # API layer querying the Delta tables
├── frontend/
│   └── ...                         # React dashboard
├── docs/
|   └── pipeline-writeup.md         # Detailed pipeline design and lessons learned
└── README.md
```

## Dashboard

The dashboard renders a single view: **top conditions by gender**, sourced from the `top_conditions_by_gender` query against the `conditions` and `patients` Delta tables. It's intentionally scoped to one clear, correct visualization rather than a broad set of half-finished ones.

## Roadmap

**Completed:**

- [x] Parsed and flattened Synthea FHIR data into four Delta tables using an explicit schema
- [x] Validated table integrity with row counts and join-integrity checks
- [x] Wrote and confirmed the `top_conditions_by_gender` analytical query

**In progress:**

- [x] API layer exposing query results as JSON
- [ ] React dashboard consuming the API and rendering the conditions-by-gender chart

<!-- ## Related Project

A companion project, [`s3-to-redshift-etl-pipeline`](#), builds an equivalent ingestion and transformation pipeline using AWS Glue and Redshift instead of Databricks, as a point of comparison between the two approaches. -->
