import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Form } from "./form.entity";
import { Position } from "./position.entity";
import { SignatureRequestLink } from "./signatureRequestLink.entity";

@Entity()
export class FormInstance {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Form, (form) => form.formInstances)
    formType: Form

    @Column()
    completed: boolean

    @OneToOne(() => SignatureRequestLink)
    @JoinColumn()
    signatureRequestHead: SignatureRequestLink

    @ManyToOne(() => Position, (position) => position.formInstances)
    initiator: Position
}
