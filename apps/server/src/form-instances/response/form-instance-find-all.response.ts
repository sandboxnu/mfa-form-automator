import { ApiProperty } from '@nestjs/swagger';
import { FormInstanceEntity } from '../entities/form-instance.entity';

export class FormInstanceFindAllResponse {
  @ApiProperty()
  count: number;

  @ApiProperty({ type: [FormInstanceEntity] })
  formInstances: FormInstanceEntity[];

  constructor(count: number, formInstances: FormInstanceEntity[]) {
    this.count = count;
    this.formInstances = formInstances;
  }
}
