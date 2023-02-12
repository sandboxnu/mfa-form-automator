import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FormInstance } from './formInstance.entity';
import { SignatureChainLink } from './signatureChainLink.entity';

@Entity()
// TODO: Forms should be unique?
export class Form {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToOne(() => SignatureChainLink, (signatureChainLink) => signatureChainLink.form)
  @JoinColumn({ name: "signatureChainLinkHeadId" })
  signatureChainLinkHead: SignatureChainLink

  @Column({ type: "int", nullable: true })
  signatureChainLinkHeadId: number

  @OneToMany(() => FormInstance, (formInstance) => formInstance.formType)
  formInstances: FormInstance[]
}
