import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FormInstance } from "../models/formInstance.entity";
import { FormInstanceController } from "./formInstance.controller";
import { FormInstanceService } from "./formInstance.service";

@Module({
    imports: [TypeOrmModule.forFeature([FormInstance])],
    exports: [],
    providers: [FormInstanceService],
    controllers: [FormInstanceController]
})
export class FormInstanceModule {};