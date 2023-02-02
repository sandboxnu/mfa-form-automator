import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Form } from "./form.entity";
import { Position } from "./position.entity";

@Entity()
export class SignatureChainLink {
    @PrimaryGeneratedColumn()
    id: number
    
    @OneToOne(() => Form, (form) => form.signatureChainLinkHead)
    form: Form

    // @Column()
    // position: MFA.SigningPositions

    @ManyToOne(() => Position, (position) => position.id)
    specificPosition: Position

    @OneToOne(() => SignatureChainLink)
    @JoinColumn()
    nextSignature: SignatureChainLink

}
