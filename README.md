# 🤖 Agent Tri CV - Analyse Intelligente Automatique

Une application web intelligente qui analyse et classe automatiquement les CV selon des critères spécifiques : expérience, niveau d'études, compétences techniques, soft skills, langues et culture d'entreprise.

## ✨ Caractéristiques

- **Analyse Automatique** : Extraction du texte et scoring intelligent basé sur des critères configurables
- **Interface Web Intuitive** : Upload de fichiers PDF/DOCX avec visualisation des résultats en temps réel
- **Scoring Multi-Critères** : 6 catégories d'évaluation pour un scoring complet (100 pts max)
- **Configuration Flexible** : Mots-clés et barèmes éditables en JSON
- **Historique Complet** : Sauvegarde et consultation de tous les CV analysés
- **⚡ Performance** : Analyse instantanée par mots-clés (1-2 sec/CV)
- **100% Gratuit** : Aucune API externe requise, 100% local
- **Docker Ready** : Déploiement en une seule commande

## 🔍 Scoring par Mots-Clés

### Analyse Rapide et Stable ⚡
```
Formation (12/15) + Expérience (25/35) + Compétences (16/20) + 
Soft Skills (12/15) + Langues (8/10) + Culture (4/5)
= Score: 77/100 ✓ Rapide (< 2 sec)
```

### Avantages
✓ Pas de dépendance LLM/Ollama  
✓ 100% déterministe et transparent  
✓ Configuration locale (keywords.json)  
✓ Analyse instantanée  
✓ Aucun appel réseau

**Le système utilise uniquement l'analyse par mots-clés, pas de RAG/LLM.**

## 🏗️ Architecture de la Solution

La solution est composée de 4 couches principales :

```
┌─────────────────────────────────────────────────────────────┐
│  FRONTEND (HTML/CSS/JS)                                     │
│  • Interface upload                                         │
│  • Affichage temps réel des résultats                       │
│  • Historique des CV analysés                               │
└─────────────────────────────────────────────────────────────┘
                            ↕️
┌─────────────────────────────────────────────────────────────┐
│  BACKEND (Python/Flask)                                     │
│  • TextExtractor : Extraction PDF/DOCX + nettoyage texte    │
│  • CVScorer : Scoring 6 catégories + calcul dates           │
│  • API REST : Routes /upload, /results, /health             │
└─────────────────────────────────────────────────────────────┘
                            ↕️
┌─────────────────────────────────────────────────────────────┐
│  DONNÉES (JSON)                                             │
│  • keywords.json : Mots-clés paramétrés (EDITABLE)          │
│  • scoring.json : Seuils et statuts (EDITABLE)              │
│  • results/ : Résultats persistants                         │
└─────────────────────────────────────────────────────────────┘
```

**Pour plus de détails**, consultez :
- 📋 [`DOCUMENTATION_TECHNIQUE.md`](./DOCUMENTATION_TECHNIQUE.md) - Scoring, biais et considérations éthiques

## 📊 Barème de Notation

| Catégorie | Points | Description |
|-----------|--------|-------------|
| **Formation** | 15 | Niveau d'études (Bac+2 à Bac+5) + Domaine (RH/Gestion/Commerce) |
| **Expérience** | 35 | Durée + Type de poste + Bonus secteur automobile |
| **Compétences Techniques** | 20 | Sourcing + Excel + ATS/Logiciels RH |
| **Soft Skills** | 15 | Rigueur + Relationnel + Éthique |
| **Langues** | 10 | Français + Anglais + Langues bonus |
| **Culture d'Entreprise** | 5 | ADN industriel + KPI + Service |
| **TOTAL** | **100 pts** | Score final |

## 🎯 Statuts de Classification

- **💎 TOP MATCH** (85-100 pts) : Profil idéal, prêt à l'emploi
- **✅ ÉLIGIBLE** (70-84 pts) : Très bon profil, à contacter
- **🔍 À VÉRIFIER** (50-69 pts) : Potentiel, shortlist secondaire
- **❌ REFUSÉ** (<50 pts) : Profil insuffisant

## 🚀 Installation Rapide

### � Guides d'Installation

Choisissez votre guide selon votre niveau:

#### 👨‍💻 **Pour les Non-Informaticiens** ⭐ **COMMENCER ICI**
📖 **[INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md)** - Guide détaillé, étape par étape
- ✅ Explications simples
- ✅ Captures d'écran textuelles
- ✅ Dépannage complet
- ✅ 30-45 minutes

#### ⚡ **Pour les Informaticiens** (Démarrage Rapide)

Voir section "**Une Seule Commande**" ci-dessous

### ✨ Une Seule Commande (Linux/Mac/Windows)

