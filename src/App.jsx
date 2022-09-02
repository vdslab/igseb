import * as d3 from "d3";
import { cluster } from "d3";
import { useEffect, useState,useRef } from "react";

function App() {

    //実装は隣接行列
    const cluster_number = 10;
    const minSize = 5;
    const mu = 0.5;
    const [width, height] = [800, 800];

    const [nodes, setNodes] = useState([]);
    const [links, setLinks] = useState([]);

    const findBiclusters = (i, j) => {
        //SとTはグループノードCiとCjの部分集合
        //bijはEijのエッジの部分集合
        let bij = []
        
        //グループノードCiとCjの要素uの近傍ノードのセットkeys
        const keys = neighbors(u);

        for(const T of keys) {
            M = new Map();

            for(const v of T) {

                for(const u of neighbors(v)) {
                    if(u in M) {
                        M[u] += 1
                    } else {
                        M[u] = 1
                    }
                }
            }

            const S = u;
            const Etmp = Eij;

            if(Etmp > minSize) {
                Bij = add;
            }
        }

        
        return Bij;
    }


    useEffect(() => {

        const igseb = async () => {
            const nodeData = await(await fetch('../data/node.json')).json();
            const linkData = await(await fetch('../data/edge.json')).json();
            console.log(nodeData);
            console.log(linkData);

                        //モデルのチューニング
                        const startSimulation = (nodes, links) => {

                            const simulation = d3
                            .forceSimulation()
                            .nodes(nodes)
                            .force("link", d3.forceLink().strength(0).id((d) => d['id']))
                            .force("center", d3.forceCenter(100, 100))
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
            startSimulation(nodeData, linkData);
            console.log("########");
            console.log(nodeData);
            for(let i = 0; i < cluster_number; i++) {
                for(let j = 0; j < i-1; j++) {
                    // Bij <- findBiclusters(i,j)
    
                    /*
                    for(let k = 1; k < Bij; k++) {
                        E_sub <- E_sub v B_ijk
                    }
                    */
                }
            }
    
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
                {links.map((link)=> {
                    console.log(link)
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

            <line x1="0" y1="80" x2="100" y2="20" stroke="black" />
          
  
            
        </svg>
      </div>
    );
  }
  
  export default App;