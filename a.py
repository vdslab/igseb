import json

outpuy = []
with open("./edge.json") as f:
    data = json.load(f)
    for i in data:
        outpuy.append({"source":int(i["source"]), "target":int(i["target"])})
        print(int(i["source"]))
#print(outpuy)
print("#########")