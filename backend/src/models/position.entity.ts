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
    @JoinColumn({ name: "managerId"})
    manager: Position

    @Column({ type: "int", nullable: true })
    managerId: number

    @OneToMany(() => Position, (position) => position.manager)
    underlings: Position[]

    @ManyToOne(() => Department, (department) => department.employees)
    @JoinColumn({ name: "departmentId"})
    department: Department

    @Column({ type: "int", nullable: true })
    departmentId: number

    @OneToOne(() => Employee)
    @JoinColumn({ name: "employeeId" })
    employee: Employee

    @Column({ type: "int", nullable: true })
    employeeId: number

    @OneToMany(() => FormInstance, (formInstance) => formInstance.initiator)
    formInstances: FormInstance[]
}
