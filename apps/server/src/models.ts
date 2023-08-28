import * as typegoose from '@typegoose/typegoose';
import { v4 as uuidv4 } from 'uuid';

/**
 * `Employees` represent the people who work at the MFA.
 *
 * Each `Employee` corresponds to a user who holds a certain position.
 */
class Employee {
  @typegoose.prop({ required: true, default: () => uuidv4() })
  public _id!: string;

  @typegoose.prop({ required: true })
  public firstName!: string;

  @typegoose.prop({ required: true })
  public lastName!: string;

  @typegoose.prop({ required: true })
  public email!: string;

  @typegoose.prop({ required: true })
  public pswdHash!: string;
}

/**
 * `Positions` represent the various positions that employees at the MFA can hold.
 */
class Position {
  @typegoose.prop({ required: true, default: () => uuidv4() })
  public _id!: string;

  @typegoose.prop({ required: true })
  public name!: string;

  @typegoose.prop({ required: true })
  public single!: boolean;
}

/**
 * `SignatureFields` represent each signature that is required on a given form.
 *
 * Each `SignatureField` also specifies its order on the form it is on.
 * `SignatureFields` are used as subdocuments within `FormTemplates`.
 */
class SignatureField {
  @typegoose.prop({ required: true, default: () => uuidv4() })
  public _id!: string;

  @typegoose.prop({ required: true })
  public order!: number;

  @typegoose.prop({ required: true })
  public signerId!: typegoose.Ref<Position>;
}

/**
 * `Signatures` represent the signatures required on a form. Each signature has a
 * specified signer and its corresponding status which indicates if it has been signed.
 *
 * A `Signature` will also carry over its order from the original `FormTemplate` order
 * from which the `FormInstance` that the `Signature` belongs to was derived. If a `Signature`
 * has been signed and completed, the `signedDoc` should contain a reference to the
 * signed file with all previous signatures up to the current signature.
 */
class Signature {
  @typegoose.prop({ required: true, default: () => uuidv4() })
  public _id!: string;

  @typegoose.prop({ required: true })
  public order!: number;

  @typegoose.prop({ required: true })
  public signed!: typegoose.Ref<Position>;

  @typegoose.prop()
  public signedDoc?: string;
}

/**
 * `FormInstances` represent instances of forms created by employees.
 *
 * They are created based on a given `FormTemplate`, and contain a
 * list of `Signatures` that are to be filled by the requested employees.
 *
 * A `FormInstance` should be marked completed when all of its signatures
 * have been collected and marked as completed.
 */
class FormInstance {
  @typegoose.prop({ required: true, default: () => uuidv4() })
  public _id!: string;

  @typegoose.prop({ required: true })
  public name!: string;

  @typegoose.prop({ required: true })
  public formDoc!: string;

  @typegoose.prop({ type: Signature })
  public signatures?: Signature[];

  @typegoose.prop({ default: false })
  public completed!: boolean;
}

/**
 * A `FormTemplate` is a reference for a form that is used when creating forms initiated by users.
 */
class FormTemplate {
  @typegoose.prop({ required: true, default: () => uuidv4() })
  public _id!: string;

  @typegoose.prop({ required: true })
  public name!: string;

  @typegoose.prop({ required: true })
  public formDoc!: string;

  @typegoose.prop({ type: SignatureField })
  public signatureFields?: SignatureField[];

  @typegoose.prop({ ref: () => FormInstance })
  public instances?: typegoose.Ref<FormInstance>[];
}
