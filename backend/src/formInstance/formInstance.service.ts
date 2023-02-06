import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FormInstance } from "../models/formInstance.entity";
import { DataSource, Repository } from "typeorm";
import { CreateFormInstanceDto, FormInstanceDto } from "./formInstance.dto";

@Injectable()
export class FormInstanceService {
    constructor(
        @InjectRepository(FormInstance)
        private formInstanceRepository: Repository<FormInstance>) {}

    public async createFormInstance(createFormInstanceDto: CreateFormInstanceDto) {
    }
}