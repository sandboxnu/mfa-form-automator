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
    @JoinColumn({ name: "signatureRequestHeadId"})
    signatureRequestHead: SignatureRequestLink

    @Column({ type: "int", nullable: true })
    signatureRequestHeadId: number

    @ManyToOne(() => Position, (position) => position.formInstances)
    @JoinColumn({ name: "initiatorId"})
    initiator: Position

    @Column({ type: "int", nullable: true })
    initiatorId: number
}
