import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { EmployeesModule } from './employees/employees.module';
import { PositionsModule } from './positions/positions.module';
import { SignatureFieldsModule } from './signature-fields/signature-fields.module';
import { SignaturesModule } from './signatures/signatures.module';
import { FormInstancesModule } from './form-instances/form-instances.module';
import { FormTemplatesModule } from './form-templates/form-templates.module';
import { DepartmentsModule } from './departments/departments.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PrismaModule,
    EmployeesModule,
    PositionsModule,
    SignatureFieldsModule,
    SignaturesModule,
    FormInstancesModule,
    FormTemplatesModule,
    DepartmentsModule,
    ConfigModule.forRoot({
      envFilePath: './../../server/.env',
    }),
    AuthModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: `${process.env.JWT_VALID_DURATION}s` },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,

    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
  ],
})
export class AppModule { }
