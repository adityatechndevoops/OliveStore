const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
	{
		store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
		name: { type: String, required: true, trim: true },
		description: { type: String },
		price: { type: Number, required: true, min: 0 },
		stock: { type: Number, default: 0 },
		imageUrl: { type: String },
		active: { type: Boolean, default: true },
		category: { type: String },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);


