#!/bin/bash
# Démarrage complet 100% Docker du système (App + Ollama)

set -e

echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║     🤖 Agent Tri CV - Démarrage 100% Docker (App + Ollama)        ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""

# Vérifications préalables
echo "📋 Vérifications..."

# Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé"
    exit 1
fi

DOCKER_VERSION=$(docker --version 2>/dev/null | grep -oP '\d+\.\d+' | head -1)
echo "✅ Docker version: $DOCKER_VERSION"

# Docker Compose
if ! docker compose --version &> /dev/null; then
    echo "❌ Docker Compose n'est pas disponible"
    exit 1
fi

COMPOSE_VERSION=$(docker compose --version 2>/dev/null | grep -oP '\d+\.\d+' | head -1)
echo "✅ Docker Compose version: $COMPOSE_VERSION"

# Fichiers
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ docker-compose.yml manquant"
    exit 1
fi
echo "✅ docker-compose.yml trouvé"

if [ ! -f "Dockerfile" ]; then
    echo "❌ Dockerfile manquant"
    exit 1
fi
echo "✅ Dockerfile trouvé"

if [ ! -f "Dockerfile.ollama" ]; then
    echo "❌ Dockerfile.ollama manquant"
    exit 1
fi
echo "✅ Dockerfile.ollama trouvé"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧹 Nettoyage des anciens containers..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

docker compose down 2>/dev/null || true

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🏗️  Construction et démarrage des containers..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Démarrer les services
docker compose up -d --remove-orphans

if [ $? -eq 0 ]; then
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "✅ Containers démarrés avec succès!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    # Attendre que l'app soit ready
    echo "⏳ Attente du démarrage de l'application..."
    
    for i in {1..30}; do
        if curl -f http://localhost:5000/health &> /dev/null; then
            echo ""
            echo "✅ Application PRÊTE!"
            break
        fi
        echo -n "."
        sleep 2
    done
    
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🎉 SUCCÈS - Application accesible!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "🌐 Frontend: http://localhost:5000"
    echo ""
    echo "📊 Services actifs:"
    docker compose ps
    echo ""
    echo "💡 Commandes utiles:"
    echo "   - Voir les logs app:     docker compose logs -f agent-tri-cv"
    echo "   - Voir les logs Ollama:  docker compose logs -f ollama"
    echo "   - Arrêter:               docker compose down"
    echo "   - Initialiser modèle:    bash docker-init-ollama.sh llama2:7b"
    echo ""
else
    echo ""
    echo "❌ Erreur lors du démarrage des containers"
    echo ""
    echo "Vérifiez les logs:"
    docker compose logs
    exit 1
fi
