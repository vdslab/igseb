import * as d3 from "d3";
import { cluster } from "d3";
import { useEffect, useState,useRef } from "react";


function App() {

    const findBiclusters = (i, j) => {

    }


    useEffect(() => {
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
    }, [])


    return (
      <div>
        <h1>Hello, World!</h1>
      </div>
    );
  }
  
  export default App;