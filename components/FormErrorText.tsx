type Props = {
	text: string;
	className?: string;
};
export default function FormErrorText({ text, className }: Props) {
	return text ? (
		<span className={`text-red-700 text-sm inline-block ${className}`}>{text}</span>
	) : null;
}
