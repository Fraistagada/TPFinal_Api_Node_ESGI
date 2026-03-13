const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Restaurant",
      version: "1.0.0",
      description: "API de réservation pour un restaurant fictif - Projet ESGI",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Serveur local",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    tags: [
      { name: "Auth", description: "Authentification" },
      { name: "Reservations", description: "Gestion des réservations" },
      { name: "Menu", description: "Menu du restaurant" },
      { name: "Tables", description: "Tables du restaurant" },
      { name: "Creneaux", description: "Créneaux horaires" },
      { name: "Disponibilites", description: "Vérification des disponibilités" },
    ],
    paths: {
      "/signup": {
        post: {
          tags: ["Auth"],
          summary: "Créer un compte",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "motDePasse"],
                  properties: {
                    email: { type: "string", example: "test@email.com" },
                    motDePasse: { type: "string", example: "test123" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Compte créé" },
            400: { description: "Email déjà utilisé ou champs manquants" },
          },
        },
      },
      "/login": {
        post: {
          tags: ["Auth"],
          summary: "Se connecter",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "motDePasse"],
                  properties: {
                    email: { type: "string", example: "admin2@email.com" },
                    motDePasse: { type: "string", example: "admin123" },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Token JWT retourné",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      token: { type: "string" },
                    },
                  },
                },
              },
            },
            401: { description: "Identifiants invalides" },
          },
        },
      },
      "/reservations": {
        get: {
          tags: ["Reservations"],
          summary: "Voir toutes les réservations (admin)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "statut",
              in: "query",
              schema: { type: "string", enum: ["en_attente", "confirmed", "cancelled"] },
              description: "Filtrer par statut",
            },
            {
              name: "date",
              in: "query",
              schema: { type: "string", format: "date" },
              description: "Filtrer par date (YYYY-MM-DD)",
            },
            {
              name: "user_id",
              in: "query",
              schema: { type: "integer" },
              description: "Filtrer par utilisateur",
            },
          ],
          responses: {
            200: { description: "Liste des réservations" },
            401: { description: "Token manquant" },
            403: { description: "Accès refusé (pas admin)" },
          },
        },
        post: {
          tags: ["Reservations"],
          summary: "Créer une réservation",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["number_of_people", "date", "time"],
                  properties: {
                    name: { type: "string", example: "Pierre Durand" },
                    phone: { type: "string", example: "0600000000" },
                    number_of_people: { type: "integer", example: 3 },
                    date: { type: "string", format: "date", example: "2026-03-25" },
                    time: { type: "string", example: "19:00:00" },
                    note: { type: "string", example: "Près de la fenêtre" },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Réservation créée",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "Réservation créée" },
                      reservation_id: { type: "integer", example: 1 },
                    },
                  },
                },
              },
            },
            400: { description: "Champs manquants ou capacité insuffisante" },
            401: { description: "Token manquant" },
          },
        },
      },
      "/reservations/{id}": {
        put: {
          tags: ["Reservations"],
          summary: "Modifier une réservation (si en attente)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string", example: "Pierre Durand" },
                    phone: { type: "string", example: "0611111111" },
                    number_of_people: { type: "integer", example: 4 },
                    date: { type: "string", format: "date", example: "2026-03-25" },
                    time: { type: "string", example: "20:00:00" },
                    note: { type: "string", example: "Changement d'heure" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Réservation modifiée" },
            400: { description: "Réservation non modifiable" },
            404: { description: "Réservation introuvable" },
          },
        },
        delete: {
          tags: ["Reservations"],
          summary: "Annuler une réservation",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Réservation annulée" },
            401: { description: "Token manquant" },
          },
        },
      },
      "/reservations/{id}/validate": {
        patch: {
          tags: ["Reservations"],
          summary: "Confirmer une réservation (admin)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Réservation confirmée" },
            400: { description: "Réservation déjà traitée" },
            403: { description: "Accès refusé" },
            404: { description: "Réservation introuvable" },
          },
        },
      },
      "/my-reservations": {
        get: {
          tags: ["Reservations"],
          summary: "Voir mes réservations",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "statut",
              in: "query",
              schema: { type: "string", enum: ["en_attente", "confirmed", "cancelled"] },
              description: "Filtrer par statut",
            },
            {
              name: "date",
              in: "query",
              schema: { type: "string", format: "date" },
              description: "Filtrer par date",
            },
          ],
          responses: {
            200: { description: "Liste de mes réservations" },
            401: { description: "Token manquant" },
          },
        },
      },
      "/menu": {
        get: {
          tags: ["Menu"],
          summary: "Voir le menu (public)",
          parameters: [
            {
              name: "categorie",
              in: "query",
              schema: { type: "string", enum: ["entree", "plat", "dessert", "boisson"] },
              description: "Filtrer par catégorie",
            },
            {
              name: "prix_max",
              in: "query",
              schema: { type: "number" },
              description: "Prix maximum",
            },
          ],
          responses: {
            200: { description: "Liste des plats" },
          },
        },
        post: {
          tags: ["Menu"],
          summary: "Ajouter un plat (admin)",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["nom", "prix"],
                  properties: {
                    nom: { type: "string", example: "Tarte aux pommes" },
                    description: { type: "string", example: "Tarte maison" },
                    prix: { type: "number", example: 7.5 },
                    categorie: { type: "string", example: "dessert" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Plat ajouté" },
            400: { description: "Champs manquants" },
            403: { description: "Accès refusé" },
          },
        },
      },
      "/menu/{id}": {
        put: {
          tags: ["Menu"],
          summary: "Modifier un plat (admin)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    nom: { type: "string", example: "Tarte aux poires" },
                    description: { type: "string", example: "Tarte revisitée" },
                    prix: { type: "number", example: 8.0 },
                    categorie: { type: "string", example: "dessert" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Plat modifié" },
            403: { description: "Accès refusé" },
            404: { description: "Plat introuvable" },
          },
        },
        delete: {
          tags: ["Menu"],
          summary: "Supprimer un plat (admin)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Plat supprimé" },
            403: { description: "Accès refusé" },
            404: { description: "Plat introuvable" },
          },
        },
      },
      "/tables": {
        get: {
          tags: ["Tables"],
          summary: "Voir les tables (public)",
          responses: {
            200: { description: "Liste des tables" },
          },
        },
        post: {
          tags: ["Tables"],
          summary: "Ajouter une table (admin)",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["numero", "capacite"],
                  properties: {
                    numero: { type: "integer", example: 6 },
                    capacite: { type: "integer", example: 8 },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Table ajoutée" },
            400: { description: "Champs manquants" },
            403: { description: "Accès refusé" },
          },
        },
      },
      "/tables/{id}": {
        put: {
          tags: ["Tables"],
          summary: "Modifier une table (admin)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    numero: { type: "integer", example: 6 },
                    capacite: { type: "integer", example: 12 },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Table modifiée" },
            403: { description: "Accès refusé" },
            404: { description: "Table introuvable" },
          },
        },
        delete: {
          tags: ["Tables"],
          summary: "Supprimer une table (admin)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Table supprimée" },
            403: { description: "Accès refusé" },
            404: { description: "Table introuvable" },
          },
        },
      },
      "/creneaux": {
        get: {
          tags: ["Creneaux"],
          summary: "Voir les créneaux (public)",
          parameters: [
            {
              name: "jour",
              in: "query",
              schema: { type: "string" },
              description: "Filtrer par jour (lundi, mardi, etc.)",
            },
          ],
          responses: {
            200: { description: "Liste des créneaux" },
          },
        },
        post: {
          tags: ["Creneaux"],
          summary: "Ajouter un créneau (admin)",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["jour", "heure_ouverture", "heure_fermeture"],
                  properties: {
                    jour: { type: "string", example: "jeudi" },
                    heure_ouverture: { type: "string", example: "11:30:00" },
                    heure_fermeture: { type: "string", example: "14:30:00" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Créneau ajouté" },
            400: { description: "Champs manquants" },
            403: { description: "Accès refusé" },
          },
        },
      },
      "/creneaux/{id}": {
        put: {
          tags: ["Creneaux"],
          summary: "Modifier un créneau (admin)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    jour: { type: "string", example: "jeudi" },
                    heure_ouverture: { type: "string", example: "12:00:00" },
                    heure_fermeture: { type: "string", example: "15:00:00" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Créneau modifié" },
            403: { description: "Accès refusé" },
            404: { description: "Créneau introuvable" },
          },
        },
        delete: {
          tags: ["Creneaux"],
          summary: "Supprimer un créneau (admin)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Créneau supprimé" },
            403: { description: "Accès refusé" },
            404: { description: "Créneau introuvable" },
          },
        },
      },
      "/disponibilites": {
        get: {
          tags: ["Disponibilites"],
          summary: "Vérifier les tables disponibles",
          parameters: [
            {
              name: "date",
              in: "query",
              required: true,
              schema: { type: "string", format: "date" },
              description: "Date (YYYY-MM-DD)",
            },
            {
              name: "time",
              in: "query",
              required: true,
              schema: { type: "string" },
              description: "Heure (HH:MM:SS)",
            },
          ],
          responses: {
            200: {
              description: "Tables disponibles",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      date: { type: "string", example: "2026-03-25" },
                      time: { type: "string", example: "19:00:00" },
                      tables_disponibles: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            id: { type: "integer" },
                            numero: { type: "integer" },
                            capacite: { type: "integer" },
                          },
                        },
                      },
                      capacite_totale_disponible: { type: "integer", example: 18 },
                    },
                  },
                },
              },
            },
            400: { description: "Paramètres date et time requis" },
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
