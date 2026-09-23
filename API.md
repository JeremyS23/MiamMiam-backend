# API MiamMiam - Documentation

## GET /recipes
- **Description** : Récupère la liste de toutes les recettes avec filtres cumulatifs optionnels.
- **Paramètres de requête (Query parameters)** :
  - `categoryId` (number, optionnel) : Filtre par identifiant de catégorie.
  - `authorId` (number, optionnel) : Filtre par identifiant d'auteur.
  - `search` (string, optionnel) : Filtre par terme recherché dans le titre ou la description.
  - `ingredient` (string, optionnel) : Filtre par nom d'ingrédient.
  - `maxPrepTime` (number, optionnel) : Temps de préparation et cuisson combiné maximal (en minutes).
- **Réponses** :
  - `200 OK` : Tableau d'objets `RecipeDTO`.
  - `400 Bad Request` : Un ou plusieurs paramètres de requête sont invalides.

## GET /recipes/:id
- **Description** : Récupère une recette spécifique par son identifiant.
- **Paramètres de chemin (Path parameters)** :
  - `id` (number, requis) : Identifiant unique de la recette.
- **Réponses** :
  - `200 OK` : Objet `RecipeDTO`.
  - `400 Bad Request` : Identifiant invalide (non entier ou < 1).
  - `404 Not Found` : Aucune recette ne correspond à cet ID.

## POST /recipes
- **Description** : Crée une nouvelle recette. L'utilisateur connecté devient l'auteur.
- **Authentification** : Requise (Bearer Token JWT).
- **Corps de la requête (Body)** : Objet `NewRecipeDTO`.
- **Réponses** :
  - `201 Created` : Recette créée (renvoie le `RecipeDTO`).
  - `400 Bad Request` : Corps de requête invalide ou catégorie inexistante.
  - `401 Unauthorized` : Jeton d'authentification absent ou invalide.
  - `500 Internal Server Error` : Erreur de persistance lors de l'écriture en base.

## PUT /recipes/:id
- **Description** : Remplace intégralement une recette existante (auteur ou administrateur uniquement).
- **Authentification** : Requise (Bearer Token JWT).
- **Paramètres de chemin (Path parameters)** :
  - `id` (number, requis) : Identifiant unique de la recette à remplacer.
- **Corps de la requête (Body)** : Objet `NewRecipeDTO`.
- **Réponses** :
  - `204 No Content` : Recette mise à jour avec succès.
  - `400 Bad Request` : ID invalide, données corps invalides ou catégorie inexistante.
  - `401 Unauthorized` : Non authentifié.
  - `403 Forbidden` : Accès refusé (l'utilisateur n'est ni l'auteur ni admin).
  - `404 Not Found` : Recette introuvable.
  - `500 Internal Server Error` : Erreur lors de l'écriture en base.

## PATCH /recipes/:id
- **Description** : Met à jour partiellement une recette existante (auteur ou administrateur uniquement).
- **Authentification** : Requise (Bearer Token JWT).
- **Paramètres de chemin (Path parameters)** :
  - `id` (number, requis) : Identifiant de la recette.
- **Corps de la requête (Body)** : Objet `UpdatedRecipeDTO` (toutes les propriétés sont optionnelles).
- **Réponses** :
  - `200 OK` : Renvoie la recette mise à jour (`RecipeDTO`).
  - `400 Bad Request` : ID invalide, corps vide ou données invalides.
  - `401 Unauthorized` : Non authentifié.
  - `403 Forbidden` : Accès refusé (l'utilisateur n'est ni l'auteur ni admin).
  - `404 Not Found` : Recette introuvable.
  - `500 Internal Server Error` : Échec d'enregistrement des modifications.

## DELETE /recipes/:id
- **Description** : Supprime une recette existante (auteur ou administrateur uniquement).
- **Authentification** : Requise (Bearer Token JWT).
- **Paramètres de chemin (Path parameters)** :
  - `id` (number, requis) : Identifiant de la recette à supprimer.
- **Réponses** :
  - `204 No Content` : Recette supprimée avec succès.
  - `400 Bad Request` : ID de la recette invalide.
  - `401 Unauthorized` : Non authentifié.
  - `403 Forbidden` : Accès refusé.
  - `404 Not Found` : Recette non trouvée.
  - `500 Internal Server Error` : Échec de la suppression.