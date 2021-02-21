import React, {useEffect, useState} from 'react';
import {DivGraphs } from './styles';
import * as d3 from 'd3';

var width = window.innerWidth/1.5;
var height = window.innerHeight/1.5;

var links = [
  {source: 1, target: 6},
  {source: 3, target: 4},
  {source: 3, target: 7},
  {source: 4, target: 5},
  {source: 4, target: 7}
]

export default function Main() {
    const [nodes, setNodes] = useState([
      {id: 1},
      {id: 2},
      {id: 3},
      {id: 4},
      {id: 5},
      {id: 6},
      {id: 7},
      {id: 8},
  ]);

    useEffect(() => {
      
      var svg = d3.select("#my_dataviz")
        .append("svg")
          .attr("width", width)
          .attr("height", height)
      
      var data = nodes;
      
      var node = svg.append("g")
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
          .attr("r", 25)
          .attr("cx", width / 2)
          .attr("cy", height / 2)
          .style("fill", "#19d3a2")
          .style("fill-opacity", 0.3)
          .attr("stroke", "#b3a2c8")
          .style("stroke-width", 4)
          .call(d3.drag() 
               .on("start", dragstarted)
               .on("drag", dragged)
               .on("end", dragended));

      var simulation = d3.forceSimulation()
        .force("center", d3.forceCenter().x(width / 2).y(height / 2)) 
        .force("charge", d3.forceManyBody().strength(1))
        .force("collide", d3.forceCollide().strength(.1).radius(30).iterations(1))
        // .force('link', d3.forceLink().links(links))
        
        .nodes(data).on("tick", function(d) {
            node
                .attr("cx", function(d){ return d.x; })
                .attr("cy", function(d){ return d.y; })
          });


          function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(.03).restart();
            d.fx = d.x;
            d.fy = d.y;
          }
          function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
          }
          function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(.03);
            d.fx = null;
            d.fy = null;
          }
    
  }, [nodes])

  return (
    
    <DivGraphs>
      <h1>Grafos</h1>
      <div id="my_dataviz"></div>
    </DivGraphs>
  );
}
