import { Injectable } from '@nestjs/common';
import { EmployeeScope } from '@prisma/client';
import { TemplateAuthGuard } from './template-auth.guard';

@Injectable()
export class ContributorAuthGuard extends TemplateAuthGuard {
  constructor() {
    super([EmployeeScope.ADMIN, EmployeeScope.CONTRIBUTOR]);
  }
}
