import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Position } from "./position.entity";

@Entity()
export class Department {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @OneToOne(() => Position)
    departmentHead: Position

    @OneToOne(() => Position)
    leadershipTeamMember: Position

    @OneToMany(() => Position, (position) => position.manager)
    employees: Position[]
}
