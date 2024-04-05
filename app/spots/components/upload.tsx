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
      setFiles((prevFiles) => [...prevFiles, ...files].slice(0, 4));
    },
    [setFiles]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
  });

  return (
    <>
      {files.length ? (
        <div className="grid grid-cols-4 gap-4">
          {files.map((file) => (
            <Image
              key={file.name}
              src={URL.createObjectURL(file)}
              alt={file.name}
              width={300}
              height={200}
              isZoomed
              className="cursor-pointer object-cover h-full min-h-44"
              onClick={() =>
                setFiles(files.filter((f) => f.name !== file.name))
              }
            />
          ))}
        </div>
      ) : null}

      {!files.length ? (
        <Card className="cursor-pointer bg-default-100 hover:bg-default-300">
          <div
            className="min-h-44 w-full flex justify-center items-center"
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <p className="text-center">
              Click or drop images to upload up to 4 images of a spot
            </p>
          </div>
        </Card>
      ) : null}
    </>
  );
}
