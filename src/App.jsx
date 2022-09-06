import * as d3 from "d3";
import { forceCluster } from 'd3-force-cluster';
import { useEffect, useState,useRef } from "react";
import { Helmet } from 'react-helmet';

function App() {

    //実装は隣接行列
    const cluster_number = 10;
    const minSize = 7;
    const mu = 0.8;
    const [width, height] = [1200, 800];
    const C = {0:[], 1:[], 2:[], 3:[], 4:[], 5:[], 6:[], 7:[], 8:[], 9:[]};
    let Esub = new Array();
    let neighbors;
    const [nodes, setNodes] = useState([]);
    const [links, setLinks] = useState([]);
    const [paths, setpaths] = useState([]);
    
    const cluster_color = {
        "0":"rgb(255,255,0)",
        "1":"rgb(255,0,0)",
        "2":"rgb(0,255,0)",
        "3":"rgb(0,0,255)",
        "4":"rgb(0,255,255)",
        "5":"rgb(255,0,255)",
        "6":"rgb(128,128,0)",
        "7":"rgb(128,0,128)",
        "8":"rgb(0,0,0)",
        "9":"rgb(0,128,128)",
    }

    
    const d3line = d3.line()
    .x(d => d.x)
    .y(d => d.y);

 
    const findBiclusters = (i, j) => {
   
        //SとTはグループノードCiとCjの部分集合
        //bijはEijのエッジの部分集合
        let bij = new Array();
        
        //グループノードCiとCjの要素uの近傍ノードのセットkeys
        //SとTはノード
        const uset = new Set(C[i].concat(C[j]));//uset < Ci V Cj
        //console.log(i);
        //console.log(j);
        //console.log(C[i])
        //console.log(C[j])
        //console.log(uset)
        const keys = [];
        for(const u of uset) {
            keys.push(neighbors[u]);
        }
        //console.log(neighbors)
        //console.log(keys);
        for(const T of keys) {
            let M = new Map();

            for(const v of T) {

                //console.log(neighbors[v])
                for(const u of neighbors[v]) {
                    //console.log(M)
                    if(M.has(u) === true) {
                        M.set(u,M.set(u) + 1)
                        //console.log("YAY")
                    } else {
                        M.set(u, 1)
                        //console.log("yay")
                    }
                }
            }

            const S = [];
            for(const [key, val] of M) {
                if(val >= mu * T.length) {
                    S.push(key);
                }
            }

            // SとTのエッジ
            const Etmp = [];
            //console.log(S);
            //console.log(T);
            for(const snode of S) {
                for(const tnode of T) {
                    if(neighbors[snode].includes(tnode)) {
                        const source  = snode <= tnode?snode:tnode;
                        const target = snode > tnode?snode:tnode;

                     

                        Etmp.push({"source":source, "target":target});
                    }
                }
            }

            //console.log(Etmp);
            if(Etmp.length > minSize) {
                bij = bij.concat(Etmp);
            }
        }

        console.log(bij)
        return bij.filter((x, i, array) => {
            return array.findIndex((y)=> {
                return y.source === x.source && y.target === x.target;
            }) === i
        });
    }


    useEffect(() => {

        const igseb = async () => {
            const nodeData = await(await fetch('../data/node.json')).json();
            const linkData = await(await fetch('../data/edge.json')).json();
            //隣接行列
            neighbors = new Array(nodeData.length);
            for(let i = 0; i < nodeData.length; i++) {
                neighbors[i] = new Array();
            }

            //console.log(neighbors);

            for(const link of linkData) {
                
                neighbors[link['source']].push(link['target']);
                neighbors[link['target']].push(link['source']);
                
            }

            //console.log(neighbors)
            for(const node of nodeData) {
                C[Number(node["group"])].push(node["id"]);
                //console.log(Number(node["group"]))
            }

            console.log(C);
            //const s = new Set([1, 1, 2, 2, 3].concat([2, 2, 3, 3, 4, 5]));
            //console.log(s)
            console.log(nodeData);
            console.log(linkData);

                        //モデルのチューニング
                        const startSimulation = (nodes, links) => {

                            const simulation = d3
                            .forceSimulation()
                            .nodes(nodes)
                            .force('group', forceCluster()
                            .strength(0.9))
                            .force("link", d3.forceLink().strength(0).id((d) => d['id']))
                            .force("center", d3.forceCenter(width / 2, height/3))
                            .force('charge', d3.forceManyBody().strength(0.5))
                            .force('collision', d3.forceCollide()
                                  .radius(function (d) {
                                    return 15;
                                  })
                                  .iterations(0.5))
                            .force('x', d3.forceX().x(d => {
                                return Number(d.group) * width / 11;
                            }
                            ).strength(0.2))

                            .force('y', d3.forceY().y(d => {
                                return 100;
                            }
                            ).strength(0.3))
                           
                            ;
            
                            const ticked = () => {
                                setNodes(nodes.slice());
                                setLinks(links.slice());

                                console.log(nodeData);
                                console.log(Esub);
                                //データをedgebundling用に変換する
                                let enode = {}
                                let eedge = [];
                    
                                for(const node of nodeData) {
                                    enode[node["id"]] = {"x":node["x"], "y":node["y"]}
                                }
                    
                                for(const edge of Esub) {
                                    eedge.push({"source":String(edge["source"]['id']), "target":String(edge["target"]['id'])});
                                }
                                const fbundling = ForceEdgeBundling()
                                .nodes(enode)
                                .edges(eedge);
                                const results = fbundling();
                                setpaths(results)
                            }
                            
                            
                            simulation.nodes(nodes).on("tick", ticked);
                            simulation.force('link').links(links);
            
                            
                        }



            console.log(nodeData);
            for(let i = 0; i < cluster_number; i++) {
                //console.log(i);
                for(let j = 0; j < i; j++) {
                    
                
                    const BIJ = findBiclusters(i, j);
                    console.log(BIJ);
                    Esub = Esub.concat(BIJ);
                    /*
                    for(let k = 1; k < Bij; k++) {
                        E_sub <- E_sub v B_ijk
                    }
                    */
                }
            }

            Esub = Esub.filter((x, i, array) => {
                return array.findIndex((y)=> {
                    return y.source === x.source && y.target === x.target;
                }) === i
            });
            console.log(Esub)
    
            //グラフGの描画を計算する(force-directedなど)
            //d3.forceを使う
            //V(グラフの頂点を描画する)

            console.log("$$$$$$$$$$");
            startSimulation(nodeData, Esub);
            console.log("########");
            //残りのエッジを描画

            console.log(nodeData);
            console.log(Esub);
            //データをedgebundling用に変換する
            let enode = {}
            let eedge = [];

            for(const node of nodeData) {
                enode[node["id"]] = {"x":node["x"], "y":node["y"]}
            }

            for(const edge of Esub) {
                eedge.push({"source":String(edge["source"]['id']), "target":String(edge["target"]['id'])});
            }

            console.log(enode);
            console.log(eedge);

            const head = document.getElementsByTagName('head')[0];
            const scriptUrl = document.createElement('script');
            scriptUrl.type = 'text/javascript';
            scriptUrl.src = 'd3-ForceEdgeBundling.js';
            head.appendChild(scriptUrl);



;
            
        }


        igseb();
    }, [])


    return (
      <div>
        
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
           {/* <g className="links">
                {links.map((link)=> {
                    //console.log(link)
                    return(
                        <line
                        key={link.source.id + "-" + link.target.id}
                        strokeWidth="0.7"
                        className="link"
                        stroke="black"
                        x1={link.source.x}
                        y1={link.source.y}
                        x2={link.target.x}
                        y2={link.target.y}                    
                        >
                        </line>
                    );
                })}
            </g>
            */}

            <g className = "path">
                {paths.map(path => {
                   // console.log(path)
                    return(<path 
                    d = {d3line(path)}
                    fill-opacity="1"
                    stroke-width = "1"
                    stroke= "rgb(100, 100, 100)"
                    fill = "none"
                        />);
                })
                }
            </g>
            <g className="nodes">
                {nodes.map((node) => {
                    return(
                        <circle
                        className="node"
                        r = {6}
                        style = {{fill:cluster_color[node["group"]]}}
                        cx = {node.x}
                        cy = {node.y}
                        />
                    );
                })}
            </g>
            
        </svg>
      </div>
    );
  }
  
  export default App;