import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from 'src/models/employee.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee) private employeeRepository: Repository<Employee>,
  ) {}

  getEmployeeById(employeeId: number) {
    return this.employeeRepository.find({
        where: {
            id: employeeId
        }
    })
  }
}
