import { Module } from '@nestjs/common';
import { Form } from 'src/models/form.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormController } from './form.controller';
import { FormService } from './form.service';

@Module({
  imports: [TypeOrmModule.forFeature([Form])],
  exports: [FormService],
  providers: [FormService],
  controllers: [FormController],
})
export class FormModule {}
