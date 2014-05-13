
$(function() {

	$.getJSON("./data-01.json", function(json) {

		dataset = json;

		var SVG_HEIGHT = 500,
			SVG_WIDTH = 680,
			CELL_WIDTH = 35,
			CELL_HEIGHT = 35,
			CELL_SPACER = 1.5,
			TW = 8,
			TH = 10,
			CELL_WIDTH_EFF = CELL_WIDTH + CELL_SPACER,
			CELL_HEIGHT_EFF = CELL_HEIGHT + CELL_SPACER,
			TEXT_OFFSET_W = Math.floor((CELL_WIDTH/2) - TW/2) ,
			TEXT_OFFSET_H = Math.floor((CELL_HEIGHT/2) + TH/2);

		var svg = d3.select(".plotWin")
			.append("svg")
				.attr({
					height: SVG_HEIGHT,
					width: SVG_WIDTH,
					transform: "translate(25, 25)",
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
					x: function(d, i, j) {
						return (i * CELL_WIDTH_EFF) + TEXT_OFFSET_W;
					},
					y: function(d, i, j) {
						return (j * CELL_HEIGHT_EFF) + TEXT_OFFSET_H;
					},
					"font-size": 10,
					fill: "#848482",
					class: "label"
				});

		$("#btn1").on("click", sortGrid);

		$("#btn2").click(randomGrid);

		$( "#slider" ).slider({
			value: 45,
			min: 30,
			max: 120,
			step: 15,
			slide: function(event, ui) {
				$("#num_cells").val(ui.value);
			}
		});
		$("#num_cells").val($("#slider").slider("value"));


		function update_grid() {
			// JOIN: join new data w/ extant elements, if any
			rows = d3.select("svg").selectAll(".row")
				.data(dataset);

			var cells = rows.selectAll("g")
				.data(function(d, i) {return d;});

			cells.select("text")
				.text(function(d, i) {
					return d;
			})

			// EXIT: removed nodes w/o data, if any
			cells.exit().remove();
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


		// ----------utility functions ------------- //

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

});