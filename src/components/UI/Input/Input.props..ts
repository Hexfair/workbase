export interface InputProps {
	label: string,
	name: string,
	error?: string,
	value: string
	placeholder: string,
	pattern?: string,
	className?: string,
	required?: boolean,
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}