type Props = {
	text: string;
	className?: string;
};
export default function FormErrorText({ text, className }: Props) {
	return text ? (
		<p className={`text-red-700 text-sm ${className}`}>{text}</p>
	) : null;
}
