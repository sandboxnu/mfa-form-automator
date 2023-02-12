import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EmployeeModule } from "src/employee/employee.module";
import { FormModule } from "src/form/form.module";
import { FormInstance } from "../models/formInstance.entity";
import { FormInstanceController } from "./formInstance.controller";
import { FormInstanceService } from "./formInstance.service";

@Module({
    imports: [TypeOrmModule.forFeature([FormInstance]), EmployeeModule, FormModule],
    exports: [],
    providers: [FormInstanceService],
    controllers: [FormInstanceController]
})
export class FormInstanceModule {};
