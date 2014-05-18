
$(function () {

	function genData() {
		np = 1 + Math.floor(15*Math.random());
		return d3.range(np);
	};

	var SVG_HEIGHT = 500,
		SVG_WIDTH = 800,
		CELL_WIDTH = 25,
		CELL_HEIGHT = 25,
		CELL_SPACER = 1.5,
		CELL_WIDTH_EFF = CELL_WIDTH + CELL_SPACER,
		CELL_HEIGHT_EFF = CELL_HEIGHT + CELL_SPACER;

	var svg = d3.select("body")
		.append("svg")
			.attr("width", SVG_HEIGHT)
			.attr("height", SVG_WIDTH)
		.append("g")
			.attr("transform", "translate(50," + (SVG_HEIGHT / 3) + ")");

	//----------------- user interaction -----------------//

	$("#btn1").on("click", update);


	//--------------------init---------------------//

	function update() {
		dataset = genData()
		updatePlot(dataset);
	}

	function cellCounter(dataLen) {
		var nc_last = $("#tnc").text();
			nc_current = dataLen,
			diffnc = Number(nc_last) - nc_current;

		if (diffnc < 0) {
			var ncr = 0,
				nca = -diffnc,
				ncu = nc_last;
		}
		else if (diffnc === 0) {
			var ncr = 0,
				nca = 0,
				ncu = nc_last;
		}
		else if (diffnc > 0) {
			var ncr = nc_current,
				nca = 0,
				ncu = diffnc;
		}
		return [dataLen, nca, ncr, ncu];
	}

	//--------------------init---------------------//

	function updatePlot(dataset) {

		res = cellCounter(dataset.length);

		$("#tnc").text(res[0]);
		$("#nca").text(res[1]);
		$("#ncr").text(res[2]);
		$("#ncu").text(res[3]);

		// DATA JOIN
		var cells = svg.selectAll("rect")
			.data(dataset, function(d) {return d;});
		// UPDATE (update extant nodes)
		cells
			.attr("class", "update")
			.transition()
			.duration(500)
			.attr({
				x: function(d, i, j) {return i * CELL_WIDTH_EFF;},
				width: CELL_WIDTH,
				height: CELL_HEIGHT,
				fill: "#696969",      // grey for updated cells
			});
		// ENTER (create new nodes)
		cells
			.enter()
			.append("rect")
				.attr({
					"class": "enter",
					x: 0,
					y: -75,
					width: CELL_WIDTH,
					height: CELL_HEIGHT,
					fill: "#0E7C61",      // green for new cells
					"fill-opacity": 1e-6,
				})
			cells.data(dataset, function(d) {return d;})
				.transition()
					.delay(500)
					.ease("cubic-in-out")
					.duration(750)
						.attr({
							x: function(d, i, j) {
								return i * CELL_WIDTH_EFF;
							},
							y: -75,
							"fill-opacity": 1
						});
		// EXIT (remove extant nodes having no data)
		cells
			.exit()
				.attr({
					"class": "exit",
					fill: "#CC6666"    // red for exiting cells
				})
			.transition()
				.delay(750)
				.ease("cubic-in-out")
				.duration(750)
				.attr({
					x: 0,
					y: -75,
					"fill-opacity": 1e-6
				})
				.remove();

	}

	updatePlot(genData());

});