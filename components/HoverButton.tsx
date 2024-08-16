// Description:
//  The button is initially black with white text and a white border.
//  When the user hovers over the button:
//      - the border turns dark grey and
//      - the text turns black
//      - the white::before element slides in from the left side
//  When the mouse leaves the button:
//      - all the hover effects above are reversed

interface ButtonProps {
	title: string;
	className?: string;
	clickFunction?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const HoverButton = ({ title, className, clickFunction }: ButtonProps) => {
	return (
		<button className={`hover-btn ${className||''}`} onClick={clickFunction}>
			<span>{title}</span>
		</button>
	);
};
export default HoverButton;
