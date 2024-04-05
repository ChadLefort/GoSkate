'use client';

import { useDropzone } from '@uploadthing/react';
import { useCallback } from 'react';
import { generateClientDropzoneAccept } from 'uploadthing/client';
import { Card } from '@nextui-org/card';
import { Image } from '@nextui-org/image';

type UploadProps = {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  fileTypes: string[];
};

export default function Upload({ files, setFiles, fileTypes }: UploadProps) {
  const onDrop = useCallback(
    (files: File[]) => {
      setFiles((prevFiles) => [...prevFiles, ...files]);
    },
    [setFiles]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
  });

  return (
    <>
      <div className="grid grid-cols-6 gap-4 pb-3">
        {files.map((file) => (
          <Image
            key={file.name}
            src={URL.createObjectURL(file)}
            alt={file.name}
            width={300}
            height={200}
            className="cursor-pointer object-cover h-full"
            onClick={() => setFiles(files.filter((f) => f.name !== file.name))}
          />
        ))}
      </div>

      <Card className="cursor-pointer">
        <div
          className="min-h-52 w-full flex justify-center items-center"
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <p className="text-center">Drop images to upload!</p>
        </div>
      </Card>
    </>
  );
}
