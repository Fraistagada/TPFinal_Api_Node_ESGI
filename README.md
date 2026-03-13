# eval-api

API REST pour la gestion de réservations de restaurant.

**Stack :** Node.js / Express 5, MySQL2, JWT, bcrypt
**Base URL :** `http://localhost:3000`

Baptiste : Toute la partie une + MCD
Arno : Toute la partie deux

---

## Installation

```bash
npm install
```

Configurer le fichier `.env` :

```
JWT_SECRET=votre_secret
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=eval_api
```

Importer le fichier `sql/eval_api.sql` dans phpMyAdmin ou MySQL.

Lancer le serveur :

```bash
node serveur.js
```

---

## Authentification

Les routes protégées nécessitent un token JWT dans le header HTTP :

```
Authorization: Bearer <token>
```

Le token est obtenu via `POST /login`. Il expire après **1 heure**.
Le payload du token contient : `{ id, email, isAdmin }`.

---

## Routes disponibles

### Authentification

| Méthode | Route     | Auth requise | Admin uniquement | Description                  |
| ------- | --------- | :----------: | :--------------: | ---------------------------- |
| POST    | `/signup` |     Non      |       Non        | Créer un compte              |
| POST    | `/login`  |     Non      |       Non        | Se connecter, obtenir un JWT |

### Menu

| Méthode | Route       | Auth requise | Admin uniquement | Description              |
| ------- | ----------- | :----------: | :--------------: | ------------------------ |
| GET     | `/menu`     |     Non      |       Non        | Lister les plats du menu |
| POST    | `/menu`     |     Oui      |       Oui        | Ajouter un plat          |
| PUT     | `/menu/:id` |     Oui      |       Oui        | Modifier un plat         |
| DELETE  | `/menu/:id` |     Oui      |       Oui        | Supprimer un plat        |

**Filtres GET /menu :** `?categorie=entrée` `?prix_max=15`

### Réservations

| Méthode | Route                        | Auth requise | Admin uniquement | Description                    |
| ------- | ---------------------------- | :----------: | :--------------: | ------------------------------ |
| POST    | `/reservations`              |     Oui      |       Non        | Créer une réservation          |
| GET     | `/reservations`              |     Oui      |       Oui        | Lister toutes les réservations |
| GET     | `/my-reservations`           |     Oui      |       Non        | Voir mes réservations          |
| PUT     | `/reservations/:id`          |     Oui      |       Non        | Modifier une réservation       |
| DELETE  | `/reservations/:id`          |     Oui      |       Non        | Annuler une réservation        |
| PATCH   | `/reservations/:id/validate` |     Oui      |       Oui        | Confirmer une réservation      |

**Filtres GET /reservations et /my-reservations :** `?statut=en_attente` `?date=2026-03-20` `?user_id=1` (admin seulement)

### Tables du restaurant

| Méthode | Route         | Auth requise | Admin uniquement | Description                |
| ------- | ------------- | :----------: | :--------------: | -------------------------- |
| GET     | `/tables`     |     Non      |       Non        | Lister les tables          |
| POST    | `/tables`     |     Oui      |       Oui        | Ajouter une table          |
| PUT     | `/tables/:id` |     Oui      |       Oui        | Modifier une table         |
| DELETE  | `/tables/:id` |     Oui      |       Oui        | Supprimer une table        |

### Disponibilités

| Méthode | Route              | Auth requise | Admin uniquement | Description                              |
| ------- | ------------------ | :----------: | :--------------: | ---------------------------------------- |
| GET     | `/disponibilites`  |     Non      |       Non        | Voir les tables dispo pour un créneau    |

**Paramètres requis :** `?date=2026-03-20&time=19:00:00`

### Créneaux d'ouverture

| Méthode | Route           | Auth requise | Admin uniquement | Description            |
| ------- | --------------- | :----------: | :--------------: | ---------------------- |
| GET     | `/creneaux`     |     Non      |       Non        | Lister les créneaux    |
| POST    | `/creneaux`     |     Oui      |       Oui        | Ajouter un créneau     |
| PUT     | `/creneaux/:id` |     Oui      |       Oui        | Modifier un créneau    |
| DELETE  | `/creneaux/:id` |     Oui      |       Oui        | Supprimer un créneau   |

**Filtre GET /creneaux :** `?jour=lundi`

---

## Détail des routes

### POST /signup

Créer un nouveau compte utilisateur.

**Auth :** Non requise

**Requête :**

```json
{
  "email": "user@example.com",
  "motDePasse": "password123"
}
```

**Réponses :**

