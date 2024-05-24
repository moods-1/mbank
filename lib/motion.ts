export const slideFadeIn = (
	directionX: string | null,
	directionY: string | null,
	type: string,
	delay: number,
	duration: number
) => {
	return {
		hidden: {
			x: directionX === 'left' ? '100%' : directionX === 'right' ? '-100%' : 0,
			y: directionY === 'up' ? '100%' : directionY === 'down' ? '-100%' : 0,
			opacity: 0,
		},
		visible: {
			x: 0,
			y: 0,
			opacity: 1,
			transition: {
				type: type,
				delay: delay,
				duration: duration,
				ease: 'easeIn',
			},
		},
	};
};
export const fadeIn = (delay: number, duration: number) => {
	return {
		hidden: {
			opacity: 0,
		},
		visible: {
			opacity: 1,
			transition: {
				delay: delay,
				duration: duration,
				ease: 'easeIn',
			},
		},
	};
};
