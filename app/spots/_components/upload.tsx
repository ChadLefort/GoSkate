'use client';

import { useDropzone } from '@uploadthing/react';
import { useCallback, useState } from 'react';
import { generateClientDropzoneAccept } from 'uploadthing/client';
import { Card } from '@nextui-org/card';
import { Image } from '@nextui-org/image';
import { IconSquareRoundedX } from '@tabler/icons-react';

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

  const [showPhotoOverlay, setPhotoOverlay] = useState<string>();

  return (
    <>
      {files.length ? (
        <div className="grid grid-cols-4 gap-4">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="relative"
              onMouseOver={() => setPhotoOverlay(`${file.name}-${index}`)}
              onMouseOut={() => setPhotoOverlay(undefined)}
            >
              <Image
                src={URL.createObjectURL(file)}
                alt={file.name}
                width={300}
                height={200}
                className="h-full min-h-44 object-cover"
              />
              {showPhotoOverlay === `${file.name}-${index}` && (
                <div
                  onClick={() => setFiles(files.filter((f) => f.name !== file.name))}
                  className="absolute bottom-0 left-0 right-0 top-0 z-50 flex cursor-pointer items-center justify-center rounded-xl bg-black bg-opacity-50 p-2 text-danger "
                >
                  <IconSquareRoundedX size="40" />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : null}

      {!files.length ? (
        <Card className="cursor-pointer bg-default-100 hover:bg-default-300">
          <div className="flex min-h-44 w-full items-center justify-center" {...getRootProps()}>
            <input {...getInputProps()} />
            <p className="text-center">Click or drop images to upload up to 4 images of a spot</p>
          </div>
        </Card>
      ) : null}
    </>
  );
}
