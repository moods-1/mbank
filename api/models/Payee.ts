import { Schema, models, model } from 'mongoose';

const PayeeSchema = new Schema(
	{
		payeeName: {
			type: String,
			required: true,
			minlength: 2,
			unique: true,
		},
		nickname: {
			type: String,
			required: false,
			minlength: 2,
		},
		email: {
			type: String,
			required: true,
			minlength: 6,
			unique: true,
		},
		businessType: {
			type: String,
			required: true,
			minLength: 2,
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
	},
	{ timestamps: true, collection: 'Payee' }
);

const Payee = models.Payee || model('Payee', PayeeSchema);
export default Payee;
