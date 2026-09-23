import { Request, Response, Router } from "express";
import { RecipesMapper } from "../mappers/recipes.mapper";
import { AuthenticatedRequest } from "../models/auth.model";
import { RecipeDTO, RecipeFilter } from "../models/recipe.model";
import { ERole } from "../models/user.model";
import { AuthService } from "../services/auth.service";
import { CategoriesService } from "../services/categories.service";
import { LoggerService } from "../services/logger.service";
import { RecipesService } from "../services/recipes.service";
import { isNewRecipeDTO, isString, isUpdatedRecipeDTO } from "../utils/guards";

export const recipesController = Router();

/**
 * GET /recipes?categoryId=&authorId=&search=&ingredient=&maxPrepTime=
 * Toutes les recettes, éventuellement filtrées par les query parameters
 */
recipesController.get("/", (req: Request, res: Response) => {
	LoggerService.info("[GET] /recipes");

	// Initialisation de l'objet qui contiendra les critères de filtrage
	const filter: RecipeFilter = {};

	// Destructuring de req.query
	const { categoryId, authorId, search, ingredient, maxPrepTime } = req.query;

	// Utilisation directe des variables destructurées

	if (isString(categoryId)) {
		const parsedCategoryId = Number(categoryId);
		if (!Number.isInteger(parsedCategoryId)) return res.sendStatus(400);
		filter.categoryId = parsedCategoryId;
	}

	if (isString(authorId)) {
		const parsedAuthorId = Number(authorId);
		if (!Number.isInteger(parsedAuthorId)) return res.sendStatus(400);
		filter.authorId = parsedAuthorId;
	}

	if (isString(search) && search.trim() !== "") {
		filter.search = search.trim();
	}

	if (isString(ingredient) && ingredient.trim() !== "") {
		filter.ingredient = ingredient.trim();
	}

	if (isString(maxPrepTime)) {
		const parsedMaxPrepTime = Number(maxPrepTime);
		if (!Number.isInteger(parsedMaxPrepTime) || parsedMaxPrepTime < 0) return res.sendStatus(400);
		filter.maxPrepTime = parsedMaxPrepTime;
	}

	const recipes = RecipesService.getAll(filter);

	/*
  const recipesDTO: RecipeDTO[] = [];
  
  for (const recipe of recipes) {
    recipesDTO.push(RecipesMapper.toDTO(recipe));
  }
  */

	const recipesDTO = recipes.map(RecipesMapper.toDTO);

	return res.status(200).json(recipesDTO);
});

/**
 * GET /recipes/:id
 * Une recette
 */
recipesController.get("/:id", (req: Request, res: Response) => {
	LoggerService.info("[GET] /recipes/:id");

	//const id = Number(req.params.id);

	// Destructuring de req.params puis conversion en number
	const { id } = req.params;
	const recipeId = Number(id);

	if (!Number.isInteger(recipeId) || recipeId < 1) return res.sendStatus(400);

	const recipe = RecipesService.getById(recipeId);

	if (!recipe) return res.sendStatus(404);

	return res.status(200).json(RecipesMapper.toDTO(recipe));
});

/**
 * POST /recipes
 * Crée une recette (utilisateur connecté = auteur)
 */
recipesController.post("/", AuthService.authorize, (req: AuthenticatedRequest, res: Response) => {
	LoggerService.info("[POST] /recipes");

	//const user = req.user;

	const { user, body } = req;

	if (!user) return res.sendStatus(401);

	//const body: unknown = req.body;

	if (!isNewRecipeDTO(body)) return res.sendStatus(400);
	if (!CategoriesService.getById(body.categoryId)) return res.sendStatus(400); // catégorie inconnue

	const newRecipe = RecipesMapper.fromNewDTO(body, user.id);
	const recipe = RecipesService.create(newRecipe);
	if (!recipe) return res.sendStatus(500);

	return res.status(201).json(RecipesMapper.toDTO(recipe));
});

/**
 * PUT /recipes/:id
 * Remplace une recette (auteur ou admin uniquement)
 */
