const MAX_UPLOAD_FILES = 10;
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

type Translator = (key: string, fallback?: string | Record<string, string | number>) => any;

interface ValidationResult {
  files: File[];
  error: string | null;
}

export const getUploadLimits = () => ({
  maxFiles: MAX_UPLOAD_FILES,
  maxFileSizeMb: MAX_FILE_SIZE_MB,
  maxFileSizeBytes: MAX_FILE_SIZE_BYTES,
});

export const validateImageFiles = (
  input: FileList | File[] | null | undefined,
  t: Translator
): ValidationResult => {
  if (!input) {
    return { files: [], error: null };
  }

  const selectedFiles = Array.from(input);

  if (selectedFiles.length > MAX_UPLOAD_FILES) {
    return {
      files: [],
      error: t(
        'uploader.maxFilesError',
        `Please select up to ${MAX_UPLOAD_FILES} images at a time.`
      ),
    };
  }

  const imageFiles = selectedFiles.filter((file) => file.type.startsWith('image/'));
  if (imageFiles.length === 0) {
    return { files: [], error: t('uploader.invalidType', 'Please upload valid image files.') };
  }

  const oversized = imageFiles.find((file) => file.size > MAX_FILE_SIZE_BYTES);
  if (oversized) {
    return {
      files: [],
      error: t(
        'uploader.maxSizeError',
        `Each image must be smaller than ${MAX_FILE_SIZE_MB}MB.`
      ),
    };
  }

  return { files: imageFiles, error: null };
};
