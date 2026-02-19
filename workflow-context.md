# GitHub Workflow Issue: update-fs-cards-data

## What the workflow does
Connects to a MongoDB instance, fetches all documents from the `fst-subject` collection, converts them to CSV, and uploads the CSV to an S3 bucket. This syncs the FS Cards database with the frontend's data source.

## Repository
The workflow lives in: `Futurity-Accelerated-Science-Tools-Frontend` (a separate repo from `FS-Cards-Frontend`)

## Files involved
- `.github/workflows/update-fs-cards-data.yml` — the workflow definition
- `.github/scripts/update_fs_cards_documents.py` — the Python script it runs

Both files exist on the `main`, `stage`, and `prod` branches.

## Workflow YAML

```yaml
name: Update FS Cards Data
on:
  workflow_dispatch:
    inputs:
      reason:
        description: 'Reason for manual update'
        required: false
        default: 'Manual database sync'
  push:
    branches: [stage]
    paths: ['.github/workflows/update-fs-cards-data.yml']
jobs:
  update-data:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.9'
      - name: Install dependencies
        run: |
          pip install pymongo boto3
      - name: Update FS Cards documents
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.FS_CARDS_AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.FS_CARDS_AWS_SECRET_ACCESS_KEY }}
          AWS_DEFAULT_REGION: ${{ secrets.FS_CARDS_AWS_REGION }}
          S3_BUCKET: ${{ secrets.FS_CARDS_S3_BUCKET_NAME }}
        run: python .github/scripts/update_fs_cards_documents.py
```

## Python script

```python
import os
import csv
import boto3
from io import StringIO
from pymongo import MongoClient
import json

def main():
    password = 'BuildBetterFuturesFaster=2025'
    user = 'tess'
    CONNECTION_STRING = f"mongodb://{user}:{password}@13.39.247.9:27017/?authSource=admin"

    try:
        print("Connecting to MongoDB...")
        client = MongoClient(CONNECTION_STRING, tlsAllowInvalidCertificates=True)

        db_MD = client['fst-document-database']
        subjects_collection = db_MD["fst-subject"]

        print("Fetching documents from MongoDB...")
        documents = list(subjects_collection.find())
        print(f"Found {len(documents)} documents")

        if not documents:
            print("No documents found, exiting...")
            return

        all_fields = set()
        for doc in documents:
            all_fields.update(doc.keys())

        all_fields = sorted(all_fields)
        print(f"Fields found: {all_fields}")

        csv_data = []
        for doc in documents:
            row = {}
            for field in all_fields:
                value = doc.get(field, '')
                if hasattr(value, '__str__') and not isinstance(value, str):
                    if field == '_id':
                        value = str(value)
                    elif isinstance(value, (dict, list)):
                        value = json.dumps(value)
                    else:
                        value = str(value)
                row[field] = value
            csv_data.append(row)

        print("Converting to CSV...")
        output = StringIO()
        if csv_data:
            writer = csv.DictWriter(output, fieldnames=all_fields)
            writer.writeheader()
            writer.writerows(csv_data)

        print("Uploading to S3...")
        s3_bucket = os.environ['S3_BUCKET']
        s3 = boto3.client('s3')

        s3.put_object(
            Bucket=s3_bucket,
            Key='documents.csv',
            Body=output.getvalue(),
            ContentType='text/csv'
        )

        print(f"Successfully updated {len(csv_data)} documents in S3 bucket: {s3_bucket}")
        print(f"CSV URL: https://{s3_bucket}.s3.{os.environ['AWS_DEFAULT_REGION']}.amazonaws.com/documents.csv")

    except Exception as e:
        print(f"Error: {str(e)}")
        raise

if __name__ == "__main__":
    main()
```

## Issue history

### Issue 1 (resolved): Script file not found
The workflow initially failed with `[Errno 2] No such file or directory` for the Python script. This was fixed by ensuring the script file was committed to all relevant branches.

### Issue 2 (current): MongoDB connection timeout
After resolving the file path issue, the workflow now fails with a `ServerSelectionTimeoutError` connecting to `13.39.247.9:27017`. The GitHub Actions runner (hosted on Azure infrastructure) cannot reach the MongoDB server, likely because the server's firewall/security group does not allow inbound connections from GitHub's runner IP ranges.

**Error excerpt:**
```
pymongo.errors.ServerSelectionTimeoutError: 13.39.247.9:27017: timed out
(configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms),
Timeout: 30s
```

## What needs to happen
The MongoDB server at `13.39.247.9` (appears to be an AWS EC2 instance in eu-west-3) needs to be reachable from the GitHub Actions runner. Options discussed:

1. **Whitelist GitHub Actions IP ranges** in the EC2 security group (ranges available at `https://api.github.com/meta` under `actions` key — but they're large and change)
2. **SSH tunnel** through a bastion host that already has MongoDB access
3. **Self-hosted runner** in the same VPC as MongoDB
4. **Temporary security group rule** using the runner's IP (via an action like `haythem/public-ip`), added at start and removed at end of workflow

The right approach depends on the security group configuration and infrastructure setup.
