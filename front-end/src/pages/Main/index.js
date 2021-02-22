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
      
    var svg =  d3.select("#my_dataviz")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      width = +svg.attr("width"),
      height = +svg.attr("height");
    var toggle = 0;
    // var color = d3.scaleOrdinal(d3.schemeCategory20);
    
    var simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(function(d) {
        return d.id;
      }))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2));
    
    // var stuff = document.getElementById('mis').innerHTML;
    // var graph = JSON.parse(stuff);
    
    svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "none")
      .style("pointer-events", "all")
      .call(d3.zoom()
      .scaleExtent([1 / 2, 4])
      .on("zoom", zoomed));
    
    var link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(links)
      .enter().append("line")
      .style("stroke-width", '3px')
      .style("stroke", "#999")
      .style("fill-opacity", 0.6)
    
    var node = svg.append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("r", 25)
      .style("fill", "#3b51bf")
      .attr("stroke", "black")
      .style("stroke-width", 4)

      .style("stroke", "black")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .on('dblclick', connectedNodes);
    
    node.append("svg:title", "fsdfds").text(function(d) { return d.id + '\n' + 'aaa' ; });
    
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


    simulation
      .nodes(nodes)
      .on("tick", ticked);
    
    simulation.force("link")
      .links(links).distance(150);
    
    function zoomed(event) {
      node.attr("transform", event.transform);
      link.attr("transform", event.transform);
      label.attr("transform", event.transform);
    }
    
    function ticked() {
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
    }
    
    var linkedByIndex = {};
    for (var i = 0; i < nodes.length; i++) {
        linkedByIndex[i + "," + i] = 1;
    };
    links.forEach(function (d) {
        linkedByIndex[d.source.index + "," + d.target.index] = 1;
    });
    
    function neighboring(a, b) {
        return linkedByIndex[a.index + "," + b.index];
    }
    
    function connectedNodes() {
        if (toggle == 0) {
            var d = d3.select(this).node().__data__;
            node.style("opacity", function (o) {
                return neighboring(d, o) | neighboring(o, d) ? 1 : 0.15;
            });
            toggle = 1;
        } else {
            node.style("opacity", 1);
            toggle = 0;
        }
    }
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
            if (!event.active) simulation.alphaTarget(0);
            d.fx = d.x;
            d.fy = d.y;
          }
    
  }, [nodes])

  return (
    
    <DivGraphs>
      <h1>Grafos</h1>
      <div id="my_dataviz"></div>
      {/* <Graph/> */}
    </DivGraphs>
  );
}