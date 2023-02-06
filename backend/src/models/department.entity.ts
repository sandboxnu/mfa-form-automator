import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Position } from "./position.entity";

@Entity()
export class Department {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @OneToOne(() => Position)
    @JoinColumn({ name: "departmentHeadId" })
    departmentHead: Position

    @Column({ type: "int", nullable: true })
    departmentHeadId: number

    @OneToOne(() => Position)
    @JoinColumn()
    leadershipTeamMember: Position

    @Column({ type: "int", nullable: true})
    leadershipTeamMemberId: number

    @OneToMany(() => Position, (position) => position.manager)
    employees: Position[]
}
