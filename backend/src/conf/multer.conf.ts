import multer from "multer";
export function createMulterUploadMiddleware(
  fieldName: string,
  limit: number,
  numberOfFiles: number,
) {
  const upload = multer({
    dest: "src/tmp",
    limits: {
      fileSize: limit,
      files: numberOfFiles,
    },
  });
  return upload.array(fieldName, numberOfFiles);
}
