require.config({
	baseUrl:'/js/',
	paths:{
		'mui':'./libs/mui.min',
		'picker':'./libs/mui.picker',
		'poppicker':'./libs/mui.poppicker',
		'dtpicker':'./libs/mui.dtpicker',
		
		
		'dom':'./common/dom',
		'getUid':'./common/getUid',
		'format':'./common/format',
		'getparams':'./common/getparams'
	},
	shim:{
		'picker':{
			deps:['mui']
		},
		'poppicker':{
			deps:['mui']
		},
		'dtpicker':{
			deps:['mui']
		}
	}
})