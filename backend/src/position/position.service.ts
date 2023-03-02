import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Position } from '../models/position.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PositionService {
  constructor(
    @InjectRepository(Position)
    private positionRepository: Repository<Position>,
  ) {}

  getPositionById(positionId: number) {
    return this.positionRepository.findOne({
      where: {
        id: positionId,
      },
    });
  }
}
