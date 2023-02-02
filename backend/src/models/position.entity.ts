import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
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
    department: number

    @OneToOne(() => Employee, (employee) => employee.id)
    employee: number

    @OneToMany(() => FormInstance, (formInstance) => formInstance.initiator)
    formInstances: FormInstance[]
}