recipesController.put("/:id", AuthService.authorize, (req: AuthenticatedRequest, res: Response) => {
	LoggerService.info("[PUT] /recipes/:id");

	const { user, body, params } = req;

	if (!user) return res.sendStatus(401);

	const recipeId = Number(params.id);

	//const user = req.user;

	//const id = Number(req.params.id);
	if (!Number.isInteger(recipeId) || recipeId < 1) return res.sendStatus(400);

	//const body: unknown = req.body;

	//Déplacement de cette ligne pour plus de cohérence!
	//if (!isNewRecipeDTO(body)) return res.sendStatus(400);

	const recipe = RecipesService.getById(recipeId);
	if (!recipe) return res.sendStatus(404);

	// Contrôle des autorisations : seul le créateur ou un administrateur peut modifier
	if (recipe.authorId !== user.id && user.role !== ERole.ADMIN) return res.sendStatus(403);

	if (!isNewRecipeDTO(body)) return res.sendStatus(400);

	if (!CategoriesService.getById(body.categoryId)) return res.sendStatus(400); // catégorie inconnue

	const updated = RecipesService.update(recipeId, RecipesMapper.fromNewDTO(body, recipe.authorId));
	if (!updated) return res.sendStatus(500);

	return res.sendStatus(204);
});

/**
 * @route PATCH /recipes/:id
 * @summary Met à jour partiellement une recette (auteur ou admin uniquement)
 * @param {number} id.path - L'ID de la recette
 * @param {UpdatedRecipeDTO} req.body - Les données de la recette à mettre à jour
 * @returns {RecipeDTO} 200 - La recette mise à jour
 * @returns {400} - ID invalide ou données invalides
 * @returns {401} - Non autorisé
 * @returns {403} - Accès refusé
 * @returns {404} - Recette non trouvée
 */
recipesController.patch("/:id", AuthService.authorize, (req: AuthenticatedRequest, res: Response) => {
	LoggerService.info("[PATCH] /recipes/:id");

	const {
		user,
		body,
		params: { id },
	} = req;

	// Vérifiaction de l'authentification
	if (!user) {
		return res.sendStatus(401);
	}

	const recipeId = Number(id);

	// Validation du paramètre d'URL
	if (!Number.isInteger(recipeId) || recipeId < 1) {
		return res.sendStatus(400);
	}

	// Recherche de la recette
	const recipe = RecipesService.getById(recipeId);
	if (!recipe) {
		return res.sendStatus(404);
	}

	// Vérification des droits (auteur ou admin)
	if (recipe.authorId !== user.id && user.role !== ERole.ADMIN) {
		return res.sendStatus(403);
	}

	// Validation du format body transmis
	if (!isUpdatedRecipeDTO(body)) {
		return res.sendStatus(400);
	}

	// Vérification de la catégorie si elle est présente dans la mise à jour
	if (body.categoryId !== undefined && !CategoriesService.getById(body.categoryId)) {
		return res.sendStatus(400);
	}

	const patchedRecipe = RecipesService.patch(recipeId, body);

	// Si la recette existe et est mise à jour, on renvoie 200 avec le DTO, sinon 500
	return patchedRecipe ? res.status(200).json(RecipesMapper.toDTO(patchedRecipe)) : res.sendStatus(500);
});

/**
 * DELETE /recipes/:id
 * Supprime une recette (auteur ou admin uniquement)
 */
recipesController.delete("/:id", AuthService.authorize, (req: AuthenticatedRequest, res: Response) => {
	LoggerService.info("[DELETE] /recipes/:id");

	//const user = req.user;

	const { user, params } = req;

	if (!user) return res.sendStatus(401);

	//const id = Number(req.params.id);

	const recipeId = Number(params.id);

	if (!Number.isInteger(recipeId) || recipeId < 1) return res.sendStatus(400);

	const recipe = RecipesService.getById(recipeId);

	if (!recipe) return res.sendStatus(404);

	// Seul l'auteur de la recette ou un admin possède le droit de suppression
	if (recipe.authorId !== user.id && user.role !== ERole.ADMIN) return res.sendStatus(403);

	if (!RecipesService.delete(recipeId)) return res.sendStatus(500);

	return res.sendStatus(204);
});
