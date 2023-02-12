import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FormInstance } from "../models/formInstance.entity";
import { Repository } from "typeorm";
import { CreateFormInstanceDto, FormInstanceDto } from "./formInstance.dto";

@Injectable()
export class FormInstanceService {
    constructor(
        @InjectRepository(FormInstance)
        private formInstanceRepository: Repository<FormInstance>
    ) {}

    public async createFormInstance(createFormInstanceDto: CreateFormInstanceDto) {
        const formInstanceDto: FormInstanceDto = {
            formId: createFormInstanceDto.formId,
            completed: false,
            signatureRequestHead: null,
            initiatorId: createFormInstanceDto.employeeId
        };
    
        const formInstance: FormInstance = this.formInstanceRepository.create(formInstanceDto);
        return this.formInstanceRepository.save(formInstance);
    }
}
