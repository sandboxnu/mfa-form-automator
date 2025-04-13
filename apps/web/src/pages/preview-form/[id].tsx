import isAuth from '@web/components/isAuth';
import { useRouter } from 'next/router';
import { formInstancesControllerFindOneOptions } from "@web/client/@tanstack/react-query.gen";
import { useQuery } from "@tanstack/react-query";
import { FormPreview } from "@web/components/FormPreview";
import FormLoading from "@web/components/FormLoading";
import { FormListPageLayout } from "@web/components/FormListPageLayout";


function PreviewForm() {

    const router = useRouter();
    const id = router.query.id as string;

    const { data: formInstance, isLoading } = useQuery(
        formInstancesControllerFindOneOptions({
            path: { id },
        })
    );

    if (isLoading || !formInstance) return <FormLoading />;

    return (
        <>
            <FormListPageLayout>
                <FormPreview
                    formInstance={formInstance}
                    formInstanceName={formInstance.name}
                    pdfLink={formInstance.formDocLink ?? ''}
                />
            </FormListPageLayout>
        </>
    );
}

export default isAuth(PreviewForm);