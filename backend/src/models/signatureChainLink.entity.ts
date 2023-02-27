import { SigningPositions } from "../ts/enums/SigningPositions";
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
    @JoinColumn({ name: "specificPositionId"})
    specificPosition: Position

    @Column({ type: "int", nullable: true })
    specificPositionid: number

    @OneToOne(() => SignatureChainLink)
    @JoinColumn({ name: "nextSignatureId"})
    nextSignature: SignatureChainLink

    @Column({ type: "int", nullable: true })
    nextSignatureId: number
}
