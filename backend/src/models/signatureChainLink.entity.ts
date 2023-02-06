import { SigningPositions } from "src/ts/enums/SigningPositions";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Form } from "./form.entity";
import { Position } from "./position.entity";

@Entity()
export class SignatureChainLink {
    @PrimaryGeneratedColumn()
    id: number
    
    @OneToOne(() => Form, (form) => form.signatureChainLinkHead)
    form: Form

    @Column()
    position: SigningPositions

    @ManyToOne(() => Position)
    specificPosition: Position

    @OneToOne(() => SignatureChainLink)
    @JoinColumn()
    nextSignature: SignatureChainLink

}
