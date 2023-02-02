import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Form } from "./form.entity";
import { Position } from "./position.entity";

@Entity()
export class FormInstance {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Form, (form) => form.formInstances)
    formType: Form

    @Column()
    completed: boolean

    // @Column()
    // signatureRequestHead: SignatureRequestChain

    @ManyToOne(() => Position, (position) => position.formInstances)
    initiator: Position
}
