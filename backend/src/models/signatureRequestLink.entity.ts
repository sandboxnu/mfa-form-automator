import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FormInstance } from './formInstance.entity';
import { Position } from './position.entity';
import { SignatureChainLink } from './signatureChainLink.entity';

@Entity()
export class SignatureRequestLink {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => SignatureChainLink)
  @JoinColumn({ name: 'signatureChainLinkId' })
  signatureChainLink: SignatureChainLink;

  @Column({ type: 'int', nullable: true })
  signatureChainLinkId: number;

  @OneToOne(() => FormInstance)
  @JoinColumn({ name: 'formInstanceId' })
  formInstance: FormInstance;

  @Column({ type: 'int', nullable: true })
  formInstanceId: number;

  @Column()
  isSigned: boolean;

  @Column()
  canSign: boolean;

  @OneToOne(() => SignatureRequestLink)
  @JoinColumn({ name: 'nextId' })
  next: SignatureRequestLink;

  @Column({ type: 'int', nullable: true })
  nextId: number;
}
