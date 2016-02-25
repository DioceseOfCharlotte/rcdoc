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
		blurImage = attributeByName('blur_image'),
		glassColor = attributeByName('glass_color'),
		rowIcon = attributeByName('icon_file'),
		rowID = attributeByName('js_id'),
		rowPages = attributeByName('page'),
		slideTypes = attributeByName('slide_type');



	rowID.$el.hide();

	if (updatedVal === 'feed') {
		feedURL.$el.show();
		rowPages.$el.hide();
		rowIcon.$el.show();
		blurImage.$el.hide();
		glassColor.$el.hide();
		slideTypes.$el.hide();
	} else if (updatedVal === 'tabs') {
		rowDirection.$el.show();
		feedURL.$el.hide();
		rowPages.$el.show();
		rowIcon.$el.show();
		blurImage.$el.hide();
		glassColor.$el.hide();
		slideTypes.$el.hide();
	} else if (updatedVal === 'links') {
		rowDirection.$el.show();
		rowIcon.$el.show();
		feedURL.$el.hide();
		rowPages.$el.show();
		blurImage.$el.hide();
		glassColor.$el.hide();
		slideTypes.$el.hide();
	} else if (updatedVal === 'cards') {
		rowIcon.$el.hide();
		feedURL.$el.hide();
		rowDirection.$el.hide();
		rowPages.$el.show();
		blurImage.$el.hide();
		glassColor.$el.hide();
		slideTypes.$el.hide();
	} else if (updatedVal === 'slides') {
		rowIcon.$el.hide();
		feedURL.$el.hide();
		rowDirection.$el.hide();
		slideTypes.$el.show();
		rowPages.$el.show();
		blurImage.$el.hide();
		glassColor.$el.hide();
	} else if (updatedVal === 'cta') {
		bgImage.$el.show();
		blurImage.$el.show();
		glassColor.$el.show();
		rowDirection.$el.show();
		slideTypes.$el.hide();
		rowIcon.$el.hide();
		feedURL.$el.hide();
	} else {
		feedURL.$el.hide();
		rowDirection.$el.hide();
		rowPages.$el.show();
		rowIcon.$el.hide();
		slideTypes.$el.hide();
		bgImage.$el.hide();
		blurImage.$el.hide();
		glassColor.$el.hide();
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
		bgOverlay = attributeByName('overlay'),
		rowPages = attributeByName('page');


	if (updatedColor === 'has-image') {
		bgImage.$el.show();
		bgOverlay.$el.show();
	} else {
		bgImage.$el.hide();
		bgOverlay.$el.hide();
	}
}

wp.shortcake.hooks.addAction('meh_row.row_color', updateRowColorListener);
