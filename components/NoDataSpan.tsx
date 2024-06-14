type Props = {
	text?: string;
	className?: string;
};
export default function NoDataSpan({ text, className }: Props) {
	const defaultText = 'No data.';
	return <span className={`text-sm ${className}`}>{text || defaultText}</span>;
}
