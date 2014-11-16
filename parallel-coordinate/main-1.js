
$(function() {

	var dragging = {};

	if (!Array.prototype.last){
		Array.prototype.last = function(){
			return this[this.length - 1];
		};
	};

	function uq(arr) {
		var q = arr.filter(function(itm, i, arr) {
			return arr.indexOf(itm) === i;
		});
		return q;
	};

	var colors = [
		'#C46210',
		'#525FC4',
		'#C4C111',
		'#525FC4',
		'#C4C111',
		'#C4112A'
	]

	var margin = {top: 30, right: 10, bottom: 10, left: 10},
		width = 700 - margin.left - margin.right,
		height = 300 - margin.top - margin.bottom;

	var xScale = d3.scale.ordinal()
					.rangePoints([0, width], 1),
		yScale = {},
		classLabel_to_color = d3.scale.ordinal()
					.range(colors);

	var line = d3.svg.line(),
		axis = d3.svg.axis()
			.orient("left")
			.ticks(5)

	var plot_win_1 = d3.select("#gr2").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
			.attr("class", "data_win")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	d3.json("./iris.json", function(err, json) {
		data_all = json;
		// extract the list of dimensions and create a scale for each
		xScale.domain(dimensions = d3.keys(data_all.last()).filter(function(d) {
			return d != "label" && (yScale[d] = d3.scale.linear()
				.domain(d3.extent(data_all, function(p) {
					return +p[d];
				}))
				.range([height, 0]));
		}));

		var classLabels = [];
		data_all.forEach(function(q) {
			classLabels.push(q.label);
		});

		var data_lines = plot_win_1.append("g")
			.attr("class", "data_lines")
			.selectAll("path")
				.data(data_all)
					.enter().append("path")
						.attr("d", create_path)
						.attr("class", "data_line")
						.attr("stroke", function(d, i) {
							switch (+d.label) {
								case 0:
									return '#525FC4';

								case 1:
									return '#C4112A';

								case 2:
									return '#C4C111';
							}

						});
						// .attr("stroke", function(d, i) {
						// 	return classLabel_to_color(classLabels[i]);
						// });

		// add a group element for each dimension
		var dim = plot_win_1.selectAll(".dimension")
			.data(dimensions)
				.enter()
				.append("g")
					.attr("class", "dimension")
						.attr("transform", function(d) {
							return "translate(" + xScale(d) + ")";
						})

					.call(d3.behavior.drag()
						.on("dragstart", function(d) {

							dragging[d] = this.__origin__ = xScale(d);
						})
						.on("drag", function(d) {

							dragging[d] = Math.min(width,
								Math.max(0, this.__origin__ += d3.event.dx));
							data_lines.attr("d", create_path);

							dimensions.sort(function(a, b) {
								return position(a) - position(b);
							});

							xScale.domain(dimensions);

							dim.attr("transform", function(d) {
								return "translate(" + position(d) + ")";
							})
						})
						.on("dragend", function(d) {
							delete this.__origin__;
							delete dragging[d];
							transition(d3.select(this))
								.attr("transform", "translate(" + xScale(d) + ")");
							transition(data_lines)
								.attr("d", create_path);
						}));

		// handles a brush event, toggling the display of data_lines lines
		function brush() {
			var actives = dimensions.filter(function(p) {
				return !yScale[p].brush.empty();
			}),
			extents = actives.map(function(p) {
				return yScale[p].brush.extent();
			});
			data_lines.style("display", function(d) {
				return actives.every(function(p, i) {
					return extents[i][0] <= d[p] && d[p] <= extents[i][1];
				}) ? null : "none";
			});
		}

		// add an axis and title for each dimension
		dim.append("g")
			.attr("class", "axis")
			.each(function(d) {
				d3.select(this).call(axis.scale(yScale[d]));
			})
			.append("text")
				.style("text-anchor", "middle")
				.attr("y", -9)
					.text(function(d) {
						return d;
					});

		// add and store a brush for each axis
		dim.append("g")
			.attr("class", "brush")
				.each(function(d) {
					d3.select(this)
						.call(yScale[d].brush =
							d3.svg.brush().y(yScale[d]).on("brush", brush));
				})
				.selectAll("rect")
					.attr("x", -8)
					.attr("width", 16);

		// returns the path for a given data point
		function create_path(d) {
			return line(dimensions.map(function(p) {
				return [xScale(p), yScale[p](d[p])];
			}));
		}

		function position(d) {
			var v = dragging[d];
			return v == null ? xScale(d) : v;
		}

		function transition(g) {
			return g.transition().duration(500);
		}


		//----------------- user interaction -------------//

		$("#btn1").on("click", eh1);
		$("#btn2").on("click", eh2);
		$("#btn3").on("click", eh3);
		$("#btn4").on("click", eh4);

		//---------------- event handlers ----------------//

		function eh1() {
			dataset = data_all.filter(function(x) {
				return +x.label === 0;
			});
			update_plot(dataset);
		}

		function eh2() {
			dataset = data_all.filter(function(x) {
				return +x.label === 1;
			});
			update_plot(dataset);
		}

		function eh3() {
			dataset = data_all.filter(function(x) {
				return +x.label === 2;
			});
			update_plot(dataset);
		}

		function eh4() {
			update_plot(data_all);
		}


		//---------- main fn to update data view ------------//

		function update_plot(dataset) {
			//JOIN: join new data w/ extant elements, if any
			var data_lines = plot_win_1
				.select(".data_lines")
				.selectAll("path")
				.data(dataset);
			console.log("len of data_lines selection: ", data_lines[0].length);

			// UPDATE (update extant nodes)
			data_lines
				.attr("d", create_path)
				.attr("id", "updated_lines")
				.attr("class", "data_line")
				.attr("stroke", function(d, i) {
					switch (+d.label) {
						case 0:
							return '#525FC4';

						case 1:
							return '#C4112A';

						case 2:
							return '#C4C111';
					}

				});

			// ENTER + APPEND (add new nodes)
			data_lines
				.enter()
				.append("path")
					.attr("d", create_path)
					.attr("id", "new_lines")
					.attr("class", "data_line");

			data_lines
				.data(dataset)

			// EXIT + REMOVE (remove old nodes)
			data_lines
				.exit()
					.attr({
						"class": "exit",
						"fill": "none"
					})
					.remove();

		}

	});

});
