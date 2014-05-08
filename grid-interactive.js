
$(function() {

	$.getJSON("./data-01.json", function(json) {

		dataset = json;

		var ROW_LENGTH = dataset[0].length,
			CELL_WIDTH = 40,
			CELL_HEIGHT = 40,
			CELL_SPACING = 1.5,
			CELL_WIDTH_EFF = CELL_WIDTH + CELL_SPACING,
			CELL_HEIGHT_EFF = CELL_HEIGHT + CELL_SPACING;

		var svg = d3.select(".wrapper")
			.append("svg")
				.attr({
					height: 700,
					width: 800,
					transform: "translate(70, 100)",
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
					x: function(d, i, j) {return (i * CELL_WIDTH_EFF) + 12;},
					y: function(d, i, j) {return (j * CELL_HEIGHT_EFF) + 25;},
					fill: "#848482",
					class: "label"
				});

		//------------- interaction via widgets ---------------- //

		// $("#sortGrid").on("click", sortGrid);

		// $("#sortGrid").on("click", alert1);

		d3.select("#btn1")
			.on("click", console.log("clicked!"));

		// $("#btn1").button().click(console.log("clicked"));

		// .click(sortGrid);

		// $("#btn2").on("click", randomGrid);


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

			// create new nodes & append data
			// ...

			// remove nodes
			// ...
		};

		function sort_2d_array(a2) {
			var a = flatten(a2);
			a.sort(function(x, y) {
				return y - x;
			});
			return rollUp(a);
		}

		function unsort_2d_array(a2) {
			console.log("un-sort called!");
			var a = flatten(a2);
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
			return rollUp(shuffle(a));
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

		function alert1() {
			console.log("alert1 called!")
		}

		// ---------------- utility functions ---------------- //

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
			if (typeof(rowLen)=='undefined') rowLen = ROW_LENGTH;
			for (nd=rowLen; nd<array1d.length+1; nd+=rowLen) {
				a2x.push(array1d.slice(st, nd));
				st += rowLen;
			}
			return a2x;
		}


	});

});