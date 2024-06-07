'use server';
import { compare } from 'bcryptjs';

import {
	generateToken,
	verifyToken,
	hashPassword,
	handleError,
} from '@/lib/serverFunctions';
import {
	AddClientType,
	ClientType,
	LoginProps,
	PayeeProps,
	PublicClientType,
} from '@/lib/types';
import { connectToDatabase } from '../db';
import Client from '../models/Client';
import ClientNumber from '../models/CurrentClientNumber';

export async function addClient(data: AddClientType) {
	try {
		await connectToDatabase();
		const clientNumberArray = await ClientNumber.find();
		const { _id: numberId, clientNumber } = clientNumberArray[0];
		const newClientNumber = clientNumber + 1;
		await ClientNumber.updateOne(
			{ _id: numberId },
			{ clientNumber: newClientNumber }
		);
		//
		data.clientNumber = newClientNumber;
		data.password = await hashPassword(data.password);
		const client = await Client.create(data);
		client.token = await generateToken(client._id);
		client.save();
		const returnClient = client.toObject();
		delete returnClient.password;
		return JSON.parse(JSON.stringify(returnClient));
	} catch (error) {
		handleError(error);
	}
}

export async function loginClient(data: LoginProps) {
	try {
		await connectToDatabase();
		const { clientNumber, password } = data;
		const clientExists: ClientType | any = await Client.findOne({
			clientNumber,
		});
		if (clientExists) {
			const goodPassword = await compare(password, clientExists?.password);
			if (goodPassword) {
				const { _id } = clientExists;
				clientExists.token = await generateToken(_id);
				clientExists.loggedIn = true;
				const client = await Client.findOneAndUpdate(
					{ _id },
					{ $set: { ...clientExists } },
					{ returnDocument: 'after' }
				).select({ password: 0, createdAt: 0, updatedAt: 0 });
				return JSON.parse(JSON.stringify(client));
			} else return 'The password is incorrect.';
		} else {
			return 'No client exists with these credentials.';
		}
	} catch (error) {
		return handleError(error);
	}
}

export async function removePayee(token: string, data: PayeeProps) {
	const { clientNumber, payeeId } = data;
	try {
		await verifyToken(token);
		await connectToDatabase();
		const result = await Client.findOneAndUpdate(
			{ clientNumber },
			{ $pull: { payees: payeeId } },
			{
				returnOriginal: false,
			}
		);
		return {
			status: 201,
			msg: `Payee has been removed.`,
			response: JSON.parse(JSON.stringify(result)),
		};
	} catch (error) {
		return { status: 500, msg: `Sorry, we could not remove the payee.` };
	}
}

export async function addPayee(token: string, data: PayeeProps) {
	const { clientNumber } = data;
	delete data.clientNumber;
	try {
		await verifyToken(token);
		await connectToDatabase();
		const result = await Client.findOneAndUpdate(
			{ clientNumber },
			{ $push: { payees: data } },
			{ returnOriginal: false }
		);
		return {
			status: 201,
			msg: 'Payee has been added.',
			response: JSON.parse(JSON.stringify(result)),
		};
	} catch (error) {
		return {
			status: 500,
			msg: `Sorry, we could not add the payee.`,
			response: {},
		};
	}
}
