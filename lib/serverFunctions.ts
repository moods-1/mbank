import { hashSync } from 'bcryptjs';
import { JsonWebTokenError, sign, verify } from 'jsonwebtoken';
import { Types } from 'mongoose';

export const hashPassword = async (data: string) => {
	return hashSync(data, 8);
};

export const generateToken = async (id: Types.ObjectId | string) => {
	const secret = process.env.JWT_SECRET;
	if (secret) {
		return sign({ id }, secret, { expiresIn: '20m' });
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

export const setDateRange = async (startDate: Date, endDate: Date) => {
	const dateStart = new Date(startDate.setHours(0, 0, 0));
	const dateEnd = new Date(endDate.setHours(23, 59, 59, 999));
	return { dateStart, dateEnd };
};

export const handlePagination = async (
	queryResult: [],
	page: number,
	size: number
) => {
	const totalDocs = queryResult.length;
	const totalPages = Math.ceil(totalDocs / size);
	const endIndex = page * size;
	const startIndex = endIndex - size;
	const data = queryResult.slice(startIndex, endIndex);
	const hasMore = endIndex < totalDocs;
	return { data, totalPages, hasMore };
};
