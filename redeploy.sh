#!/bin/bash
# Script de redeploy rápido para Vercel

echo "🚀 Iniciando redeploy na Vercel..."
echo ""

# Método 1: Git commit vazio
git commit --allow-empty -m "chore: trigger redeploy"
git push origin main

echo ""
echo "✅ Push realizado com sucesso!"
echo "📊 Acompanhe o deploy em: https://vercel.com/dashboard"
echo ""
echo "⏱️  O build levará ~2-3 minutos"
