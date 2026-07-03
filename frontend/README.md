# Frontend - Réservation de Restaurant

Application React/Vite consommant l'API Node/Express du dossier parent.

## Installation

```
npm install
npm run dev
```

L'app démarre sur `http://localhost:5173`. Le serveur backend doit tourner sur `http://localhost:3000` (voir `node serveur.js` à la racine du dépôt, avec MySQL démarré).

Aucune variable d'environnement à configurer : `vite.config.js` proxy les appels API vers `localhost:3000` .

## Routes front-end

L'app ne utilise pas de routeur (pas de React Router) : une seule page, navigation gérée par un état React (`page`) dans `App.jsx`.

| Vue (state `page`)  | Accès          | Description                                                        | Appel API                              |
| ------------------- | -------------- | -------------------------------------------------------------------- | --------------------------------------- |
| `menu`              | public         | Affiche le menu groupé par catégorie                                  | `GET /menu`                             |
| `login`             | public         | Formulaire de connexion, stocke le token JWT                          | `POST /login`                           |
| `signup`            | public         | Formulaire d'inscription                                              | `POST /signup`                          |
| `my-reservations`   | connecté       | Liste des réservations de l'utilisateur, annulation                   | `GET /my-reservations`, `DELETE /reservations/:id` |
| `new-reservation`   | connecté       | Formulaire de nouvelle réservation (validation date ≥ aujourd'hui)     | `POST /reservations`                    |
| `admin`             | connecté admin | Tableau de toutes les réservations, validation/annulation             | `GET /reservations`, `PATCH /reservations/:id/validate`, `DELETE /reservations/:id` |

L'accès aux vues `my-reservations` / `new-reservation` (utilisateur connecté) et `admin` (`isAdmin: true`) est déterminé en décodant le payload du JWT stocké en `localStorage` (pas de vérification serveur côté nav, juste affichage conditionnel).

## Arborescence des composants

```
src/
├── main.jsx        # point d'entrée, monte <App />
├── App.jsx          # tous les composants (pas de découpage en fichiers séparés)
│   ├── Nav                  # barre de navigation, affichage conditionnel selon user
│   ├── MenuPage              # GET /menu, regroupement par catégorie
│   ├── LoginPage              # formulaire login
│   ├── SignupPage             # formulaire inscription
│   ├── MyReservationsPage     # liste + annulation
│   ├── NewReservationPage     # formulaire de réservation
│   ├── AdminPage               # tableau admin (valider/annuler)
│   └── App                    # racine : state `user` + `page`, rend la vue active
├── api.js           # wrapper fetch (auth header, gestion du token, décodage JWT)
└── App.css          # styles globaux minimalistes
```

Tous les composants sont regroupés dans `App.jsx` par souci de simplicité (pas de séparation en fichiers/dossiers `components/`).
