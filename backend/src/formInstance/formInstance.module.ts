import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FormModule } from "../form/form.module";
import { PositionModule } from "../position/position.module";
import { FormInstance } from "../models/formInstance.entity";
import { FormInstanceController } from "./formInstance.controller";
import { FormInstanceService } from "./formInstance.service";

@Module({
    imports: [TypeOrmModule.forFeature([FormInstance]), PositionModule, FormModule],
    exports: [],
    providers: [FormInstanceService],
    controllers: [FormInstanceController]
})
export class FormInstanceModule {}