| Statut                      | Corps                                 |
| --------------------------- | ------------------------------------- |
| `200 OK`                    | `{ "message": "Compte créé" }`        |
| `400 Bad Request`           | `{ "message": "Email déjà utilisé" }` |
| `500 Internal Server Error` | `{ "message": "Erreur serveur" }`     |

---

### POST /login

Se connecter et obtenir un token JWT.

**Auth :** Non requise

**Requête :**

```json
{
  "email": "user@example.com",
  "motDePasse": "password123"
}
```

**Réponses :**

| Statut                      | Corps                                     |
| --------------------------- | ----------------------------------------- |
| `200 OK`                    | `{ "token": "<JWT>" }`                    |
| `401 Unauthorized`          | `{ "message": "Identifiants invalides" }` |
| `500 Internal Server Error` | `{ "message": "Erreur serveur" }`         |

---

### GET /menu

Récupérer la liste des plats du menu.

**Auth :** Non requise

**Filtres optionnels :** `?categorie=plat` `?prix_max=20`

**Exemple de réponse `200` :**

```json
[
  {
    "id": 1,
    "nom": "Salade César",
    "description": "Salade romaine, poulet grillé, parmesan",
    "prix": 12.50,
    "categorie": "entrée"
  }
]
```

---

### POST /menu

Ajouter un plat au menu (admin uniquement).

**Auth :** JWT requis + rôle admin

**Requête :**

```json
{
  "nom": "Pavé de thon",
  "description": "Thon mi-cuit aux sésames",
  "prix": 18.00,
  "categorie": "plat"
}
```

---

### POST /reservations

Créer une nouvelle réservation. Les tables disponibles sont attribuées automatiquement.

**Auth :** JWT requis (tout utilisateur connecté)

**Requête :**

```json
{
  "name": "Arnold Swartzenegger",
  "phone": "0785730498",
  "number_of_people": 4,
  "date": "2026-03-20",
  "time": "19:00:00",
  "note": "J'ai gagné Mr Olympia"
}
```

> Champs requis : `number_of_people`, `date`, `time`. Les autres sont optionnels.

**Réponses :**

| Statut                      | Corps                                                     |
| --------------------------- | --------------------------------------------------------- |
| `200 OK`                    | `{ "message": "Réservation créée", "reservation_id": 3 }` |
| `400 Bad Request`           | `{ "message": "Champs manquants" }`                       |
| `400 Bad Request`           | `{ "message": "Capacité insuffisante" }`                  |
| `500 Internal Server Error` | `{ "message": "Erreur serveur" }`                         |

---

### GET /reservations

Lister toutes les réservations (accès admin uniquement).

**Auth :** JWT requis + rôle admin

**Filtres optionnels :** `?statut=en_attente` `?date=2026-03-20` `?user_id=1`

---

### GET /my-reservations

Voir ses propres réservations.

**Auth :** JWT requis (tout utilisateur connecté)

**Filtres optionnels :** `?statut=en_attente` `?date=2026-03-20`

---

### PUT /reservations/:id

Modifier une réservation existante. Uniquement si son statut est `en_attente`.

**Auth :** JWT requis (tout utilisateur connecté)

---

### DELETE /reservations/:id

Annuler une réservation (suppression douce — le statut passe à `cancelled`).

**Auth :** JWT requis (tout utilisateur connecté)

---

### PATCH /reservations/:id/validate

Confirmer une réservation (accès admin uniquement). Le statut passe à `confirmed`.

**Auth :** JWT requis + rôle admin

---

### GET /disponibilites

Voir les tables disponibles pour un créneau donné.

**Auth :** Non requise

**Paramètres requis :** `?date=2026-03-20&time=19:00:00`

**Exemple de réponse `200` :**

```json
{
  "date": "2026-03-20",
  "time": "19:00:00",
  "tables_disponibles": [
    { "id": 1, "numero": 1, "capacite": 2 },
    { "id": 5, "numero": 5, "capacite": 10 }
  ],
  "capacite_totale_disponible": 12
}
```

---

## Statuts de réservation

| Statut       | Description                                 |
| ------------ | ------------------------------------------- |
| `en_attente` | Réservation créée, en attente de traitement |
| `confirmed`  | Confirmée par un admin                      |
| `cancelled`  | Annulée                                     |

---

## Notifications

Toutes les actions importantes sont loguées dans la console du serveur avec le préfixe `[NOTIFICATION]` :
- Création / modification / annulation de réservation
- Ajout / modification / suppression de plats, tables et créneaux
- Confirmation de réservation par un admin
