#!/bin/bash
# Check required environment variables
REQUIRED_VARS=(
  "NEXT_PUBLIC_APP_URL"
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
  "SUPABASE_URL"
  "SUPABASE_ANON_KEY"
)

MISSING_VARS=()

for var in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!var}" ]; then
    MISSING_VARS+=("$var")
  fi
done

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
  echo "ERROR: Missing required environment variables: ${MISSING_VARS[*]}"
  exit 1
else
  echo "✓ All required environment variables are present"
  exit 0
fi