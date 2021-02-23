import React, {useEffect, useState, useCallback} from 'react';
import {DivGraphs } from './styles';
import * as d3 from 'd3';

import api from '../../services/api';
import { randomBates } from 'd3';

var width = window.innerWidth/1.1;
var height = window.innerHeight/1.2;

export default function Main() {

  const [nodes, setNodes] = useState([
    {
      "id": 1,
      "name": "Negão",
      "age": 12,
      "gender": "M",
      "race": "Cane corso",
      "imageName": "image1.jpg",
      "parentId": 1
    },
    {
      "id": 2,
      "name": "Neguinha",
      "age": 11,
      "gender": "F",
      "race": "Cane corso",
      "imageName": "image2.jpg",
      "parentId": 2
    },
    {
      "id": 3,
      "name": "Nina",
      "age": 9,
      "gender": "F",
      "race": "Cane corso",
      "imageName": "image2.jpg",
      "parentId": 2
    },
    {
      "id": 4,
      "name": "Nila",
      "age": 9,
      "gender": "F",
      "race": "Cane corso",
      "imageName": "image2.jpg",
      "parentId": 2
    },
    {
      "id": 5,
      "name": "Nino",
      "age": 9,
      "gender": "M",
      "race": "Cane corso",
      "imageName": "image1.jpg",
      "parentId": 2
    },
    {
      "id": 6,
      "name": "Boo",
      "age": 6,
      "gender": "M",
      "race": "Cane corso",
      "imageName": "image1.jpg",
      "parentId": 3
    },
    {
      "id": 7,
      "name": "Scooby",
      "age": 6,
      "gender": "M",
      "race": "Cane corso",
      "imageName": "image1.jpg",
      "parentId": 3
    },
    {
      "id": 8,
      "name": "Clifford",
      "age": 6,
      "gender": "M",
      "race": "Cane corso",
      "imageName": "image1.jpg",
      "parentId": 3
    },
    {
      "id": 9,
      "name": "Laika",
      "age": 6,
      "gender": "F",
      "race": "Cane corso",
      "imageName": "image2.jpg",
      "parentId": 4
    },
    {
      "id": 10,
      "name": "Nhoque ",
      "age": 2,
      "gender": "M",
      "race": "Cane corso",
      "imageName": "image1.jpg",
      "parentId": 9
    },
    {
      "id": 11,
      "name": "Quindim",
      "age": 2,
      "gender": "M",
      "race": "Cane corso",
      "imageName": "image1.jpg",
      "parentId": 9
    },
    {
      "id": 12,
      "name": "Panqueca",
      "age": 2,
      "gender": "F",
      "race": "Cane corso",
      "imageName": "image2.jpg",
      "parentId": 9
    },
    {
      "id": 13,
      "name": "Paçoca",
      "age": 2,
      "gender": "F",
      "race": "Cane corso",
      "imageName": "image2.jpg",
      "parentId": 9
    },
    {
      "id": 14,
      "name": "Bisteca",
      "age": 2,
      "gender": "F",
      "race": "Cane corso",
      "imageName": "image2.jpg",
      "parentId": 9
    },
    {
      "id": 15,
      "name": "Torresmo ",
      "age": 2,
      "gender": "M",
      "race": "Cane corso",
      "imageName": "image1.jpg",
      "parentId": 9
    }
  ]);

  // const [nodes, setNodes] = useState( async () => {
  //   const response = await api.get('pets');
  //   console.log(response);
  //   return response;
  // });

  const [links, setLinks] = useState(() => {
    var linkss = [];
    nodes.map((value, index) => {
         linkss.push({ source: value.parentId, target: value.id })
         console.log(linkss)
      });
    return linkss;
  });

    const makeConnections = useCallback( async () => {
      var linkss = [];
      nodes.map((value, index) => {
           linkss.push({ source: value.parentId, target: value.id })
           console.log(linkss)
        });
        setLinks(linkss);
  }, [])

  useEffect(() => {
    // loadNodes();
    makeConnections();  

    var svg =  d3.select("#my_dataviz")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      width = +svg.attr("width"),
      height = +svg.attr("height");
    var toggle = 0;
    
    var simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(function(d) {
        return d.id;
      }))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2));
    
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
      .attr("r", 35)
      .style("fill", "#b3b3b3")
      .style("stroke-width", 4)
      .style("stroke", d => d.gender === "M"  ? "blue" : "red")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .on('dblclick', connectedNodes);
    
    var label = svg.append("g")
    .selectAll(".mytext")
    .data(nodes)
    .enter()
    .append("text")
      .text(function (d) { return d.name; })
      .style("text-anchor", "middle")
      .style("fill", d => d.gender === "M"  ? "blue" : "red")
      .style("font-family", "Arial")
      .style("font-size", 12);

    simulation
      .nodes(nodes)
      .on("tick", ticked);
    
    simulation.force("link")
      .links(links).distance(400)
    
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