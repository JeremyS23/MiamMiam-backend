import { UsersMapper } from "../mappers/users.mapper";
import { ERole, NewUser, User, UserDBO } from "../models/user.model";
import { AbstractService } from "./abstract.service";
import { LoggerService } from "./logger.service";

export class UsersService extends AbstractService {
	protected static dbPath: string = "data/users.json";

	private static readUsersDB(): User[] {
		return UsersService.readDB<UserDBO, User>(UsersMapper.fromDBO);
	}

	private static writeUsersDB(users: User[]): boolean {
		return UsersService.writeDB<User, UserDBO>(users, UsersMapper.toDBO);
	}

	/**
	 * Tous les utilisateurs
	 */
	static getAll(): User[] {
		return this.readUsersDB();
	}

	/**
	 * Un utilisateur par son id, ou undefined s'il n'existe pas
	 */
	static getById(id: number): User | undefined {
		/*
    const users = this.readUsersDB();
    for (const user of users) {
      if (user.id === id) {
        return user;
      }
    }
    */

		return this.readUsersDB().find((user) => user.id === id);
	}

	/**
	 * Un utilisateur par son email (insensible à la casse), ou undefined s'il n'existe pas
	 */
	static getByEmail(email: string): User | undefined {
		/*
    const users = this.readUsersDB();
		for (const user of users) {
			if (user.email.toLowerCase() === email.toLowerCase()) {
				return user;
			}
		}
    */

		return this.readUsersDB().find((user) => user.email.toLowerCase() === email.toLowerCase());
	}

	/**
	 * Crée un utilisateur (rôle "user" par défaut).
	 * @returns l'utilisateur créé, ou undefined si l'email est déjà utilisé
	 */
	static create(newUser: NewUser): User | undefined {
		const users = this.readUsersDB();

		/*
		if (this.getByEmail(newUser.email)) {
			LoggerService.error("Email already exists: " + newUser.email);
			return undefined;
		}
		*/

		// Vérifie si l'email existe déjà dans la base (insensible à la casse).
		// L'opérateur optional chaining (?.) évite un crash si un utilisateur du JSON ou le newUser a un email absent/undefined.
		const emailExists = users.some((user) => user?.email?.toLowerCase() === newUser?.email?.toLowerCase());

		if (emailExists) {
			LoggerService.error("Email already exists: " + newUser.email);
			return undefined;
		}

		/*
		const user: User = {
			id: UsersService.getNextId(users),
			email: newUser.email,
			password: newUser.password, // stocké tel quel... pour l'instant
			firstName: newUser.firstName,
			lastName: newUser.lastName,
			role: ERole.USER,
			favorites: [],
			createdAt: new Date(),
			updatedAt: new Date(),
		};
    */

		const user: User = {
			...newUser,
			id: UsersService.getNextId(users),
			role: ERole.USER,
			favorites: [],
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		users.push(user);
		if (!this.writeUsersDB(users)) {
			return undefined;
		}

		return user;
	}

	/**
	 * Supprime un utilisateur.
	 * @returns true si supprimé, false s'il n'existait pas
	 */
	static delete(id: number): boolean {
		const users = this.readUsersDB();
		const index = users.findIndex((user) => user.id === id);
		if (index === -1) return false;

		users.splice(index, 1);
		return this.writeUsersDB(users);
	}

	/**
	 * Ajoute une recette aux favoris d'un utilisateur (sans doublon).
	 * @returns l'utilisateur mis à jour, ou undefined s'il n'existe pas
	 */
	static addFavorite(userId: number, recipeId: number): User | undefined {
		const users = this.readUsersDB();
		const user = users.find((u) => u.id === userId);
		if (!user) return undefined;

		if (!user.favorites.includes(recipeId)) {
			user.favorites.push(recipeId);
			user.updatedAt = new Date();
			if (!this.writeUsersDB(users)) return undefined;
		}
		return user;
	}

	/**
	 * Retire une recette des favoris d'un utilisateur.
	 * @returns l'utilisateur mis à jour, ou undefined s'il n'existe pas
	 */
	static removeFavorite(userId: number, recipeId: number): User | undefined {
		const users = this.readUsersDB();
		const user = users.find((u) => u.id === userId);
		if (!user) return undefined;

		/*
		const index = user.favorites.indexOf(recipeId);
		if (index !== -1) {
			user.favorites.splice(index, 1);
			user.updatedAt = new Date();
			if (!this.writeUsersDB(users)) return undefined;
		}
    */

		if (user.favorites.includes(recipeId)) {
			user.favorites = user.favorites.filter((id) => id !== recipeId);
			user.updatedAt = new Date();

			if (!this.writeUsersDB(users)) {
				return undefined;
			}
		}

		return user;
	}

	/**
	 * Retire une recette des favoris de tous les utilisateurs (quand la recette est supprimée)
	 */
	static removeFavoriteForAll(recipeId: number): boolean {
		const users = this.readUsersDB();

		// Vérification préalable : est-ce qu'au moins un utilisateur possède cette recette en favori ?
		const hasFavorite = users.some((user) => user.favorites?.includes(recipeId));

		/*
		for (const user of users) {
			if (user.favorites.includes(recipeId)) {
				user.favorites = user.favorites.filter((id) => id !== recipeId);
				user.updatedAt = new Date();
				isModified = true;
			}
		}
		*/

		// Si personne ne l'a en favori (!hasFavorite = true), on s'arrête ici ;
		// si au moins un l'a (!hasFavorite = false), la condition saute et le code continue vers le .map().
		if (!hasFavorite) return true;

		// Mise à jour immuable des utilisateurs concernés
		const updatedUsers = users.map((user) => {
			if (!user.favorites?.includes(recipeId)) {
				return user; // Utilisateur non impacté, retourné tel quel
			}

			// Mise à jour immuable des utilisateurs concernés
			return {
				...user,
				favorites: user.favorites.filter((id) => id !== recipeId),
				updatedAt: new Date(),
			};
		});

		// Sauvegarde des modifications
		return this.writeUsersDB(updatedUsers);
	}
}
