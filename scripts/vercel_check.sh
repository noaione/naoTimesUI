#!/bin/bash

echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"

if [[ "$VERCEL_GIT_COMMIT_REF" == "staging" || "$VERCEL_GIT_COMMIT_REF" == "staging.tmp" ]]; then
    echo "🛑 - Ignoring build step for this ref..."
    exit 0;
else
    echo "✅ - Proceeding build..."
    exit 1;
fi
