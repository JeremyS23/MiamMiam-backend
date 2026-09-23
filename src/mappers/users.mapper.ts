import { NewUser, NewUserDTO, User, UserDBO, UserDTO, UserShortDTO } from "../models/user.model";

export class UsersMapper {
	/*
  static toDTO(user: User): UserDTO {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      favorites: user.favorites,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
  */

	// Destructuring du paramètre et Spread Operator pour conserver les propriétés identiques
	static toDTO({ createdAt, updatedAt, ...userData }: User): UserDTO {
		return {
			...userData,
			createdAt: createdAt.toISOString(),
			updatedAt: updatedAt.toISOString(),
		};
	}

	/*
	static toShortDTO(user: User): UserShortDTO {
		return {
			id: user.id,
			firstName: user.firstName,
			lastName: user.lastName,
		};
	}
  */

	// Destructuring direct des 3 propriétés requises
	static toShortDTO({ id, firstName, lastName }: User): UserShortDTO {
		return {
			id,
			firstName,
			lastName,
		};
	}

	/*
	static fromNewDTO(dto: NewUserDTO): NewUser {
		return {
			email: dto.email.trim().toLowerCase(),
			password: dto.password,
			firstName: dto.firstName.trim(),
			lastName: dto.lastName.trim(),
		};
	}
  */

	// Destructuring des paramètres et propagation du reste (ex: password)
	static fromNewDTO({ email, firstName, lastName, ...UserDTOdata }: NewUserDTO): NewUser {
		return {
			...UserDTOdata,
			email: email.trim().toLowerCase(),
			firstName: firstName.trim(),
			lastName: lastName.trim(),
		};
	}

	/*
	static toDBO(user: User): UserDBO {
		return {
			id: user.id,
			email: user.email,
			password: user.password,
			first_name: user.firstName,
			last_name: user.lastName,
			role: user.role,
			favorites: user.favorites,
			created_at: user.createdAt.toISOString(),
			updated_at: user.updatedAt.toISOString(),
		};
	}
  */

	// Destructuring des champs à convertir en snake_case et Spread Operator pour le reste
	static toDBO({ firstName, lastName, createdAt, updatedAt, ...userData }: User): UserDBO {
		return {
			...userData,
			first_name: firstName,
			last_name: lastName,
			created_at: createdAt.toISOString(),
			updated_at: updatedAt.toISOString(),
		};
	}

	/*
	static fromDBO(dbo: UserDBO): User {
		return {
			id: dbo.id,
			email: dbo.email,
			password: dbo.password,
			firstName: dbo.first_name,
			lastName: dbo.last_name,
			role: dbo.role,
			favorites: dbo.favorites ? dbo.favorites : [],
			createdAt: new Date(dbo.created_at),
			updatedAt: new Date(dbo.updated_at),
		};
	}
  */

	// Destructuring, conversion snake_case -> CamelCase et Nullish Coalescing
	static fromDBO({ first_name, last_name, favorites, created_at, updated_at, ...userDBOdata }: UserDBO): User {
		return {
			...userDBOdata,
			firstName: first_name,
			lastName: last_name,
			favorites: favorites ?? [],
			createdAt: new Date(created_at),
			updatedAt: new Date(updated_at),
		};
	}
}
