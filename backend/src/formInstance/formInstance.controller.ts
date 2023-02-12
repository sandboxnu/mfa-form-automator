import { Body, Controller, HttpException, HttpStatus, Post } from "@nestjs/common";
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { EmployeeService } from "src/employee/employee.service";
import { FormService } from "src/form/form.service";
import { FormInstance } from "src/models/formInstance.entity";
import { CreateFormInstanceDto, FormInstanceDto } from "./formInstance.dto";
import { FormInstanceService } from "./formInstance.service";

@Controller('formInstances')
@ApiTags('Form Instances')
export class FormInstanceController {
    constructor(
        private readonly formInstanceService: FormInstanceService,
        private readonly employeeService: EmployeeService,
        private readonly formService: FormService
    ) {}
    
    @Post()
    @ApiOperation({ summary: 'Creates a new FormInstance' })
    @ApiBody({ type: CreateFormInstanceDto })
    @ApiOkResponse({ description: 'The created form instance', type: FormInstanceDto })
    async createFormInstance(@Body() createFormInstanceDto: CreateFormInstanceDto): Promise<Number> {
        this.employeeService.getEmployeeById(createFormInstanceDto.employeeId).then((employees) => {
            if (employees.length === 0) {
                throw new HttpException('Employee not found', HttpStatus.BAD_REQUEST);
            }
        });
        this.formService.getFormById(createFormInstanceDto.formId).then((forms) => {
            if (forms.length === 0) {
                throw new HttpException('Form not found', HttpStatus.BAD_REQUEST);
            }
        });
        const createdFormInstance = await this.formInstanceService.createFormInstance(createFormInstanceDto);
        return createdFormInstance.id;
    }
}
