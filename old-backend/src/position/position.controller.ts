import { Controller, Post, Body, Get } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBody, ApiOkResponse } from "@nestjs/swagger";
import { PositionService } from "./position.service";

@Controller('positions')
@ApiTags('Positions')
export class PositionController {
  constructor(private readonly PositionService: PositionService) {}

}
