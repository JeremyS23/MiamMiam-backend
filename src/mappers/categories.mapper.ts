import { Category, CategoryDBO, CategoryDTO } from "../models/category.model";

export class CategoriesMapper {
	/*
	static toDTO(category: Category): CategoryDTO {
		return {
			id: category.id,
			name: category.name,
			description: category.description,
		};
	}
	*/

	// Application du destructuring de paramètre
	static toDTO({ id, name, description }: Category): CategoryDTO {
		return { id, name, description };
	}

	/*
  static toDBO(category: Category): CategoryDBO {
    return {
      id: category.id,
      name: category.name,
      description: category.description,
      created_at: category.createdAt.toISOString(),
      updated_at: category.updatedAt.toISOString(),
    };
  }
  */

	// Application du Spread Operator et du Destructuring
	static toDBO({ createdAt, updatedAt, ...categoryData }: Category): CategoryDBO {
		return {
			...categoryData,
			created_at: createdAt.toISOString(),
			updated_at: updatedAt.toISOString(),
		};
	}

	/*
	static fromDBO(dbo: CategoryDBO): Category {
		return {
			id: dbo.id,
			name: dbo.name,
			description: dbo.description,
			createdAt: new Date(dbo.created_at),
			updatedAt: new Date(dbo.updated_at),
		};
	}
    */

	static fromDBO({ created_at, updated_at, ...categoryDBOData }: CategoryDBO): Category {
		return {
			...categoryDBOData,
			createdAt: new Date(created_at),
			updatedAt: new Date(updated_at),
		};
	}
}
