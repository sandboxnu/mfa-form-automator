import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Position } from "../models/position.entity";
import { PositionController } from "./position.controller";
import { PositionService } from "./position.service";

@Module({
    imports: [TypeOrmModule.forFeature([Position])],
    exports: [PositionService],
    providers: [PositionService],
    controllers: [PositionController]
})
export class PositionModule {};
