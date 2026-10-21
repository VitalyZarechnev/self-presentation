import { CSSProperties } from 'react';
import clsx from 'clsx';
import Image from 'next/image';

import classes from './DemoPreview.module.scss';
import { TDemoPreview } from './previews';

type TProps = {
  preview: TDemoPreview;
  alt: string;
  sizes: string;
  className?: string;
};

export default function DemoPreview(props: TProps) {
  const { preview, alt, sizes, className } = props;
  const style = { '--preview-focus': preview.focus, '--preview-fit': preview.fit } as CSSProperties;

  return (
    <div className={clsx(classes.preview, className)} style={style}>
      <Image src={preview.blueprint} alt={alt} sizes={sizes} className={clsx(classes.preview__image, classes.preview__image_blueprint)} />
      <Image src={preview.paper} alt={alt} sizes={sizes} className={clsx(classes.preview__image, classes.preview__image_paper)} />
    </div>
  );
}
