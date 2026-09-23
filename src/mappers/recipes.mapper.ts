import { NewRecipe, NewRecipeDTO, Recipe, RecipeDBO, RecipeDTO } from "../models/recipe.model";

export class RecipesMapper {
	/*
  static toDTO(recipe: Recipe): RecipeDTO {
    const dto: RecipeDTO = {
      id: recipe.id,
      title: recipe.title,
      description: recipe.description,
      prepTime: recipe.prepTime,
      cookTime: recipe.cookTime,
      servings: recipe.servings,
      difficulty: recipe.difficulty,
      categoryId: recipe.categoryId,
      tags: recipe.tags,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      authorId: recipe.authorId,
      createdAt: recipe.createdAt.toISOString(),
      updatedAt: recipe.updatedAt.toISOString(),
    };
    if (recipe.imageUrl !== undefined && recipe.imageUrl !== null) {
      dto.imageUrl = recipe.imageUrl;
    }
    return dto;
  }
*/

	static toDTO({ createdAt, updatedAt, imageUrl, ...recipeData }: Recipe): RecipeDTO {
		// Application du Destructuring de paramètre, Nullish Coalescing, Spread Operator et Optionnal Chaining
		return {
			...recipeData, // Spread Operator
			imageUrl: imageUrl ?? undefined, // Nullish Coalescing
			createdAt: createdAt?.toISOString(), // Optionnal Chaining
			updatedAt: updatedAt?.toISOString(), // Optionnal Chaining
		};
	}

	/*
	static fromNewDTO(dto: NewRecipeDTO, authorId: number): NewRecipe {
		return {
			title: dto.title.trim(),
			description: dto.description.trim(),
			imageUrl: dto.imageUrl,
			prepTime: dto.prepTime,
			cookTime: dto.cookTime,
			servings: dto.servings,
			difficulty: dto.difficulty,
			categoryId: dto.categoryId,
			tags: dto.tags ? dto.tags : [],
			ingredients: dto.ingredients,
			steps: dto.steps,
			authorId: authorId,
		};
	}
  */

	// Application du Destructuring, Spread Operator et Nullish Coalescing
	static fromNewDTO({ title, description, tags, ...dtoRecipe }: NewRecipeDTO, authorId: number): NewRecipe {
		return {
			...dtoRecipe,

			title: title.trim(),
			description: description.trim(),
			tags: tags ?? [],
			authorId,
		};
	}

	/*
	static toDBO(recipe: Recipe): RecipeDBO {
		return {
			id: recipe.id,
			title: recipe.title,
			description: recipe.description,
			image_url: recipe.imageUrl,
			prep_time: recipe.prepTime,
			cook_time: recipe.cookTime,
			servings: recipe.servings,
			difficulty: recipe.difficulty,
			category_id: recipe.categoryId,
			tags: recipe.tags,
			ingredients: recipe.ingredients,
			steps: recipe.steps,
			author_id: recipe.authorId,
			created_at: recipe.createdAt.toISOString(),
			updated_at: recipe.updatedAt.toISOString(),
		};
	}
  */

	// Application du Destructuring, conversion des propriétés camelCase et Spread Operator
	static toDBO({
		imageUrl,
		prepTime,
		cookTime,
		categoryId,
		authorId,
		createdAt,
		updatedAt,
		...recipeData
	}: Recipe): RecipeDBO {
		return {
			...recipeData,
			image_url: imageUrl,
			prep_time: prepTime,
			cook_time: cookTime,
			category_id: categoryId,
			author_id: authorId,
			created_at: createdAt.toISOString(),
			updated_at: updatedAt.toISOString(),
		};
	}

	/*
	static fromDBO(dbo: RecipeDBO): Recipe {
		return {
			id: dbo.id,
			title: dbo.title,
			description: dbo.description,
			imageUrl: dbo.image_url,
			prepTime: dbo.prep_time,
			cookTime: dbo.cook_time,
			servings: dbo.servings,
			difficulty: dbo.difficulty,
			categoryId: dbo.category_id,
			tags: dbo.tags ? dbo.tags : [],
			ingredients: dbo.ingredients ? dbo.ingredients : [],
			steps: dbo.steps ? dbo.steps : [],
			authorId: dbo.author_id,
			createdAt: new Date(dbo.created_at),
			updatedAt: new Date(dbo.updated_at),
		};
	}*/

	// Application du Destructuring, Nullishing Coalescing et reconstruction d'objet
	static fromDBO({
		image_url,
		prep_time,
		cook_time,
		category_id,
		tags,
		ingredients,
		steps,
		author_id,
		created_at,
		updated_at,
		...dboRecipe
	}: RecipeDBO): Recipe {
		return {
			...dboRecipe,
			imageUrl: image_url,
			prepTime: prep_time,
			cookTime: cook_time,
			categoryId: category_id,

			// Nullishing Coalescing
			tags: tags ?? [],
			ingredients: ingredients ?? [],
			steps: steps ?? [],

			authorId: author_id,
			createdAt: new Date(created_at),
			updatedAt: new Date(updated_at),
		};
	}
}
