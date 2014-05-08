
d3.json("./grid-1x.json", function(json) {

	dataset = json;

	var CELL_WIDTH = 50,
	CELL_HEIGHT = 50,
	CELL_SPACING = 1.5,
	CELL_WIDTH_EFF = 51.5,
	CELL_HEIGHT_EFF = 51.5;

	var svg = d3.select(".wrapper")
		.append("svg")
			.attr("height", 500)
			.attr("width", 660)
			.attr({
				height: 500,
				width: 500,
				transform: "translate(100, 130)",
				class: "grid"
			});

	var rows = svg.selectAll("g")
		.data(dataset)
		.enter()
		.append("g")
			.attr("class", "row");

	var cells = rows.selectAll("g")
		.data(function(d, i) {return d;})
		.enter()
		.append("g")
		.attr("class", "cell");

	cells.append("rect")
		.attr({
			x: function(d, i, j) {return i * CELL_WIDTH_EFF;},
			y: function(d, i, j) {return j * CELL_HEIGHT_EFF;},
			width: CELL_WIDTH,
			height: CELL_HEIGHT,
			fill: "#FDEE00"
		});

	cells.append("text")
		.text(function(d, i) {
			return d;
		})
			.attr({
				x: function(d, i, j) {return (i * CELL_WIDTH_EFF) + 18;},
				y: function(d, i, j) {return (j * CELL_HEIGHT_EFF) + 28;},
				fill: "#848482",
				class: "label"
			});

	d3.select("#btn1")
		.on("click", sortGrid);

	d3.select("#btn2")
		.on("click", randomGrid);

	function update_grid() {
		// update extant nodes w/ new data
		rows = d3.select("svg").selectAll(".row")
			.data(dataset);

		var cells = rows.selectAll("g")
			.data(function(d, i) {return d;});

		cells.select("text")
			.text(function(d, i) {
				return d;
			})
	};

	function sort_2d_array(a2) {
		var rowLen = a2[0].length,
			a = flatten(a2);
		a.sort(function(x, y) {
			return y - x;
		});
		return rollUp(a, rowLen);
	};

	function unsort_2d_array(a2) {
		var rowLen = a2[0].length,
			a = flatten(a2);
		// Fisher-Yates shuffle
		function shuffle(array1d) {
			var cn = array1d.length, temp, idx;
			// while there are elements in the array
			while (cn > 0) {
				// choose a random index
				idx = Math.floor(Math.random() * cn);
				// decrement counter by 1
				cn--;
				// swap the last element with it
				temp = array1d[cn];
				array1d[cn] = array1d[idx];
				array1d[idx] = temp;
			}
			return array1d;
		}
		return rollUp(shuffle(a), rowLen);
	}

	// event handlers for UI widgets
	function sortGrid() {
		dataset = sort_2d_array(dataset);
		update_grid();
	}

	function randomGrid() {
		dataset = unsort_2d_array(dataset);
		update_grid();
	}


	// utility functions

	// flattens a 2d array
	function flatten(array2d) {
		var a = array2d.reduce(function(a, b) {
				return a.concat(b);
			});
			return a;
	}

	// creates a 2d array from a flat array
	function rollUp(array1d, rowLen) {
		var st = 0,
		a2x = [];
		for (nd=rowLen; nd<array1d.length+1; nd+=rowLen) {
			a2x.push(array1d.slice(st, nd));
			st += rowLen;
		}
		return a2x;
	}

});