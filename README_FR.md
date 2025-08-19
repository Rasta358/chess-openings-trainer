# Chess Openings Trainer (hors-ligne, sans CDN)

## Ce que fait l'appli
- **Deux modes** :
  - **Libre** : vous jouez vos coups. Si un coup n'existe pas dans votre base d'ouvertures → message d'erreur. Si le coup est répertorié comme **erreur fréquente**, c'est affiché aussi.
  - **Guidé** : l'appli lit votre base et affiche **tous les bons coups** (points **verts**) et **les erreurs fréquentes** (croix **rouges**) depuis la position courante.
- **Système hiérarchique/progressif** : l'appli **reconnaît l’ouverture** au fur et à mesure. Donnez un nom (champ `label`) à certaines positions dans votre base pour structurer *Ouverture > Variante > Sous-variante*.
- **Annuler le coup**, **Flip board** (jouer côté Blancs/Noirs), **Export/Import** de votre base.
- **100% local** : aucun CDN ni internet requis une fois installée. PWA → fonctionne **hors-ligne**.

## Lancer sur PC (Windows/Mac/Linux)
1. Installez Python (si ce n’est pas déjà fait).
2. Ouvrez un terminal dans ce dossier et tapez :
   ```bash
   python -m http.server 8000
   ```
3. Ouvrez http://localhost:8000 dans votre navigateur. L’appli se charge.
4. (Option) Installez-la en PWA : icône « Installer » du navigateur.

> Alternative : avec VS Code, extension **Live Server** → clic droit `index.html` → « Open with Live Server ».

## Mettre sur votre téléphone (sans publier)
- Connectez votre téléphone au **même Wi-Fi** que votre PC.
- Sur le téléphone, ouvrez le navigateur et allez à l’adresse IP locale de votre PC, par ex. `http://192.168.1.20:8000`
- Le site s’ouvre → menu du navigateur → **Ajouter à l’écran d’accueil** (Android/Chrome) ou **Partager → Sur l’écran d’accueil** (iOS/Safari).
- Une icône d’appli apparaît. **Hors-ligne** après la 1re visite (grâce au *service worker*).

## Comment éditer votre base d'ouvertures
Fichier : `data/openings.json` (format **JSON**).

### Structure minimale
```json
{
  "meta": {"name":"Mes ouvertures","version":1},
  "trees": [
    {
      "name": "Nom de la famille (ex: Espagnole)",
      "root": {
        "pos": "start",
        "label": "Espagnole",
        "good": {
          "e2e4": {
            "pos": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR|b",
            "children": {
              "e7e5": {
                "pos": "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR|w"
              }
            }
          }
        },
        "mistakes": {
          "f2f3": {"note":"Mauvaise idée"}
        }
      }
    }
  ]
}
```

### Règles importantes
- **pos** = *clé de position* au format `"placement|side"` :
  - `placement` = partie **placement** d’une FEN (8 rangées séparées par `/`, pièces blanches en **majuscules** `PNBRQK`, noires en **minuscules** `pnbrqk`).
  - `side` = `w` (trait aux Blancs) ou `b` (trait aux Noirs).
  - Départ : `rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR|w`
- **Bons coups**: clefs **UCI** (ex. `e2e4`, `g1f3`, `e1g1`). Chacun doit pointer vers la **position suivante** via `pos`.
- **Erreurs fréquentes**: clefs UCI dans `mistakes` (+ `note` optionnelle). Elles n’avancent pas la position.
- **Hiérarchie**: ajoutez `label` aux nœuds (positions) pour nommer l’ouverture, la variante, etc. L’appli affiche la chaîne des labels rencontrés.

> Astuce : pour calculer la prochaine `pos`, vous pouvez utiliser la fonction utilitaire `applyUciToPlacement()` depuis la **console du navigateur** (Outils de développement) : elle applique un coup UCI à un `placement` FEN (simplifié).

## Limitations (volontaires)
- Pas de validation de légalité complète : en **mode libre**, tout coup **non présent dans votre base** est refusé.
- La clé de position ignore les droits de roque/en-passant (`placement|side`), suffisant pour l’entraînement d’ouvertures.
- Édition via fichier JSON (pas d’éditeur visuel intégré).

Bon entraînement !