```bash
bash start-docker.sh
```

**Puis accédez à:** http://localhost:5000 🎉

**Ce qui se passe:**
- ✅ Docker Compose lance l'application Flask
- ✅ 100% containers, zéro installation locale
- ✅ Prêt pour la production immédiate

---

### 🪟 Alternative: Windows PowerShell

```powershell
PowerShell -ExecutionPolicy Bypass -File .\install-windows.ps1
```

---

### 🐍 Alternative: Python Natif (Sans Docker)

```bash
# 1. Cloner le projet
git clone https://github.com/ans-med/agent-tri-cv.git
cd agent-tri-cv

# 2. Créer environnement virtuel
python -m venv venv
source venv/bin/activate  # Sur Windows: venv\Scripts\activate

# 3. Installer dépendances
pip install -r requirements.txt

# 4. Créer dossiers
mkdir -p uploads results

# 5. Démarrer l'app
python app.py

# 6. Accédez à http://localhost:5000
```

**Note:** Le système utilise uniquement l'analyse par mots-clés pour une performance maximale.

## 📁 Structure du Projet

```
agent-tri-cv/
├── app.py                 # Application Flask principale
├── Dockerfile            # Configuration Docker
├── docker-compose.yml    # Orchestration Docker
├── requirements.txt      # Dépendances Python
├── config/
│   ├── keywords.json     # Mots-clés par catégorie (EDITABLE)
│   └── scoring.json      # Barèmes de points (EDITABLE)
├── modules/
│   ├── extractor.py      # Extraction texte PDF/DOCX
│   └── scorer.py         # Moteur de scoring
├── templates/
│   ├── index.html        # Page d'upload
│   └── results.html      # Page des résultats
├── static/
│   ├── style.css         # Styles CSS
│   └── script.js         # JavaScript
├── uploads/              # CV téléchargés (temporaire)
├── results/              # Résultats JSON (permanent)
└── README.md             # Ce fichier
```

## 🔧 Configuration (Personnalisation)

### Ajouter/Modifier des Mots-Clés

**Fichier** : `config/keywords.json`

Exemple - Ajouter un mot-clé pour sourcing :

```json
"sourcing_expert": {
  "mots_cles": [
    "linkedin recruiter",
    "chasse de tête",
    "approche directe",
    "votre_nouveau_mot_cle"  // ← Ajouter ici
  ],
  "points": 8
}
```

### Modifier les Barèmes

**Fichier** : `config/scoring.json`

Exemple - Changer le seuil de TOP MATCH :

```json
"seuils": {
  "top_match": {
    "min": 85,
    "max": 100,
    "label": "💎 TOP MATCH",
    "action": "Notification immédiate",
    "color": "#FFD700"
  }
}
```

## 📖 Utilisation

### 1. Analyser un CV

1. Accédez à http://localhost:5000
2. Téléchargez un CV (PDF ou DOCX)
3. Cliquez sur **"Analyser"**
4. Consultez le rapport détaillé

### 2. Visualiser l'Historique

1. Cliquez sur l'onglet **"Résultats"**
2. Filtrez par statut (Top Match, Éligible, etc.)
3. Cliquez sur **"Détails"** pour voir le scoring complet

### 3. Exporter les Données

Les résultats sont automatiquement sauvegardés en JSON dans le dossier `results/`.

Vous pouvez les :
- Consulter directement
- Importer dans Excel/Google Sheets
- Intégrer dans vos systèmes

## 🔍 Critères de Filtrage Automatique (KO)

Le système rejette automatiquement un CV si :

1. **Français insuffisant** : Plus de 5 fautes détectées
2. **Pas d'expérience RH** : Aucune mention de recrutement/RH
3. **Niveau d'études trop bas** : Inférieur à Bac+2

## 📊 Exemple de Résultat

```
Candidat: Jean Dupont

💎 TOP MATCH (92/100)

✓ Formation (15/15)
  - Licence RH (Bac+3): 10 pts
  - Domaine RH: 5 pts

✓ Expérience (33/35)
  - 7 ans d'expérience: 15 pts
  - Chargé de Recrutement: 15 pts
  - Secteur Automobile: 3 pts

✓ Compétences Techniques (18/20)
  - LinkedIn Recruiter Expert: 8 pts
  - Excel Avancé: 7 pts
  - ATS (Teamtailor): 5 pts (pas détecté: -2)

✓ Soft Skills (15/15)
  - Rigueur & Organisation: 5 pts
  - Relationnel & Équipe: 5 pts
  - Éthique & Discrétion: 5 pts

✓ Langues (9/10)
  - Français Expert: 5 pts
  - Anglais B2: 4 pts

✓ Culture d'Entreprise (4/5)
  - ADN Industriel: 2 pts
  - Orientation Résultats: 2 pts

ACTION: Invitation entretien immédiate
```

