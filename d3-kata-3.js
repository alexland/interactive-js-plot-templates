
$(function() {

	var W = 400,
		H = 275,
		ML = 50,
		MR = 25,
		MT = 50,
		MB = 25;

	var dataset = [ { key: 0, value: 5 },
					{ key: 1, value: 10 },
					{ key: 2, value: 13 },
					{ key: 3, value: 19 },
					{ key: 4, value: 21 },
					{ key: 5, value: 25 },
					{ key: 6, value: 22 },
					{ key: 7, value: 18 },
					{ key: 8, value: 15 },
					{ key: 9, value: 13 },
					{ key: 10, value: 11 },
					{ key: 11, value: 12 },
					{ key: 12, value: 15 },
					{ key: 13, value: 20 },
					{ key: 14, value: 18 },
					{ key: 15, value: 17 },
					{ key: 16, value: 16 },
					{ key: 17, value: 18 },
					{ key: 18, value: 23 },
					{ key: 19, value: 25 }
	];

	var xScale = d3.scale.ordinal()
		.domain(d3.range(dataset.length))
		.rangeRoundBands([0, W], 0.05);

	var yScale = d3.scale.linear()
		.domain([0, d3.max(dataset, function(d) {
			return d.value;
		})])
		.range([0, H]);

	var key = function(d) {
		return d.key;
	};

	var svg = d3.select("body")
		.append("svg")
		.attr("width", W)
		.attr("height", H)

	svg.selectAll("rect")
		.data(dataset, key)
		.enter()
		.append("rect")
			.attr("x", function(d, i) {
				return xScale(i);
			})
			.attr("y", function(d) {
				return H - yScale(d.value);
			})
			.attr("width", xScale.rangeBand())
			.attr("height", function(d) {
				return yScale(d.value);
			})
			.attr("fill", "steelblue");

	svg.selectAll("text")
		.data(dataset, key)
		.enter()
		.append("text")
		.text(function(d) {
			return d.value;
		})
			.attr("text-anchor", "middle")
			.attr("x", function(d, i) {
				return xScale(i) + xScale.rangeBand() / 2;
			})
			.attr("y", function(d) {
				return H - yScale(d.value) + 14;
			})
			.attr("font-family", "sans-serif")
			.attr("font-size", "10px")
			.attr("fill", "white");


	d3.select("#update").on("click", function() {
		var maxValue = 25;
		var newNumber = Math.round(Math.random() * maxValue);
		var lastKeyValue = dataset[dataset.length - 1].key;

		dataset.pop();
		dataset.unshift({
			key: lastKeyValue + 1,
			value: newNumber
		})

		xScale.domain(d3.range(dataset.length));
		yScale.domain([0, d3.max(dataset, function(d) {
			return d.value;
		})]);

		var bars = svg.selectAll("rect")
			.data(dataset, key);
		// ENTER
		bars.enter()
			.append("rect")
				.attr("x", 0)
				.attr("y", function(d) {
					return H - yScale(d.value);
				})
				.attr("width", xScale.rangeBand())
				.attr("height", H)
				.attr("fill", "steelblue")
		// UPDATE
		bars.transition()
			.delay(500)
			.duration(500)
				.attr("x", function(d, i) {
					return xScale(i);
				})
				.attr("y", function(d) {
					return H - yScale(d.value);
				})
				.attr("width", xScale.rangeBand())
				.attr("height", function(d) {
					return yScale(d.value);
				});
		// EXIT
		bars.exit()
			.transition()
			.duration(500)
				.attr("x", W-MR)
				.attr("y", H)
			.remove();

		// svg.selectAll("text")
		// 	.data(dataset, key)
		// 	.transition()
		// 	.duration(500)
		// 	.text(function(d) {
		// 		return d.value;
		// 	})
		// 		.attr("x", function(d, i) {
		// 			return xScale(i) + xScale.rangeBand() / 2;
		// 		})
		// 		.attr("y", function(d) {
		// 			return H - yScale(d.value) + 14;
		// 		});

	});


});
