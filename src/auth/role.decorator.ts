import { SetMetadata } from '@nestjs/common';
import { Role } from '../user/entities/user.entity';

export type AllowedRoles = keyof typeof Role | 'Any';

export const RoleOf = (roles: AllowedRoles[]) => SetMetadata('roles', roles);
