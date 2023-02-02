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

    @Column({nullable: true}) //many to 1
    @ManyToOne(() => Position, (position) => position.underlings)
    manager: Position

    @Column({nullable: true})
    @OneToMany(() => Position, (position) => position.manager)
    underlings: Position[]

    @Column()
    @ManyToOne(() => Department, (department) => department.employees)
    department: number

    @Column()
    @OneToOne(() => Employee, (employee) => employee.id)
    employee: number

    @Column()
    @OneToMany(() => FormInstance, (formInstance) => formInstance.initiator)
    formInstances: FormInstance[]
}