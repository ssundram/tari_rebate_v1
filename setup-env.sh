#!/bin/bash

# Add Resend API Key
echo "re_ctqSGDNA_NTfwYJrHRaAQxednbPdUG68k" | npx vercel env add RESEND_API_KEY production

# Add Supabase Service Role Key  
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tdHhpYW1teGRvbGlreXRsZWVlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTU1NDIzMiwiZXhwIjoyMDcxMTMwMjMyfQ.DrRrsNM9lfJ6GTipvjPgeBAQN4g0Ko3eAq7x93O_Ebo" | npx vercel env add VITE_SUPABASE_SERVICE_ROLE_KEY production

# Add Marketing Account ID
echo "23eda301-d578-4d76-bbf3-305ea27c3732" | npx vercel env add VITE_MARKETING_ACCOUNT_ID production

echo "✅ Environment variables added successfully!"
echo "🚀 Now redeploying to Vercel..."

# Redeploy
npx vercel --prod --yes
