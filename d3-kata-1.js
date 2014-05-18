
$(function() {

	$.getJSON("./data-03.json", function(json) {

		var dataset = json,
			dataset1 = [];

		var SVG_HEIGHT = 400,
			SVG_WIDTH = 550,
			MARGIN_R = 25,
			MARGIN_L = 50,
			MARGIN_T = 25,
			MARGIN_B = 25,
			CHART_HEIGHT = SVG_HEIGHT - MARGIN_T - MARGIN_B,
			CHART_WIDTH = SVG_WIDTH - MARGIN_L - MARGIN_R

		//-------------- data extents -----------------//

		var xExtent = extent(dataset, 'x'),
			yExtent = extent(dataset, 'y');

		//-------------- scales -----------------//

		var xScale = d3.scale.linear()
			.domain(xExtent)
			.range([MARGIN_L, CHART_WIDTH + MARGIN_L])
			.nice();

		var yScale = d3.scale.linear()
			.domain(yExtent)
			.range([CHART_HEIGHT, MARGIN_T])
			.nice();

		//------------------- axes ------------------//

		var xAxis = d3.svg.axis()
			.scale(xScale)
			.orient("bottom")
			.ticks(10)
			.tickSize(-CHART_HEIGHT);

		var yAxis = d3.svg.axis()
			.scale(yScale)
			.orient("left")
			.ticks(10)
			.tickSize(-CHART_WIDTH);

		//----------- create the main svg window -----------//

		var svg = d3.select(".rightPanel")
			.append("svg")
				.attr({
					width: SVG_WIDTH,
					height: SVG_HEIGHT,
					id: "chart"
				});

		svg.append("rect")
			.attr("transform", "translate(" + MARGIN_L + "," + MARGIN_T + ")")
			.attr({
				"width": CHART_WIDTH,
				"height": CHART_HEIGHT,
				"class": "plotWindow"
			});

		// x-axis
		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + (SVG_HEIGHT - MARGIN_T) + ")")
			.call(xAxis);

		// y-axis
		svg.append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(" + MARGIN_L + "," + MARGIN_T + ")")
			.call(yAxis);

		// datapoints
		datapoints = svg.selectAll("circle")
			.data(dataset)
			.enter().append("circle")
				.attr({
					r: 4.,
					"fill": "#FF8C00",
					"class": "datapoint",
					cx: function(d, i) {
						return xScale(d.x);
					},
					cy: function(d, i) {
						return yScale(d.y);
					}
				})



		//----------------- user interaction -----------------//

		$("#btn1").on("click", fnx_y2);

		$("#btn2").click(fnx_y3);


		//------------- plot updates on user interaction ------------//

		function updatePlot(ds) {
			svg.selectAll("circle")
				.data(ds)
				.transition()
					.duration(750)
					.ease("linear")
				.attr("cx", function(d, i) {
					return xScale(d.x);
				})
				.attr("cy", function(d, i) {
					return yScale(d.y);
				});
				svg.select(".y.axis")
					.transition()
					.duration(750)
					.call(yAxis);
		}


		//------------- functions for data manipulation------------//

		function fnx_y2() {
			var dataset1 = [];
			for (var i=0; i<dataset.length; i++) {
				row = dataset[i];
				dataset1.push({"x": row.x, "y": row.y2})
			};
			var yExtent = d3.extent(dataset1, function(d) {
					return d.y;
			});
			yScale.domain(yExtent);
			updatePlot(dataset1);
		}

		function fnx_y3() {
			var dataset1 = [];
			for (var i=0; i<dataset.length; i++) {
				row = dataset[i];
				dataset1.push({"x": row.x, "y": row.y3})
			};
			var yExtent = d3.extent(dataset1, function(d) {
					return d.y;
			});
			yScale.domain(yExtent);
			console.log(dataset1.slice(-1));
			updatePlot(dataset1);
		}

		function sortData() {
			dataset.sort(function(a, b) {
				return b.r - a.r;
			});
			updatePlot();
		}

		function shuffleData() {
			var cn = dataset.length, temp, idx;
			// while there are elements in the array
			while (cn > 0) {
				// choose a random index
				idx = Math.floor(Math.random() * cn);
				// decrement counter by 1
				cn--;
				// swap the last element with it
				temp = dataset[cn];
				dataset[cn] = dataset[idx];
				dataset[idx] = temp;
			}
			updatePlot();
		}

		//------------- utility functions -------------//

		function extent(D, pn) {
			dLen = D.length;
			var tx = [];
			for (var i=0; i<dLen; i++) {
				tx.push(D[i][pn]);
			};
			tx.sort(function(a, b) {
				return a - b;
			})
			res = [tx.slice(0, 1)[0], tx.slice(-1)[0]];
			if (res[0] <= 0) {
				if (res[0] == 0) {
					res[0] = -res[1]/10;
				}
				else
					res[0] *= 1.1;
			}
			else
				res[0] /= 1.1;

			if (res[1] <= 0) {
				if (res[1] == 0) {
					res[1] += -res[0]/10
				}
				else
					res[1] *= res[1]
			}
			else
				res[1] *= 1.1
			return res;
		}

		//---------------------- init ------------------------//
		var dataset1 = [];
			for (var i=0; i<dataset.length; i++) {
				row = dataset[i];
				dataset1.push({"x": row.x, "y": row.y})
			};

		updatePlot(dataset1);


	});

});