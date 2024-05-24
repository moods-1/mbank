import { Schema, models, model } from 'mongoose';

const ClientSchema = new Schema(
	{
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
		token: {
			type: String,
		},
	},
	{ timestamps: true, collection: 'Client' }
);

const Client = models.Client || model('Client', ClientSchema);
export default Client;
