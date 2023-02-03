import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Position } from "./position.entity";

@Entity()
export class Department {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @OneToOne(() => Position)
    @JoinColumn()
    departmentHead: Position

    @OneToOne(() => Position)
    @JoinColumn()
    leadershipTeamMember: Position

    @OneToMany(() => Position, (position) => position.manager)
    employees: Position[]
}
