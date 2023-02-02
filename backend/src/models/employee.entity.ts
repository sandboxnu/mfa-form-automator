import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IsEmail, IsNotEmpty } from "class-validator";

@Entity()
export class Employee {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @IsNotEmpty()
    firstName: string

    @Column()
    @IsNotEmpty()
    lastName: string

    @Column({unique: true})
    @IsEmail()
    email: string

    @Column()
    @IsNotEmpty()
    password: string
}