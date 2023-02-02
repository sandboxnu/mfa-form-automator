import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Position } from "./position.entity";

@Entity()
export class Department {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    @OneToOne(() => Position)
    departmentHead: Position

    @Column()
    @OneToOne(() => Position)
    leadershipTeamMember: Position

    @Column()
    @OneToMany(() => Position, (position) => position.manager)
    employees: Position[]
}