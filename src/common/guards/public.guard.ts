
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_API = 'isPublic';
/* a decorator named Public function to set the metadata for public API endpoints */
export const Public = () => SetMetadata(IS_PUBLIC_API, true);
