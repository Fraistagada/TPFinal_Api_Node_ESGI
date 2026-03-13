# eval-api

API REST pour la gestion de réservations de restaurant.

**Stack :** Node.js / Express 5, MySQL2, JWT, bcrypt
**Base URL :** `http://localhost:3000`

Baptiste : Toute la partie une + MCD
Arno : Toute la partie deux

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

| Méthode | Route                        | Auth requise | Admin uniquement | Description                    |
| ------- | ---------------------------- | :----------: | :--------------: | ------------------------------ |
| POST    | `/signup`                    |     Non      |       Non        | Créer un compte                |
| POST    | `/login`                     |     Non      |       Non        | Se connecter, obtenir un JWT   |
| GET     | `/menu`                      |     Non      |       Non        | Lister les plats du menu       |
| POST    | `/reservations`              |     Oui      |       Non        | Créer une réservation          |
| GET     | `/reservations`              |     Oui      |       Oui        | Lister toutes les réservations |
| PUT     | `/reservations/:id`          |     Oui      |       Non        | Modifier une réservation       |
| DELETE  | `/reservations/:id`          |     Oui      |       Non        | Annuler une réservation        |
| PATCH   | `/reservations/:id/validate` |     Oui      |       Oui        | Confirmer une réservation      |

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

**Réponses :**

| Statut                      | Corps                                |
| --------------------------- | ------------------------------------ |
| `200 OK`                    | `[ { "id": 1, "nom": "...", ... } ]` |
| `500 Internal Server Error` | `{ "message": "Erreur serveur" }`    |

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
| `401 Unauthorized`          | `{ "message": "Token manquant" }`                         |
| `403 Forbidden`             | `{ "message": "Token invalide" }`                         |
| `500 Internal Server Error` | `{ "message": "Erreur serveur" }`                         |

---

### GET /reservations

Lister toutes les réservations (accès admin uniquement).

**Auth :** JWT requis + rôle admin

**Réponses :**

| Statut                      | Corps                                                        |
| --------------------------- | ------------------------------------------------------------ |
| `200 OK`                    | Tableau de toutes les réservations (voir exemple ci-dessous) |
| `401 Unauthorized`          | `{ "message": "Token manquant" }`                            |
| `403 Forbidden`             | `{ "message": "Token invalide" }`                            |
| `403 Forbidden`             | `{ "message": "Accès refusé" }`                              |
| `500 Internal Server Error` | `{ "message": "Erreur serveur" }`                            |

**Exemple de réponse `200` :**

```json
[
  {
    "id": 1,
    "user_id": 1,
    "name": "Arnold Swartzenegger",
    "phone": "0785730498",
    "number_of_people": 5,
    "date": "2026-03-20",
    "time": "19:00:00",
    "note": "J'ai gagné Mr Olympia",
    "statut": "pending",
    "date_creation": "2026-03-11T17:14:11.000Z"
  }
]
```

---

### PUT /reservations/:id

Modifier une réservation existante. Uniquement si son statut est `pending`.

**Auth :** JWT requis (tout utilisateur connecté)

**Paramètre URL :** `id` — identifiant de la réservation

**Requête :**

```json
{
  "name": "Arnold Swartzenegger",
  "phone": "0785730498",
  "number_of_people": 3,
  "date": "2026-03-21",
  "time": "20:00:00",
  "note": "Nouvelle note"
}
```

**Réponses :**

| Statut                      | Corps                                         |
| --------------------------- | --------------------------------------------- |
| `200 OK`                    | `{ "message": "Réservation modifiée" }`       |
| `400 Bad Request`           | `{ "message": "Réservation non modifiable" }` |
| `401 Unauthorized`          | `{ "message": "Token manquant" }`             |
| `403 Forbidden`             | `{ "message": "Token invalide" }`             |
| `404 Not Found`             | `{ "message": "Réservation introuvable" }`    |
| `500 Internal Server Error` | `{ "message": "Erreur serveur" }`             |

---

### DELETE /reservations/:id

Annuler une réservation (suppression douce — le statut passe à `cancelled`).

**Auth :** JWT requis (tout utilisateur connecté)

**Paramètre URL :** `id` — identifiant de la réservation

**Réponses :**

| Statut                      | Corps                                  |
| --------------------------- | -------------------------------------- |
| `200 OK`                    | `{ "message": "Réservation annulée" }` |
| `401 Unauthorized`          | `{ "message": "Token manquant" }`      |
| `403 Forbidden`             | `{ "message": "Token invalide" }`      |
| `500 Internal Server Error` | `{ "message": "Erreur serveur" }`      |

---

### PATCH /reservations/:id/validate

Confirmer une réservation (accès admin uniquement). Le statut passe à `confirmed`.

**Auth :** JWT requis + rôle admin

**Paramètre URL :** `id` — identifiant de la réservation

**Réponses :**

| Statut                      | Corps                                       |
| --------------------------- | ------------------------------------------- |
| `200 OK`                    | `{ "message": "Réservation confirmée" }`    |
| `400 Bad Request`           | `{ "message": "Réservation déjà traitée" }` |
| `401 Unauthorized`          | `{ "message": "Token manquant" }`           |
| `403 Forbidden`             | `{ "message": "Token invalide" }`           |
| `403 Forbidden`             | `{ "message": "Accès refusé" }`             |
| `404 Not Found`             | `{ "message": "Réservation introuvable" }`  |
| `500 Internal Server Error` | `{ "message": "Erreur serveur" }`           |

---

## Statuts HTTP utilisés

| Code                        | Signification                                      |
| --------------------------- | -------------------------------------------------- |
| `200 OK`                    | Requête réussie                                    |
| `400 Bad Request`           | Données manquantes ou invalides                    |
| `401 Unauthorized`          | Token JWT absent                                   |
| `403 Forbidden`             | Token invalide/expiré, ou accès refusé (non admin) |
| `404 Not Found`             | Ressource introuvable                              |
| `500 Internal Server Error` | Erreur côté serveur                                |

---

## Statuts de réservation

| Statut       | Description                                 |
| ------------ | ------------------------------------------- |
| `en_attente` | Réservation créée, en attente de traitement |
| `pending`    | En attente de confirmation                  |
| `confirmed`  | Confirmée par un admin                      |
| `cancelled`  | Annulée                                     |
