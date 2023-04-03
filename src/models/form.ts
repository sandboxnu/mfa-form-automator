import { Prop, PropType, Ref } from "@typegoose/typegoose";
import SignatureChainLink from "./signature-chain-link";
import FormInstance from "./form-instance";

class Form {
    //! Still confused on how IDs work here???? Do I need to add one? 😭
    
    @Prop({ required: true, type: () => String }) //? Also be unique?
    public name!: string;

    @Prop({ required: true, ref: () => SignatureChainLink, type: () => SignatureChainLink })
    public signatureChainLinkHead!: Ref<SignatureChainLink>;

    @Prop({ required: true, ref: () => FormInstance, type: () => [FormInstance] }, PropType.ARRAY)
    public formInstances!: Ref<FormInstance>[];
};

export default Form;
