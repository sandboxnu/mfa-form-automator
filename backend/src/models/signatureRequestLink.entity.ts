import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { FormInstance } from "./formInstance.entity";
import { Position } from "./position.entity";
import { SignatureChainLink } from "./signatureChainLink.entity";

@Entity()
export class SignatureRequestLink {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => SignatureChainLink)
    signatureChainLink: SignatureChainLink

    @OneToOne(() => FormInstance)
    formInstance: FormInstance

    @ManyToOne(() => Position)
    @JoinColumn({ name: "positionId"})
    position: Position

    @Column({ type: "int", nullable: true })
    positionId: number

    @Column()
    isSigned: boolean

    @Column()
    canSign: boolean

    @OneToOne(() => SignatureRequestLink)
    @JoinColumn({ name: "nextId" })
    next: SignatureRequestLink

    @Column({ type: "int", nullable: true })
    nextId: number
}
