import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { FormInstance } from "src/models/formInstance.entity";
import { CreateFormInstanceDto, FormInstanceDto } from "./formInstance.dto";
import { FormInstanceService } from "./formInstance.service";

@Controller('formInstances')
@ApiTags('Form Instances')
export class FormInstanceController {
    constructor(private readonly formInstanceService: FormInstanceService) {}
    
    @Post()
    @ApiOperation({ summary: 'Creates a new FormInstance' })
    @ApiBody({ type: CreateFormInstanceDto })
    @ApiOkResponse({ description: 'The created form instance', type: FormInstanceDto })
    async createFormInstance(@Body() createFormInstanceDto: CreateFormInstanceDto): Promise<FormInstance> {
        const createdFormInstance = await this.formInstanceService.createFormInstance(createFormInstanceDto);
        return createdFormInstance;
    }
}
