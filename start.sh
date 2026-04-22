#!/bin/bash

# Script pour démarrer Agent Tri CV sur Linux/Mac/Windows (Git Bash)
# Exécution : bash start.sh
# Ou : chmod +x start.sh && ./start.sh
# Ou : sh start.sh

set -e

echo ""
echo "========================================"
echo "Agent Tri CV - Démarrage"
echo "========================================"
echo ""

# Vérifier si Docker est installé
if ! command -v docker &> /dev/null; then
    echo "❌ Erreur : Docker n'est pas installé"
    echo ""
    echo "Pour installer Docker :"
    echo "Consultez : https://docs.docker.com/get-docker/"
    echo ""
    exit 1
fi

# Vérifier si docker compose existe (v2)
if ! docker compose version &> /dev/null; then
    echo "❌ Erreur : Docker Compose n'est pas disponible"
    echo ""
    exit 1
fi

echo "✓ Docker trouvé"
docker --version
docker compose version
echo ""

# Vérifier que le Dockerfile existe
if [ ! -f "Dockerfile" ]; then
    echo "❌ Erreur : Dockerfile non trouvé"
    echo "Assurez-vous d'être dans le dossier agent-tri-cv"
    echo ""
    exit 1
fi

# Vérifier que docker-compose.yml existe
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Erreur : docker-compose.yml non trouvé"
    echo ""
    exit 1
fi

echo "✓ Fichiers de configuration trouvés"
echo ""

# Arrêter les conteneurs existants
echo "Arrêt des conteneurs existants..."
docker compose down 2>/dev/null || true

echo ""
echo "Démarrage de l'application..."
echo "(Première fois : cela peut prendre 2-3 minutes)"
echo ""

# Démarrer l'application
docker compose up --build

# Si on arrive ici, l'application a arrêté
echo ""
echo "========================================"
echo "Application arrêtée"
echo "========================================"
echo ""
