import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Department } from 'src/models/department.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
  ) {}

  getDepartmentById(departmentId: number) {
    return this.departmentRepository.findOne({
      where: {
        id: departmentId,
      },
    });
  }
}
