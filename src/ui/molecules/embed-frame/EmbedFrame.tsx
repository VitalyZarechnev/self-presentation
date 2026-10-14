import classes from './EmbedFrame.module.scss';

type TProps = {
  src: string;
  title: string;
};

export default function EmbedFrame({ src, title }: TProps) {
  return (
    <div className={classes.embed}>
      <iframe
        className={classes.embed__frame}
        src={src}
        title={title}
        loading='lazy'
        allow='fullscreen; autoplay; accelerometer; gyroscope'
        sandbox='allow-scripts allow-same-origin allow-pointer-lock allow-popups'
      />
    </div>
  );
}
