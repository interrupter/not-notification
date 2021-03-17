module.exports = {
	model:{
		type: String,
		required: true,
		searchable: true,
		sortable: true,
		unique:true,
		safe: {
			update: ['@owner', 'root', 'admin'],
			read: ['@owner', 'root', 'admin']
		}
	},
	ui: {
		component: 'UITextfield',
		placeholder: 'key field leave empty to auto gen uuidv4',
		label: 'Key'
	},
};
