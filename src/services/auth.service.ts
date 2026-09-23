import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../models/auth.model";
import { ERole, User } from "../models/user.model";
//import { generateFakeToken, validateFakeToken } from "../utils/auth";
import { generateToken, verifyToken } from "../utils/auth";
import { LoggerService } from "./logger.service";
import { UsersService } from "./users.service";

export class AuthService {
	/**
	 * Vérifie les identifiants et génère un JWT valide
	 * @returns un token si l'email et le mot de passe sont corrects, undefined sinon
	 */
	static login(email: string, password: string): string | undefined {
		const user = UsersService.getByEmail(email);

		if (!user || user.password !== password) {
			return undefined;
		}

		//return generateFakeToken(user.email);

		return generateToken({
			id: user.id,
			email: user.email,
			role: user.role,
		});
	}

	/**
	 * Middleware : vérifie le header Authorization et injecte le payload JWT dans req.user.
	 * Répond 401 si le token est absent ou invalide.
	 */
	static authorize(req: AuthenticatedRequest, res: Response, next: NextFunction) {
		// Récupération du token depuis le header HTTP Authorization
		const token = req.get("Authorization");
		if (!token) {
			LoggerService.error("Missing Authorization header");
			return res.sendStatus(401);
		}

		// Verification et extraction du payload du token JWT
		const payload = verifyToken(token);
		if (!payload) {
			LoggerService.error("Invalid token");
			return res.sendStatus(401);
		}

		// Récupération de l'utilisateur en base de données à partir de l'email extrait
		const user = UsersService.getByEmail(payload.email);
		if (!user) {
			LoggerService.error("User not found from token");
			return res.sendStatus(401);
		}

		// On stocke directement les données décodées du JWT (Sans requête DB) dans la requête Express
		req.user = payload;
		return next();
	}

	/**
	 * Middleware (à placer après authorize) : n'autorise que les administrateurs.
	 * Répond 403 sinon.
	 */
	static isAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
		
		// Vérification de la présence de req.user et du rôle administrateur
		if (req.user?.role !== ERole.ADMIN) {
			return res.sendStatus(req.user ? 403 : 401);
		}

		return next();
	}
}
