#!/bin/bash

SWAGGER_URL="http://localhost:8080/swagger/doc.json"
OUTPUT_DIR="./src/api"

echo "🚀 Generating modular API..."

rm -rf $OUTPUT_DIR

npx swagger-typescript-api generate \
  --path $SWAGGER_URL \
  --output $OUTPUT_DIR \
  --modular \
  --axios \
  --single-http-client \
  --clean-output

echo "✅ API generated successfully!"