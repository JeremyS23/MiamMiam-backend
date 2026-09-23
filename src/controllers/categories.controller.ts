import { Request, Response, Router } from "express";
import { CategoriesMapper } from "../mappers/categories.mapper";
import { CategoryDTO } from "../models/category.model";
import { CategoriesService } from "../services/categories.service";
import { LoggerService } from "../services/logger.service";

export const categoriesController = Router();

/**
 * GET /categories
 * Toutes les catégories
 */
categoriesController.get("/", (req: Request, res: Response) => {
	LoggerService.info("[GET] /categories");

	const categories = CategoriesService.getAll();

	//const categoriesDTO: CategoryDTO[] = [];

	/*
  for (const category of categories) {
    categoriesDTO.push(CategoriesMapper.toDTO(category));
  }
  */

	// Programmation fonctionnelle avec .map()
	const categoriesDTO = categories.map(CategoriesMapper.toDTO);

	return res.status(200).json(categoriesDTO);
});

/**
 * GET /categories/:id
 * Une catégorie
 */
categoriesController.get("/:id", (req: Request, res: Response) => {
	LoggerService.info("[GET] /categories/:id");

	// const id = Number(req.params.id);

	// Destructuring de req.params puis conversion en number
	const { id } = req.params;
	const categoryId = Number(id);

	if (!Number.isInteger(categoryId) || categoryId < 1) return res.sendStatus(400);

	const category = CategoriesService.getById(categoryId);

	if (!category) return res.sendStatus(404);

	return res.status(200).json(CategoriesMapper.toDTO(category));
});
