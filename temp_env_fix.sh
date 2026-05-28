#!/bin/bash
set -a
source .env.local
if [ -z "$SUPABASE_URL" ]; then
    export SUPABASE_URL="$EXPO_PUBLIC_SUPABASE_URL"
fi
if [ -z "$SUPABASE_ANON_KEY" ]; then
    export SUPABASE_ANON_KEY="$EXPO_PUBLIC_SUPABASE_ANON_KEY"
fi
set +a