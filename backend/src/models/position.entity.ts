import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Department } from "./department.entity";
import { Employee } from "./employee.entity";
import { FormInstance } from "./formInstance.entity";

@Entity()
export class Position {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    roleName: string

    @ManyToOne(() => Position, (position) => position.underlings)
    manager: Position

    @OneToMany(() => Position, (position) => position.manager)
    underlings: Position[]

    @ManyToOne(() => Department, (department) => department.employees)
    department: Department

    @OneToOne(() => Employee)
    @JoinColumn()
    employee: Employee

    @OneToMany(() => FormInstance, (formInstance) => formInstance.initiator)
    formInstances: FormInstance[]
}
