import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { FormInstance } from "./formInstance.entity";

@Entity()
export class Form {
    @PrimaryGeneratedColumn()
    id: number
    
    @Column()
    name: string

    @Column()
    pdfLink: string

    // @Column()
    // @OneToOne(() => SignatureChainLink)
    // signatureChainLinkHead: SignatureChainLink

    @Column()
    @OneToMany(() => FormInstance, (formInstance) => formInstance.formType)
    formInstances: FormInstance[]
}