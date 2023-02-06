import { Body, Controller, ParseIntPipe, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { CreateFormInstanceDto } from "./formInstance.dto";
import { FormInstanceService } from "./formInstance.service";

@Controller('formInstances')
export class FormInstanceController {
    constructor(private readonly formInstanceService: FormInstanceService) {}
    
    @Post()
    public createFormInstance(@Body() createFormInstanceDto: CreateFormInstanceDto) {
        return 'Hello world';
    } 

}