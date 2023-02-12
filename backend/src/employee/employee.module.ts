import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Employee } from "src/models/employee.entity";
import { EmployeeController } from "./employee.controller";
import { EmployeeService } from "./employee.service";

@Module({
    imports: [TypeOrmModule.forFeature([Employee])],
    exports: [EmployeeService],
    providers: [EmployeeService],
    controllers: [EmployeeController]
})
export class EmployeeModule {};
