import { Request } from "express";
//import { User } from "./user.model";

/**
 * Requête Express enrichie par le middleware AuthService.authorize :
 * après ce middleware, req.user contient l'utilisateur authentifié.
 */
export interface AuthenticatedRequest extends Request {
	// Contient uniquement les données minimales transmises par le token (id, email, role) et non l'entité User complète
  user?: TokenPayload;
}

/**
 * Payload contenu dans le token JWT après décodage
 */
export interface TokenPayload {
	id: number;
	email: string;
	role: string;
}
