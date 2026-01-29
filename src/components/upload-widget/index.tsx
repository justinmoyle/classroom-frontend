import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '@/components/constants';
import { Trash, UploadCloud } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button.tsx';
import { UploadWidgetProps, UploadWidgetValue } from '@/types';

function UploadWidget({
                        value = null,
                        onChange,
                        disabled = false,
                      }: UploadWidgetProps) {
  const widgetRef = useRef<CloudinaryWidget | null>(null);
  const onChangeRef = useRef(onChange);

  const [preview, setPreview] = useState<UploadWidgetValue | null>(value);
  const [deleteToken, setDeleteToken] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  const initializeWidget = () => {
    if (typeof window === 'undefined') return false;
    if (!window.cloudinary || widgetRef.current) return false;

    widgetRef.current = window.cloudinary.createUploadWidget(
      {
        cloudName: CLOUDINARY_CLOUD_NAME,
        uploadPreset: CLOUDINARY_UPLOAD_PRESET,
        multiple: false,
        folder: 'uploads',
        maxFileSize: 5_000_000,
        clientAllowedFormats: ['png', 'jpg', 'jpeg'],
      },
      (error, result) => {
        if (error) {
          console.error('Failed to upload image to Cloudinary', error);
          return;
        }
        if (!error && result.event === 'success') {
          const payload: UploadWidgetValue = {
            url: result.info.secure_url,
            publicId: result.info.public_id,
          };

          setPreview(payload);
          setDeleteToken(result.info.delete_token ?? null);
          onChangeRef.current?.(payload);
        }
      },
    );

    return true;
  };

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Sync external value → internal preview
  useEffect(() => {
    setPreview(value);
    if (!value) {
      setDeleteToken(null);
    }
  }, [value]);


  useEffect(() => {
    if (initializeWidget()) return;

    let attempts = 0;
    const maxAttempts = 20; // 10 Seconds Max
    const intervalId = window.setInterval(() => {
      attempts++;
      if (attempts >= maxAttempts) {
        console.error('Cloudinary SDK failed to load after maximum attempts');
        window.clearInterval(intervalId);
        return;
      }
      if (initializeWidget()) {
        window.clearInterval(intervalId);
      }
    }, 500);

    return () => window.clearInterval(intervalId);
  }, []);

  const openWidget = () => {
    if (!window.cloudinary) {
      console.error('Cloudinary SDK not loaded');
      return;
    }

    if (!disabled) {
      if (!widgetRef.current) {
        console.warn('Widget not initialized, attempting to initialize...');
        // The useEffect should have handled this, but just in case
        const initialized = initializeWidget();
        if (initialized) {
          widgetRef.current?.open();
        } else {
          console.error('Failed to initialize Cloudinary widget');
        }
      } else {
        widgetRef.current.open();
      }
    }
  };

  const removeFromCloudinary = async () => {
    if (!preview) return;

    setIsRemoving(true);

    try {
      if (deleteToken) {
        const params = new URLSearchParams();
        params.append('token', deleteToken);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/delete_by_token`,
          {
            method: 'POST',
            body: params,
          },
        );
        if (!response.ok) {
          throw new Error(`Delete fail with status ${response.status}`);
        }
      }
      // Only clear state on success or when no delete token is present
      setPreview(null);
      setDeleteToken(null);
      onChangeRef.current?.(null);
    } catch (error) {
      console.error('Failed to remove image from Cloudinary', error);
      // Don't clear state on error - image still exists in Cloudinary
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="space-y-2">
      {preview ? (
        <div className="upload-preview">
          <img src={preview.url} alt="Uploaded file" />

          <Button
            type="button"
            size="icon"
            variant="destructive"
            onClick={removeFromCloudinary}
            disabled={isRemoving || disabled}
          >
            <Trash className="size-4" />
          </Button>
        </div>
      ) : (
        <div
          className="upload-dropzone"
          role="button"
          tabIndex={0}
          onClick={openWidget}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              openWidget();
            }
          }}
        >
          <div className="upload-prompt">
            <UploadCloud className="icon" />
            <div>
              <p>Click to upload photo</p>
              <p>PNG, JPG up to 5MB</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadWidget;
