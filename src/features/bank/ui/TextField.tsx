import classes from './TextField.module.scss';

type TProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  inputMode?: 'text' | 'numeric' | 'tel';
};

export default function TextField({ label, value, onChange, placeholder, inputMode }: TProps) {
  return (
    <label className={classes.field}>
      <span className={classes.label}>{label}</span>
      <input
        className={classes.input}
        value={value}
        inputMode={inputMode}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
