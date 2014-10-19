
$(function() {

	function genData() {
		np = 3 + Math.floor(15*Math.random());
		return d3.range(np);
	};

	var SVG_HEIGHT = 300,
		SVG_WIDTH = 600,
		MARGIN_L = 50,
		CELL_WIDTH = 25,
		CELL_HEIGHT = 7,
		CELL_SPACER = 1.5,
		CELL_WIDTH_EFF = CELL_WIDTH + CELL_SPACER,
		CELL_HEIGHT_EFF = CELL_HEIGHT + CELL_SPACER;

	//----------------- main svg viewport ---------------//

	var svg = d3.select("#gr2")
		.append("svg")
			.attr("width", SVG_WIDTH)
			.attr("height", SVG_HEIGHT)
		.append("g")
			.attr("transform", "translate(50," + (SVG_HEIGHT / 3) + ")");

	//------------------ axis ---------------------//

	var xScale = d3.scale.linear()
		.range([0, SVG_WIDTH - MARGIN_L])
		.domain([0, 10]);

	svg.append("g")
		.attr({
			"class": "xAxis",
		})
		.attr("transform", "translate(0,10)")

	var xAxis = d3.svg.axis()
		.orient("bottom")
		.tickFormat(d3.format("d"))
		.scale(xScale);

	//----------------- user interaction -----------------//

	$("#btn0").on("click", update);


	//--------------------init---------------------//

	function update() {
		dataset = genData()
		updatePlot(dataset);
	}


	//----------to calculate values for display in table ---------//

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
			var ncr = diffnc,
				nca = 0,
				ncu = nc_current;
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
			.duration(250)
			.attr({
				x: function(d, i, j) {return i * CELL_WIDTH_EFF;},
				width: CELL_WIDTH,
				height: CELL_HEIGHT,    
				fill: "#FADA5E"		// updated cells
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
					fill: "#539B95",      // new cells
					"fill-opacity": 1e-6,
				});
			cells
				.data(dataset, function(d) {return d;})
				.transition()
					.delay(500)
					.ease("cubic-in-out")
					.duration(500)
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
					fill: "#0077BE"    // exiting cells
				})
			.transition()
				.delay(500)
				.ease("cubic-in-out")
				.duration(250)
				.attr({
					x: 0,
					y: -75,
					"fill-opacity": 1e-6
				})
				.remove();
		// update the axis
		rhi = (dataset.length*CELL_WIDTH) + 25;
		xScale.domain([0, dataset.length]);
		xScale.range([0, rhi]);

		svg.select(".xAxis")
			.transition()
			.duration(500)
			.call(xAxis);

	}

	updatePlot(genData());

});