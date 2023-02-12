import { Controller, Post, Body, Get } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBody, ApiOkResponse } from "@nestjs/swagger";
import { EmployeeService } from "./employee.service";

@Controller('employees')
@ApiTags('Employees')
export class EmployeeController {
  constructor(private readonly emploreeService: EmployeeService) {}

}
