import { Schema, models, model } from 'mongoose';

const ClientSchema = new Schema(
	{
		clientNumber: {
			type: Number,
			required: true,
			unique: true,
			maxLength: 9,
		},
		firstName: {
			type: String,
			required: true,
			minlength: 2,
			unique: false,
		},
		lastName: {
			type: String,
			required: true,
			minlength: 2,
			unique: false,
		},
		loggedIn: {
			type: Boolean,
			default: false,
		},
		email: {
			type: String,
			required: true,
			minlength: 6,
			unique: true,
		},
		phoneNumber: {
			type: Number,
			minLength: 10,
			maxLength: 10,
			required: true,
		},
		city: {
			type: String,
			required: true,
			minLength: 2,
			maxLength: 30,
		},
		province: {
			type: String,
			required: true,
			minLength: 2,
			maxLength: 30,
		},
		country: {
			type: String,
			required: true,
			minLength: 3,
			maxLength: 30,
		},
		address: {
			type: String,
			required: true,
			minLength: 6,
			maxLength: 50,
		},
		postalCode: {
			type: String,
			required: true,
			minLength: 6,
			maxLength: 6,
		},
		password: {
			type: String,
			minlength: 6,
			required: false,
		},
		image: {
			type: String,
			default: '',
		},
		accounts: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Course',
			},
		],
		payees: [
			{
				payeeId: { type: Schema.Types.ObjectId },
				payeeName: { type: String },
				nickname: {type:  String},
				accountNumber: { type: String },
			},
		],
		token: {
			type: String,
		},
	},
	{ timestamps: true, collection: 'Client' }
);

const Client = models.Client || model('Client', ClientSchema);
export default Client;
