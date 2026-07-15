# Synthea FHIR → Databricks Delta Pipeline

[View notebook](https://timamero.github.io/synthea-fhir-databricks-pipeline/)

## Purpose

Loads synthetic patient data from Synthea (FHIR format), parses and flattens the nested JSON using PySpark, and writes the results as queryable Delta tables. Built as a manual-upload workflow — no S3 or external storage connections — so it runs entirely within a Databricks Free Edition workspace, keeping the focus on Databricks/Spark fundamentals.

## Pipeline Overview

1. **Generate/download** Synthea FHIR Bundles (one JSON file per patient)
2. **Upload** to a Databricks Unity Catalog volume
3. **Explore** the raw Bundle/entry/resource structure
4. **Parse** resources with an explicit schema (avoids Spark schema-inference conflicts across resource types) and isolate by `resourceType`
5. **Flatten** nested fields per resource type: `Patient`, `Encounter`, `Condition`, `Observation`
6. **Validate** for nulls, duplicates, and correct types
7. **Write** each resource type as a managed Delta table
8. **Query** with row counts, join-integrity checks, and analytical SQL

## Contents

- `*.ipynb` — the notebook

## Extensions

- Add more resource types (Medication, Immunization, Procedure)
- Incremental loads via `MERGE INTO` instead of full overwrite
- Lightweight raw/cleaned Delta table separation (medallion-style, no extra infra)
- BI dashboard on top of the `observations` table
- Compare against an equivalent AWS Glue/Redshift pipeline on the same source data
