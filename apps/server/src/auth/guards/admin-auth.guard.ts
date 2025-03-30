import { Injectable } from '@nestjs/common';
import { EmployeeScope } from '@prisma/client';
import { TemplateAuthGuard } from './template-auth.guard';

@Injectable()
export class AdminAuthGuard extends TemplateAuthGuard {
  constructor() {
    super([EmployeeScope.ADMIN]);
  }
}
