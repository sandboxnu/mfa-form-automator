import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { queryClient } from '../_app';

// https://vercel.com/docs/storage/vercel-blob/client-upload
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const body = request.body as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathName, clientPayload) => {
        const { formId, formType } = JSON.parse(clientPayload as string);
        console.log(pathName, formId, formType);
        return {
          allowedContentTypes: ['application/pdf'],
          tokenPayload: JSON.stringify({
            pathName,
            formId,
            formType,
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        const { formId, formType } = JSON.parse(tokenPayload as string);
        try {
          if (formType === 'template') {
            await axios.patch(
              `${process.env.BACKEND_URL}/api/form-templates/` + formId,
              {
                formDocLink: blob.url,
              },
            );
          } else if (formType === 'instance') {
            await axios.patch(
              `${process.env.BACKEND_URL}/api/form-instances/` + formId,
              {
                formDocLink: blob.url,
              },
            );
          }
        } catch (error) {
          console.error('Error parsing token payload:', error);
        }
      },
    });

    return response.status(200).json(jsonResponse);
  } catch (error) {
    return response.status(400).json({ error: (error as Error).message });
  }
}
