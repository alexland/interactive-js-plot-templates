from this repo's _dynamic data_ directory, a pure client-side demo to illustrate d3's pattern for dynamically loaded data, ie,

* the data

 * JOIN (create the new _selection_)

* the view 

 * UPDATE the extant nodes (bind some/all new data to the extant nodes)
 
 * ENTER + APPEND (create new nodes then bind the remaining new data to them)
 
 * EXIT (remove extant nodes for which there is no data to bind)

![schematic](https://raw.github.com/alexland/interactive-js-plot-templates/master/assets/wiki-image-1.png)




