import * as d3 from "d3";
import { cluster } from "d3";
import { useEffect, useState,useRef } from "react";

function App() {

    //実装は隣接行列
    const cluster_number = 10;
    const minSize = 5;
    const mu = 0.5;

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
                        m[u] = 1
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