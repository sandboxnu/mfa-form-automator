import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';
import { CreateAssignedGroupDto } from '../../assigned-group/dto/create-assigned-group.dto';

export class CreateFormInstanceDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsArray()
  @ArrayMinSize(1)
  @ApiProperty({
    isArray: true,
    type: CreateAssignedGroupDto,
  })
  assignedGroups: CreateAssignedGroupDto[];

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  originatorId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  formTemplateId: string;

  @IsString()
  @ApiProperty()
  formDocLink: string;
}