## 🐳 Commandes Docker

```bash
# Démarrer l'application
docker-compose up

# Démarrer en arrière-plan
docker-compose up -d

# Arrêter l'application
docker-compose down

# Voir les logs
docker-compose logs -f

# Redémarrer
docker-compose restart

# Reconstruire l'image
docker-compose build --no-cache
```

## 📈 Performance

- **Temps d'analyse** : ~1-2 secondes par CV ⚡
- **Capacité** : Illimitée (API local, pas de throttling)
- **Consommation** : ~150 MB RAM
- **Stockage** : < 500 MB pour l'application

---

## 📚 Documentation Complète

Pour une compréhension approfondie du système, consultez :

### 🧠 **[DOCUMENTATION_TECHNIQUE.md](./DOCUMENTATION_TECHNIQUE.md)** ⭐ **À LIRE**

Documentation complète couvrant :

1. **🛠️ Choix Technologiques**
   - Pourquoi Flask, PyPDF2, python-docx?
   - Approche keywords-only (stable, rapide, transparent)
   - Architecture sans dépendances externes
   - Docker: reproductibilité

2. **🔧 Prétraitement et Extraction des Features**
   - Pipeline complet: extraction → normalisation → segmentation
   - Algorithme extraction dates + calcul durée totale
   - Features extraites pour scoring
   - Limitations (OCR, langues, formatage)

3. **📊 Critères de Sélection et Logique de Scoring**
   - Filtres KO détaillés (français, études, expérience)
   - Scoring Keywords: configuration par mots-clés éditables
   - Formules de scoring par catégorie
   - Tableau classification (TOP MATCH, ELIGIBLE, À VÉRIFIER, KO)
   - Exemples concrets de calcul

4. **⚖️ Biais Potentiels et Limites Éthiques** ⚠️
   - 7 biais identifiés (linguistique, anchoring, démographique, etc.)
   - Impact et mitigations concrètes
   - Limitations éthiques (confidentialité, transparence, équité)
   - Recommandations court/moyen/long terme
   - **Responsabilité humaine**: Ne JAMAIS faire refus automatique

### 📖 Autres Documentations

- 📦 [`BATCH_MODE.md`](./BATCH_MODE.md) - Upload multiple et tri des résultats
- 🚀 [`QUICKSTART.md`](./QUICKSTART.md) - Démarrage rapide (5 min)
- 📋 [`CHANGELOG.md`](./CHANGELOG.md) - Historique des versions

---

## ⚖️ Éthique et Responsabilité

### ⚠️ Avertissement Important

**Ce système est un outil d'AIDE AU TRI, pas un décideur automatique.**

```
❌ MAUVAISE UTILISATION:
   "Score < 60 = Refus automatique"

✅ BONNE UTILISATION:
   "Score < 60 = Mettre en shortlist secondaire, reviewer manuellement"
```

### Biais Identifiés

Le système peut avoir des biais envers:
- **Profils avec CVs mal formatés** (PDF scanned, OCR non supporté)
- **Candidats allophones** (biais linguistique sur typos)
- **Formations internationales** (keywords basé sur France métropolitaine)
- **Reconversions tardives** (favorise continuité vs transitions)
- **Vocabulaire spécialisé non couverts** (keywords incomplets pour certains domaines)

### Recommandations d'Usage

1. ✅ **Toujours faire human review** pour scores < 70 ou KO filters
2. ✅ **Expliquer les critères** aux candidats (transparence)
3. ✅ **Fournir un recours** ("Contester ce score")
4. ✅ **Monitorer les statistiques** par profil démographique
5. ✅ **Mettre à jour keywords.json** régulièrement

