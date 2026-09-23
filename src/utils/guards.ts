import { NewRecipeDTO, UpdatedRecipeDTO } from "../models/recipe.model";
import { CredentialsDTO, NewUserDTO } from "../models/user.model";

/**
 * Type guards : fonctions qui vérifient à l'exécution qu'une valeur inconnue
 * (typiquement req.body ou req.params) a bien la forme attendue.
 * Si la fonction renvoie true, TypeScript considère la valeur comme du type indiqué.
 */

export function isNumber(obj: any): obj is number {
	return typeof obj === "number" && !isNaN(obj) && isFinite(obj);
}

export function isString(obj: any): obj is string {
	return typeof obj === "string";
}

export function isNonEmptyString(obj: any): obj is string {
	//return isString(obj) && obj.trim().length !== 0;

	return typeof obj === "string" && obj.trim().length !== 0;
}

export function isObject(obj: any): obj is object {
	return typeof obj === "object" && obj !== null;
}

// == USER ==

/*export function isNewUserDTO(obj: any): obj is NewUserDTO {

  return (
    isObject(obj) &&
    isNonEmptyString((obj as any).email) &&
    (obj as any).email.includes("@") &&
    isNonEmptyString((obj as any).password) &&
    isNonEmptyString((obj as any).firstName) &&
    isNonEmptyString((obj as any).lastName)
  );
  */

export function isNewUserDTO(obj: any): obj is NewUserDTO {
	if (!isObject(obj)) {
		return false;
	}

	const { email, password, firstName, lastName } = obj as any;

	return (
		isNonEmptyString(email) &&
		email.includes("@") &&
		isNonEmptyString(password) &&
		isNonEmptyString(firstName) &&
		isNonEmptyString(lastName)
	);
}

export function isCredentialsDTO(obj: any): obj is CredentialsDTO {
	//return isObject(obj) && isNonEmptyString((obj as any).email) && isNonEmptyString((obj as any).password);

	if (!isObject(obj)) {
		return false;
	}

	const { email, password } = obj as any;

	return isNonEmptyString(email) && isNonEmptyString(password);
}

// == RECIPE ==

/*
export function isNewRecipeDTO(obj: any): obj is NewRecipeDTO {
	if (!isObject(obj)) return false;
	const recipe = obj as any;
	if (!isNonEmptyString(recipe.title)) return false;
	if (!isString(recipe.description)) return false;
	if (recipe.imageUrl !== undefined && !isString(recipe.imageUrl)) return false;
	if (!isNumber(recipe.prepTime) || recipe.prepTime < 0) return false;
	if (!isNumber(recipe.cookTime) || recipe.cookTime < 0) return false;
	if (!isNumber(recipe.servings) || recipe.servings < 1) return false;
	if (!isNumber(recipe.difficulty) || recipe.difficulty < 1 || recipe.difficulty > 5) return false;
	if (!isNumber(recipe.categoryId)) return false;
	if (recipe.tags !== undefined && !Array.isArray(recipe.tags)) return false;
	if (!Array.isArray(recipe.ingredients)) return false;
	if (!Array.isArray(recipe.steps)) return false;
	return true;
}
*/

export function isNewRecipeDTO(obj: any): obj is NewRecipeDTO {
	if (!isObject(obj)) {
		return false;
	}

	const {
		title,
		description,
		imageUrl,
		prepTime,
		cookTime,
		servings,
		difficulty,
		categoryId,
		tags,
		ingredients,
		steps,
	} = obj as any;

	return (
		isNonEmptyString(title) &&
		isNonEmptyString(description) &&
		(imageUrl === undefined || isString(imageUrl)) &&
		isNumber(prepTime) &&
		prepTime >= 0 &&
		isNumber(cookTime) &&
		cookTime >= 0 &&
		isNumber(servings) &&
		servings >= 1 &&
		isNumber(difficulty) &&
		difficulty >= 1 &&
		difficulty <= 5 &&
		isNumber(categoryId) &&
		(tags === undefined || Array.isArray(tags)) &&
		Array.isArray(ingredients) &&
		Array.isArray(steps)
	);
}

// Type guard pour valider le corps d'une requête PATCH (UpdatedRecipeDTO).
export function isUpdatedRecipeDTO(obj: any): obj is UpdatedRecipeDTO {
	if (!isObject(obj) || Object.keys(obj).length === 0) {
		return false;
	}

	const {
		title,
		description,
		imageUrl,
		prepTime,
		cookTime,
		servings,
		difficulty,
		categoryId,
		tags,
		ingredients,
		steps,
	} = obj as any;

	return (
		(title === undefined || isNonEmptyString(title)) &&
		(description === undefined || isNonEmptyString(description)) &&
		(imageUrl === undefined || isString(imageUrl)) &&
		(prepTime === undefined || (isNumber(prepTime) && prepTime >= 0)) &&
		(cookTime === undefined || (isNumber(cookTime) && prepTime >= 0)) &&
		(servings === undefined || (isNumber(servings) && prepTime >= 1)) &&
		(difficulty === undefined || (isNumber(difficulty) && difficulty >= 1 && difficulty <= 5)) &&
		(categoryId === undefined || isNumber(categoryId)) &&
		(tags === undefined || Array.isArray(tags)) &&
		(ingredients === undefined || Array.isArray(ingredients)) &&
		(steps === undefined || Array.isArray(steps))
	);
}
