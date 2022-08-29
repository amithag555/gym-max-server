import { SetMetadata } from '@nestjs/common';
import { AuthorizableOriginParameter } from 'src/auth/authorizable-origin-parameter.enum';

export const AuthorizeContext = (parameterType: AuthorizableOriginParameter) =>
  SetMetadata<string, AuthorizableOriginParameter>(
    'authorizationContext',
    parameterType,
  );
