import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { config } from './config/config';
import { DatabaseConfig } from './config/database.config';
import { FormModule } from './form/form.module';
import { FormInstanceModule } from './formInstance/formInstance.module';
import { PositionModule } from './position/position.module';
import { SignatureChainModule } from './signatureChain/signatureChain.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseConfig,
    }),
    PositionModule,
    FormModule,
    FormInstanceModule,
    SignatureChainModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
