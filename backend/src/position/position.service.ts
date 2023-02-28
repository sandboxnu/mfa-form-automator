import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Position } from 'src/models/position.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PositionService {
  constructor(
    @InjectRepository(Position) private positionRepository: Repository<Position>,
  ) {}

  getPositionById(positionId: number) {
    return this.positionRepository.find({
        where: {
            id: positionId
        }
    })
  }
}
