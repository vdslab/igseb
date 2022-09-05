import * as d3 from "d3";
import { cluster } from "d3";
import { useEffect, useState,useRef } from "react";

function App() {

    //実装は隣接行列
    const cluster_number = 10;
    const minSize = 5;
    const mu = 0.2;
    const [width, height] = [800, 800];
    const C = {0:[], 1:[], 2:[], 3:[], 4:[], 5:[], 6:[], 7:[], 8:[], 9:[]};
    let Esub = new Array();
    let neighbors;
    const [nodes, setNodes] = useState([]);
    const [links, setLinks] = useState([]);

 
    const findBiclusters = (i, j) => {
   
        //SとTはグループノードCiとCjの部分集合
        //bijはEijのエッジの部分集合
        let bij = new Array();
        
        //グループノードCiとCjの要素uの近傍ノードのセットkeys
        //SとTはノード
        const uset = new Set(C[i].concat(C[j]));//uset < Ci V Cj
        console.log(i);
        console.log(j);
        console.log(C[i])
        console.log(C[j])
        console.log(uset)
        const keys = [];
        for(const u of uset) {
            keys.push(neighbors[u]);
        }
        console.log(neighbors)
        console.log(keys);
        for(const T of keys) {
            let M = new Map();

            for(const v of T) {

                console.log(neighbors[v])
                for(const u of neighbors[v]) {
                    console.log(M)
                    if(M.has(u) === true) {
                        M.set(u,M.set(u) + 1)
                        console.log("YAY")
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
                        Etmp.push({"source":snode, "target":tnode});
                    }
                }
            }

            //console.log(Etmp);
            if(Etmp.length > minSize) {
                bij = bij.concat(Etmp);
            }
        }

        
        return bij;
    }


    useEffect(() => {

        const igseb = async () => {
            const nodeData = await(await fetch('../data/node.json')).json();
            const linkData = await(await fetch('../data/edge.json')).json();
            const h = new Map();
            h.set(1, 1);
            console.log(h.has(1));
            h.set(1, h.get(1)+1)
            console.log(h.get(1))
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

            //console.log(C);
            //const s = new Set([1, 1, 2, 2, 3].concat([2, 2, 3, 3, 4, 5]));
            //console.log(s)
            console.log(nodeData);
            console.log(linkData);

                        //モデルのチューニング
                        const startSimulation = (nodes, links) => {

                            const simulation = d3
                            .forceSimulation()
                            .nodes(nodes)
                            .force("link", d3.forceLink().strength(0).id((d) => d['id']))
                            .force("center", d3.forceCenter(300, 300))
                            .force('charge', d3.forceManyBody().strength(0.5))
                            .force('collision', d3.forceCollide()
                                  .radius(function (d) {
                                    return 15;
                                  })
                                  .iterations(0.5))
                            .force('x', d3.forceX().x(100).strength(0.3))
                            .force('y', d3.forceY().y(100).strength(0.3))
                            .force('r', d3.forceRadial()
                            .radius(100)
                            .x(100)
                            .y(100)
                            .strength(1))
                            ;
            
                            const ticked = () => {
                                setNodes(nodes.slice());
                                setLinks(links.slice());
                            }
                            
                            
                            simulation.nodes(nodes).on("tick", ticked);
                            simulation.force('link').links(links);
            
                            
                        }


            console.log("$$$$$$$$$$");
            //startSimulation(nodeData, linkData);
            console.log("########");
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

            console.log(Esub)
    
            //グラフGの描画を計算する(force-directedなど)
            //d3.forceを使う
            //V(グラフの頂点を描画する)
    
            for(let i = 0; i < cluster_number; i++) {
                for(let j = 0; j < i-1; j++) {
                    // Bij <- findBiclusters(i,j)

                    /*
                    for(let k = 1; k < Bij; k++) {
                        B_ijを描画
                    }
                    */
                }
            }
    
            //残りのエッジを描画
        }


        igseb();
    }, [])


    return (
      <div>
        
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            <g className="links">
                {Esub.map((link)=> {
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

            <g className="nodes">
                {nodes.map((node) => {
                    return(
                        <circle
                        className="node"
                        r = {6}
                        
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