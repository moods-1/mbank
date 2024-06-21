import { hashSync } from 'bcryptjs';
import { JsonWebTokenError, sign, verify } from 'jsonwebtoken';
import { Types } from 'mongoose';

export const hashPassword = async (data: string) => {
	return hashSync(data, 8);
};

export const generateToken = async (id: Types.ObjectId | string) => {
	const secret = process.env.JWT_SECRET || '';
	return sign({ id }, secret, { expiresIn: '30m' });
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

export const verifyToken = async (token: string) => {
	const secret = process.env.JWT_SECRET || '';
	const goodToken = verify(token, secret);
	return goodToken;
};

export const handleError = (error: unknown) => {
	if (error instanceof JsonWebTokenError) {
		return { status: 401, msg: 'Invalid or expired token.' };
	}
	return error;
};

export const parsedResponse = (data: any) => {
	return JSON.parse(JSON.stringify(data));
};
