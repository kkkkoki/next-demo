import React, {
  ChangeEvent,
  Fragment,
  useCallback,
  useRef,
  useState,
} from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  ArrowSmallLeftIcon,
  CameraIcon,
  MagnifyingGlassMinusIcon,
  MagnifyingGlassPlusIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';
import AvatarEditor from 'react-avatar-editor';
import { useDropzone } from 'react-dropzone';
import {
  FieldValues,
  UseControllerProps,
  useController,
} from 'react-hook-form';
import styles from '@/styles/components/_avatar-cropper.module.scss';

const TRANSITION_BG_CLASSES = {
  enter: styles.bg__enter,
  enterFrom: styles.bg__enterFrom,
  enterTo: styles.bg__enterTo,
  leave: styles.bg__leave,
  leaveFrom: styles.bg__leaveFrom,
  leaveTo: styles.bg__leaveTo,
};

const TRANSITION_PANEL_CLASSES = {
  enter: styles.panel__enter,
  enterFrom: styles.panel__enterFrom,
  enterTo: styles.panel__enterTo,
  leave: styles.panel__leave,
  leaveFrom: styles.panel__leaveFrom,
  leaveTo: styles.panel__leaveTo,
};

const AvatarCropper = <T extends FieldValues>({
  control,
  name,
}: UseControllerProps<T>) => {
  const [selectedImage, setSelectedImage] = useState<File | null>();
  const [scale, setScale] = useState<number>(1.5);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const ref = useRef<AvatarEditor>(null);

  const { field } = useController({
    name,
    control,
  });

  const onDropAccepted = useCallback((acceptedFiles: File[]) => {
    setSelectedImage(acceptedFiles[0]);
    setIsModalOpen(true);
  }, []);

  const { getRootProps, getInputProps, isDragAccept } = useDropzone({
    onDropAccepted,
    accept: {
      'image/png': [],
      'image/jpeg': [],
    },
  });

  const handleScaleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setScale(parseFloat(e.target.value));
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const getCroppedImage = () => {
    const image = ref.current?.getImage();
    if (!image) {
      alert('正しい形式の画像を選択してください');
      closeModal();
      return null;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;

    const context = canvas.getContext('2d');
    context?.drawImage(image!, 0, 0, 100, 100);

    field.onChange(canvas.toDataURL('image/png'));
    closeModal();
  };

  return (
    <>
      <div
        className={`${styles.dropzone} ${
          isDragAccept && styles.dropzone_accept
        }`}
        {...getRootProps()}
      >
        {field.value && (
          <img
            className={styles.dropzone__preview}
            src={field.value}
            alt="アバター画像"
          />
        )}
        <div className={styles.dropzone__icon}>
          <CameraIcon />
        </div>
        <input {...getInputProps} hidden />
      </div>

      {field.value && (
        <button
          className={styles.deleteBtn}
          type="button"
          onClick={() => field.onChange('')}
        >
          削除
        </button>
      )}

      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className={styles.dialog} onClose={closeModal}>
          <Transition.Child as={Fragment} {...TRANSITION_BG_CLASSES}>
            <div className={styles.dialog__bgScreen} />
          </Transition.Child>

          <div className={styles.dialog__scrollArea}>
            <div className={styles.dialog__contentsWrap}>
              <Transition.Child as={Fragment} {...TRANSITION_PANEL_CLASSES}>
                <Dialog.Panel className={styles.dialog__contens}>
                  <div className={styles.actions}>
                    <button
                      className={styles.actions__backBtn}
                      type="button"
                      onClick={closeModal}
                    >
                      <ArrowSmallLeftIcon />
                    </button>
                    <button
                      className={styles.actions__saveBtn}
                      type="button"
                      onClick={getCroppedImage}
                    >
                      適用
                    </button>
                  </div>
                  {selectedImage && (
                    <div className={styles.editor}>
                      <AvatarEditor
                        className={styles.editor__cropCanvas}
                        ref={ref}
                        image={selectedImage}
                        border={50}
                        borderRadius={100}
                        color={[0, 0, 0, 0.6]} // RGBA
                        scale={scale}
                        rotate={0}
                      />

                      <div className={styles.editor__rangeWrap}>
                        <MagnifyingGlassMinusIcon
                          className={styles.editor__rangeIcon}
                        />
                        <input
                          type="range"
                          min={1}
                          max={2}
                          step={0.1}
                          defaultValue={1.5}
                          onChange={handleScaleChange}
                        />
                        <MagnifyingGlassPlusIcon
                          className={styles.editor__rangeIcon}
                        />
                      </div>
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default AvatarCropper;
