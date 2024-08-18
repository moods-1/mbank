import { hashSync } from 'bcryptjs';
import { JsonWebTokenError, sign, verify } from 'jsonwebtoken';
import { Types } from 'mongoose';

export const hashPassword = async (data: string) => {
	return hashSync(data, 8);
};

export const generateToken = async (id: Types.ObjectId | string) => {
	const secret = process.env.JWT_SECRET;
	if (secret) {
		return sign({ id }, secret, { expiresIn: '15m' });
	}
	return false;
};

export const verifyToken = async (token: string) => {
	const secret = process.env.JWT_SECRET;
	if (secret) {
		const goodToken = verify(token, secret);
		return goodToken;
	}
	new Error('Error verifying the token.');
};

export const responseFormatter = async (
	status: number,
	message: string,
	response: string
) => ({
	status,
	message,
	response,
});

export const handleError = (error: unknown) => {
	if (error instanceof JsonWebTokenError) {
		return {
			status: 401,
			msg: 'Your session has expired. Please login again.',
		};
	}
	return { status: 500, msg: 'Failed.' };
};

export const parsedResponse = (data: any) => {
	return JSON.parse(JSON.stringify(data));
};
