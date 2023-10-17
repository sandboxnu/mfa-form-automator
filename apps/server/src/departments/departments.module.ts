import { Module } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { DepartmentsController } from './departments.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtStrategy } from '@server/auth/strategies/jwt.strategy';

@Module({
  controllers: [DepartmentsController],
  providers: [DepartmentsService, JwtStrategy],
  imports: [PrismaModule],
})
export class DepartmentsModule {}
