#!/bin/bash

SWAGGER_URL="http://localhost:8080/swagger/doc.json"
OUTPUT_DIR="./src/api"

echo "🚀 Generating API for Vite..."

rm -rf $OUTPUT_DIR

npx swagger-typescript-api generate \
  --path $SWAGGER_URL \
  --output $OUTPUT_DIR \
  --modular \
  --axios \
  --single-http-client \
  --clean-output \
  --module-esm \
  --extract-request-params \
  --extract-response-body \
  --type-prefix "" \
  --type-suffix ""

echo "✅ API generated successfully!"