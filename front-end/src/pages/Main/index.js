import React, {useEffect, useState} from 'react';
import {DivGraphs } from './styles';
import * as d3 from 'd3';

var width = window.innerWidth/1.5;
var height = window.innerHeight/1.5;

export default function Main() {
    const [nodes, setNodes] = useState([
      {id: 0, name: "A"},
      {id: 1, name: "B"},
      {id: 2, name: "C"},
      {id: 3, name: "D"},
      {id: 4, name: "E"},
      {id: 5, name: "F"},
      {id: 6, name: "G"},
      {id: 7, name: "H"},
      {id: 8, name: "I"},
      {id: 9, name: "J"},
      {id: 10, name: "L"},
      {id: 11, name: "M"},
  ]);

  const [links, setLinks] = useState([
    {source: 0, target: 1},
    {source: 1, target: 2},
    {source: 2, target: 3},
    {source: 3, target: 0},
    {source: 0, target: 8},
    // {source: 3, target: 7},
    // {source: 4, target: 5},
    // {source: 4, target: 7}
]);

    useEffect(() => {
      
      var svg = d3.select("#my_dataviz")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
          
      var link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(links)
      .enter().append("line")

      .style("stroke-width", '3px')
      .style("stroke", "#999")
      .style("fill-opacity", 0.6)

      var node = svg.append("g")
        .selectAll("circle")
        .data(nodes)
        .enter().append("circle")
          .attr("r", 25)
          .attr("cx", width / 2)
          .attr("cy", height / 2)
          .style("fill", "#3b51bf")
          // .style("fill-opacity", 0.3)
          .attr("stroke", "black")
          .style("stroke-width", 4)

          .call(d3.drag() 
               .on("start", dragstarted)
               .on("drag", dragged)
               .on("end", dragended))

      var label = svg.append("g")
        .selectAll(".mytext")
        .data(nodes)
        .enter()
        .append("text")
          .text(function (d) { return d.name; })
          .style("text-anchor", "middle")
          .style("fill", "red")
          .style("font-family", "Arial")
          .style("font-size", 12);

      var simulation = d3.forceSimulation()
        .force("center", d3.forceCenter().x(width / 2).y(height / 2)) 
        .force("charge", d3.forceManyBody().strength(1))
        .force("collide", d3.forceCollide().strength(.1).radius(30).iterations(1))
        .force("link", d3.forceLink().id(function(d) {
          return d.id;
        }))
        .nodes(nodes)
        
          simulation.on("tick",function(d) {
            node
              .attr("cx", d => d.x)
              .attr("cy", d => d.y)
            
            link
              .attr("x1", d => d.source.x)
              .attr("y1", d => d.source.y)
              .attr("x2", d => d.target.x)
              .attr("y2", d => d.target.y)

            label
              .attr("x", d => d.x)
              .attr("y", d => d.y + 4);
            
          })

          simulation.force('link', d3.forceLink().links(links).distance(150))

          function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(.01).restart();
            d.fx = d.x;
            d.fy = d.y;
          }
          function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
          }
          function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = d.x;
            d.fy = d.y;
          }
    
  }, [nodes])

  return (
    
    <DivGraphs>
      <h1>Grafos</h1>
      <div id="my_dataviz"></div>
    </DivGraphs>
  );
}
