function updateRowTypeListener(changed, collection, shortcode) {

	function attributeByName(name) {
		return _.find(
			collection,
			function(viewModel) {
				return name === viewModel.model.get('attr');
			}
		);
	}

	var updatedVal = changed.value,
		feedURL = attributeByName('feed_url'),
		rowDirection = attributeByName('direction'),
		bgImage = attributeByName('bg_image'),
		rowIcon = attributeByName('icon_file'),
		rowID = attributeByName('js_id'),
		rowPages = attributeByName('page');



	rowID.$el.hide();

	if (updatedVal === 'feed') {
		feedURL.$el.show();
		rowPages.$el.hide();
		rowIcon.$el.show();
	} else if (updatedVal === 'tabs') {
		rowDirection.$el.show();
		feedURL.$el.hide();
		rowPages.$el.show();
		rowIcon.$el.show();
	} else if (updatedVal === 'links') {
		rowDirection.$el.show();
		rowIcon.$el.show();
		feedURL.$el.hide();
		rowPages.$el.show();
	} else if (updatedVal === 'cards') {
		rowIcon.$el.hide();
		feedURL.$el.hide();
		rowDirection.$el.hide();
		rowPages.$el.show();
	} else if (updatedVal === 'slides') {
		rowIcon.$el.hide();
		feedURL.$el.hide();
		rowDirection.$el.hide();
		rowPages.$el.show();
	} else {
		feedURL.$el.hide();
		rowDirection.$el.hide();
		rowPages.$el.show();
		rowIcon.$el.hide();
	}
}

wp.shortcake.hooks.addAction('meh_row.row_type', updateRowTypeListener);


function updateRowColorListener(changed, collection, shortcode) {

	function attributeByName(name) {
		return _.find(
			collection,
			function(viewModel) {
				return name === viewModel.model.get('attr');
			}
		);
	}

	var updatedColor = changed.value,
		feedURL = attributeByName('feed_url'),
		rowDirection = attributeByName('direction'),
		bgImage = attributeByName('bg_image'),
		rowIcon = attributeByName('icon_file'),
		rowID = attributeByName('js_id'),
		rowPages = attributeByName('page');


	if (updatedColor === 'has-image') {
		bgImage.$el.show();
	} else {
		bgImage.$el.hide();
	}
}

wp.shortcake.hooks.addAction('meh_row.row_color', updateRowColorListener);