📄 **Voir [`DOCUMENTATION_TECHNIQUE.md`](./DOCUMENTATION_TECHNIQUE.md#4-biais-potentiels-et-limites-éthiques) pour détails biais & solutions.**

---

## 🛠️ Dépannage

### 🪟 Windows

#### ❌ Erreur : "Docker command not found"

**Solution** : Docker Desktop n'est pas installé ou n'est pas dans le PATH
1. Téléchargez Docker Desktop : https://www.docker.com/products/docker-desktop
2. Redémarrez votre ordinateur après l'installation
3. Ouvrez PowerShell (nouveau) et vérifiez : `docker --version`

#### ❌ Erreur : "PowerShell script disabled"

**Solution** : Exécutez le script avec la bonne approche
```powershell
# Ouvrez PowerShell en tant qu'administrateur
PowerShell -ExecutionPolicy Bypass -File .\install-windows.ps1
```

#### ❌ Erreur : "Port 5000 already in use"

**Solution** : Changez le port dans `docker-compose.yml`
```yaml
services:
  agent-tri-cv:
    ports:
      - "5001:5000"  # ← Changer 5000 en 5001
```
Puis accédez à : `http://localhost:5001`

#### ❌ Application ne répond pas

**Solutions** :
```powershell
# 1. Arrêter et relancer
docker compose down
docker compose up --build

# 2. Vérifier les logs
docker compose logs

# 3. Redémarrer Docker Desktop depuis le menu système
```

---

### 🐧 Linux/Mac

#### ❌ Docker ne démarre pas

```bash
# Vérifier les logs
docker-compose logs agent-tri-cv

# Reconstruire l'image
docker-compose build --no-cache
```

#### ❌ Permission denied

```bash
# Exécutez avec sudo (non recommandé)
sudo docker-compose up

# OU ajoutez votre utilisateur au groupe docker
sudo usermod -aG docker $USER
```

---

### ✅ Configuration commune

#### Le container ne démarre pas

```bash
# Vérifier les logs
docker-compose logs agent-tri-cv

# Reconstruire l'image
docker-compose build --no-cache
```

#### Erreur "Port 5000 already in use"

```bash
# Utiliser un autre port dans docker-compose.yml
ports:
  - "5001:5000"  # ← Changer 5000 en 5001
```

#### Les fichiers ne sont pas sauvegardés

Assurez-vous que les dossiers existent :

```bash
mkdir -p uploads results
chmod 755 uploads results
```

## 📝 Format des Résultats JSON

Chaque analyse génère un fichier JSON :

```json
{
  "filename": "cv_jean_dupont.pdf",
  "timestamp": "2024-04-15T10:30:00",
  "total": 92,
  "status": "💎 TOP MATCH",
  "action": "Notification immédiate",
  "ko": false,
  "breakdown": {
    "formation": {
      "points": 15,
      "max": 15,
      "details": ["Bac+3: 10 pts", "Domaine RH: 5 pts"]
    },
    ...
  }
}
```

## 🔐 Sécurité

- ✅ Validation des types de fichiers (PDF/DOCX uniquement)
- ✅ Limite de taille (16 MB max)
- ✅ Nettoyage automatique du texte
- ✅ Aucune donnée envoyée à l'extérieur
- ✅ Données stockées localement

## 📚 Technologies

- **Backend** : Flask 3.0 (Python 3.11)
- **Extraction** : PyPDF2 + python-docx
- **Frontend** : HTML5 + CSS3 + Vanilla JavaScript
- **Analyse** : Regex + Keyword Matching
- **Base de données** : JSON files + Filesystem
- **Containerization** : Docker + Docker Compose

## 📄 Licence

MIT - Libre d'utilisation

## �‍💼 Créateurs du Projet

**Agent Tri CV** a été créé par:

- **Iman El Baraka** 👩‍🎓
- **Rim Belghiti** 👩‍🎓  
- **Zainab Serroukh** 👩‍🎓

**Étudiantes** - Université Abdelmalek Essaidi  
Faculté des Sciences Juridiques, Économiques et Sociales de Tanger (FSJEST) - 2026
**Développement assisté par IA**: Ce projet a été développé avec l'assistance de **Claude Haiku 4.5** (Anthropic), un modèle d'IA spécialisé dans l'assistance au codage.
Développé pour automatiser la classification des CV selon des critères métier spécifiques, tout en maintenant éthique et transparence dans le processus de sélection.

## 🤝 Contribution

Les contributions sont bienvenues ! N'hésitez pas à :
- Reporter des bugs
- Suggérer des améliorations
- Soumettre des pull requests

**Avant de contribuer**, lisez:
- 📄 [`DOCUMENTATION_TECHNIQUE.md`](./DOCUMENTATION_TECHNIQUE.md) - Architecture et design decisions
- ⚖️ [`DOCUMENTATION_TECHNIQUE.md`](./DOCUMENTATION_TECHNIQUE.md#4-biais-potentiels-et-limites-éthiques) - Biais et considérations éthiques

## 📞 Support

Pour toute question ou problème :
- 📖 Consultez d'abord [`DOCUMENTATION_TECHNIQUE.md`](./DOCUMENTATION_TECHNIQUE.md) 
-  Vérifiez les logs Docker: `docker-compose logs`
- 📋 Ouvrez une issue sur GitHub avec détails

---

**Version** : 3.0 (Keywords-Only Optimized)  
**Dernière mise à jour** : 19 avril 2026  
**Statut** : ✅ Production Ready