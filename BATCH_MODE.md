# 📊 Guide Mode Batch - Upload Multiple CVs

## Vue d'ensemble

Le **Mode Batch** permet d'analyser **plusieurs CVs simultanément** et d'obtenir un classement automatique des candidats.

## 🎯 Fonctionnalités

### 1. **Upload Multiples**
- Sélectionnez plusieurs fichiers (PDF/DOCX) en une seule action
- Drag & drop de multiple fichiers
- Aperçu des fichiers sélectionnés avant analyse

### 2. **Tri et Filtrage**
- **Tri par score** : Classement automatique des CVs
- **Filtrage par status** :
  - 🏆 TOP MATCH (85-100%)
  - ✅ ÉLIGIBLE (70-84%)
  - ⚠️ À VÉRIFIER (50-69%)
  - ❌ REFUSÉ (<50%)

### 3. **Tableau de Résultats**
Affiche pour chaque CV :
- 📄 Nom du fichier
- 📈 Score global (%)
- Status d'éligibilité
- Points par catégorie (Formation, Expérience, Compétences)
- Bouton "Détails" pour explorer

### 4. **Statistiques Globales**
- Total de CVs analysés
- Nombre de CVs traités avec succès
- Nombre d'erreurs

## 📋 Étapes d'utilisation

### Étape 1 : Préparer les CVs
```
Créez un dossier avec vos CVs
├── candidat_1.pdf
├── candidat_2.docx
└── candidat_3.pdf
```

### Étape 2 : Upload Multiple
1. Accédez à http://localhost:5000
2. Cliquez ou déposez **plusieurs fichiers** dans la zone
3. Vérifiez la liste des fichiers
4. Cliquez **"Analyser tous"**

### Étape 3 : Consulter les Résultats
- Les résultats s'affichent dans un **tableau trié par score**
- Filtrez par status avec les boutons du haut
- Cliquez **"Détails"** pour voir le breakdown complet

### Étape 4 : Exporter (optionnel)
Les résultats sont automatiquement sauvegardés dans `results/`

## 📊 Interprétation des Résultats

### Statuts

| Status | Score | Interprétation | Action |
|--------|-------|----------------|--------|
| TOP MATCH 🏆 | 85-100 | Profil excellent | ✅ Appeler immédiatement |
| ÉLIGIBLE ✅ | 70-84 | Profil bon | ✅ Entretien prévu |
| À VÉRIFIER ⚠️ | 50-69 | À évaluer manuellement | 📞 Contact préliminaire |
| REFUSÉ ❌ | <50 | Profil non adapté | ❌ Archiver |

### Points par Catégorie

```
Formation (15 pts max)
  - Bac+5 ou Master : 10 pts
  - Bac+3/4 : 8 pts
  - Bac+2 : 5 pts
  - Domaine RH : +5 pts

Expérience (35 pts max)
  - Senior (≥ 5 ans) : 15 pts
  - Confirmé (3-5 ans) : 12 pts
  - Junior (1-3 ans) : 8 pts
  - Débutant : 5 pts
  - Recrutement pur : +15 pts
  - Secteur automobile : +5 pts

Compétences Techniques (20 pts max)
  - Sourcing expert : 8 pts
  - Excel avancé : 7 pts
  - ATS logiciels : 5 pts

Soft Skills (15 pts max)
  - Rigueur/organisation : 5 pts
  - Relationnel : 5 pts
  - Éthique : 5 pts

Langues (10 pts max)
  - Français expert : 5 pts
  - Anglais avancé : 4 pts
  - Langue bonus : 1 pt

Culture Entreprise (5 pts max)
  - ADN industriel : 2 pts
  - Orientation résultats : 2 pts
  - Esprit de service : 1 pt
```

## ⚙️ Configuration Batch

### Limites Techniques
- **Max CVs par batch** : Limité par mémoire serveur
- **Taille max par fichier** : 16 MB
- **Formats acceptés** : PDF, DOCX
- **Timeout** : Aucun (traitement complet)

### Performance
- **Fichier moyen (5 pages)** : ~2-3 secondes
- **Batch de 10 CVs** : ~20-30 secondes
- **Batch de 50 CVs** : ~2-3 minutes

## 🔧 Dépannage Mode Batch

### Problème : Fichiers non acceptés
**Solution** : Utilisez uniquement PDF ou DOCX, vérifiez la taille

### Problème : Erreurs d'analyse
**Solution** : Les fichiers corrompus sont marqués en rouge, vérifiez le CV source

### Problème : Résultats incorrects
**Solution** : Vérifiez la configuration dans `config/keywords.json` et `config/scoring.json`

## 📈 Cas d'Usage

### Pré-qualification d'un sourcing
```
1. Récupérez 50 CVs d'une plateforme
2. Analysez en mode batch
3. Triez par score
4. Contactez les TOP MATCH directement
Gain de temps : 80%
```

### Tri entre plusieurs agences
```
1. Collectez les CVs de candidats
2. Lancez l'analyse batch
3. Filtrez par status
4. Lancez des appels ciblés
```

### Benchmark interne
```
1. Analysez la base de candidats existants
2. Comparez les scores moyens
3. Ajustez les critères si nécessaire
```

## API Batch

### Endpoint: `/upload-batch`

**Méthode** : POST

**Paramètres**:
```
files[] : List[File]  # Fichiers PDF/DOCX
```

**Réponse**:
```json
{
  "total": 10,
  "processed": 9,
  "errors": 1,
  "results": [
    {
      "filename": "candidat_1.pdf",
      "total": 92,
      "status": "TOP MATCH",
      "score": 92,
      "breakdown": { ... },
      "timestamp": "2024-04-16T10:30:00"
    },
    ...
  ]
}
```

## 💾 Stockage des Résultats

Tous les résultats batch sont sauvegardés automatiquement :

```
results/
├── 20240416_103000_batch_1.json
├── 20240416_103045_batch_2.json
└── ...
```

Consultez `/results` pour voir l'historique complet.

---

**Besoin d'aide ?** Consultez le [README principal](README.md)
