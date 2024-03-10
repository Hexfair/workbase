import React from 'react';
import styles from './Input.module.scss';
import { InputProps } from './Input.props.';
//=========================================================================================================================

const Input = React.forwardRef((props: InputProps, ref: React.Ref<HTMLInputElement>) => {
	const { label, name, error, value, onChange, required, placeholder, pattern, className } = props;

	return (
		<label className={`${styles.label} ${className ? className : ''}`}>
			<span className={styles.span}>{label}</span>
			<input
				name={name}
				type='text'
				className={`${styles.input} ${error && error.length > 0 && styles.red}`}
				value={value}
				onChange={onChange}
				placeholder={placeholder}
				pattern={pattern}
				required={required}
				ref={ref}
			/>
		</label>
	);
})

export default Input;
