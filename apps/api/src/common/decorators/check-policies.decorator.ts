import { SetMetadata } from '@nestjs/common';
import { PolicyHandler } from '../../core/casl/policy-handler';

export const CHECK_POLICIES_KEY = 'checkPolicy';
export const CheckPolicies = (...handlers: PolicyHandler[]) =>
  SetMetadata(CHECK_POLICIES_KEY, handlers);
