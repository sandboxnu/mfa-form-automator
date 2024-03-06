import { useStorage } from '@web/hooks/useStorage';

export default function Storage() {
  const { uploadBlob } = useStorage({
    sasUrl:
      'https://mfastorage.blob.core.windows.net/forms?sp=racwdl&st=2024-03-05T21:39:40Z&se=2025-03-06T05:39:40Z&sv=2022-11-02&sr=c&sig=OOY5NFOPBWZD1ve93X5487CJS7BDqiDxzfEJMBhzLDI%3D',
  });

  return (
    <>
      <input
        type="file"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            uploadBlob(file);
          }
        }}
      />
    </>
  );
}
