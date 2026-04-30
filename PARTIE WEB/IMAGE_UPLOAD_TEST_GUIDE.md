# Guide de test : Capture et Upload de photos

## 🎯 Objectif
Vérifier que les photos sont correctement capturées, stockées en base de données et affichées dans l'interface.

## ✅ Étapes de test

### 1. **Prérequis**
- Backend démarré sur port 4000/5000
- MongoDB connectée
- Frontend démarré sur port 3000
- Utilisateur authentifié avec rôle technicien

### 2. **Créer une salle et checklist de test**

#### Administration → Checklists
- Créer nouveau protocole avec minimum 3 points de contrôle:
  - "Vérifier température"
  - "Vérifier humidité"
  - "Vérifier alimentation"
- Enregistrer

#### Administration → Salles Serveurs
- Créer nouvelle salle "Test Photo"
- Assigner la checklist créée
- Enregistrer

### 3. **Tester la capture de photo**

#### Navigation
```
Salles Serveurs → Bouton PlayArrow (vert) sur la salle "Test Photo"
```

Résultat attendu:
- Page ActiveVerification s'ouvre
- Affiche:
  - "Progression: 1 / 3"
  - Point de contrôle #1: "Vérifier température"
  - Section photo vide avec boutons

#### Test Photo (caméra)
- Cliquer "📷 Prendre une photo"
- Autoriser l'accès caméra si l'invite apparaît
- Cadrer un objet visible
- Cliquer "Capturer"

Résultat attendu:
- Photo s'affiche dans la zone grise
- Notification "Photo capturée"
- Boutons changent: "Supprimer" + "📷 Reprendre"

#### Test Photo (fichier)
- Cliquer "📁 Importer"
- Sélectionner une image JPG/PNG du système
- Fichier s'affiche dans la zone grise

Résultat attendu:
- Photo visible immédiatement
- Pas de délai long

### 4. **Tester l'ajout de notes et complétude**

- Écrire test "Température ok 22°C" dans "Observations"
- Cocher "Élément conforme"
- Cliquer "Suivant"

Résultat attendu:
- Page passe au point #2/3
- Notification "Élément sauvegardé"
- Photo/notes/statut sauvegardés

### 5. **Terminer la vérification**

Points #2 et #3:
- Répéter (photo + notes)
- À partir du point #3, le bouton devient "Terminer la vérification"

Résultat attendu:
- "Vérification complétée et soumise"
- Retour à page Salles Serveurs

### 6. **Vérifier visualisation des photos**

#### Historique → Détail de l'activité
- Aller dans "Historique des vérifications"
- Chercher la vérification "Test Photo"
- Cliquer "Voir"

Résultat attendu:
- Modal affiche:
  - 3 points de contrôle
  - Photos visibles pour chaque point
  - Notes affichées correctement

#### Dashboard → Activité récente
- Dashboard devrait afficher la vérification
- Cliquer sur l'activité
- Vérifier que les photos s'affichent

Résultat attendu:
- Pas d'erreur "Erreur image"
- Photos correctement rendues

---

## 🐛 Troubleshooting

### Problème: "Caméra introuvable"
**Cause**: Navigateur n'a pas accès à la caméra
**Solution**: 
1. Vérifier permissions système (Windows → Paramètres → Confidentialité → Caméra)
2. Utiliser Firefox ou Chrome (plus stables)
3. Utiliser HTTPS localhost (Si nécessaire)

### Problème: Photo vide/grise
**Cause**: Canvas pas encore peuplé
**Solution**:
1. Attendre que le stream vidéo charge
2. Positionner face-à la caméra
3. Cliquer "Capturer" seulement après que l'image s'affiche

### Problème: "Erreur lors de la sauvegarde"
**Cause**: Connexion backend échouée ou limite de taille
**Solution**:
1. Vérifier backend logs: `docker logs backend` (ou terminal)
2. Si "413 Payload too large": réduire qualité image (ligne 95 ActiveVerificationPage.js: `0.8` → `0.6`)
3. Vérifier token JWT pas expiré (reloguer)

### Problème: Photos ne s'affichent pas au retour
**Cause**: Photos stockées mais pas retrievées
**Solution**:
1. Vérifier MongoDB: `db.verifications.findOne()` doit afficher field `items[].photo` 
2. Vérifier format Base64 commence par `data:image/`
3. Cache navigateur: Ctrl+Shift+K (vider cache) puis Ctrl+F5

---

## 📊 Commandes utiles

### Vérifier les photos en base de données
```bash
# Entrée MongoDB
mongo mongodb://127.0.0.1:27017/ServerRoom

# Vérifier une vérification
db.verifications.findOne({}, { items: 1 })

# Voir photo du premier item (premiers 100 caractères)
db.verifications.findOne({}, { items: 1 }).items[0].photo.substring(0, 100)
```

### Voir les logs du backend
```bash
# Si backend lancé dans terminal
# Chercher les lignes 📩 PUT /api/verifications/...

# Si Docker
docker logs -f backend
```

### Test curl (depuis terminal)
```bash
VERIFICATION_ID="<copier depuis DB>"
ITEM_INDEX=0
TOKEN="<token depuis localStorage>"

curl -X PUT http://localhost:4000/api/verifications/$VERIFICATION_ID/items/$ITEM_INDEX \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "completed": true,
    "notes": "Test via curl",
    "photo": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
  }' | jq .
```

---

## ✨ Succès indicator
✅ Photos capturées visible immédiatement  
✅ Photos sauvegardées en DB (Base64)  
✅ Photos chargées et affichées au retour  
✅ Pas de "Erreur image"  
✅ Notes et statut sauvegardés aussi  
✅ Workflow complet: Capture → Save → Affichage fonctionnel
