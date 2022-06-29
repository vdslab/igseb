import json

sources = []
targets = []
output = []
with open("source.txt", "r") as f:
    line = f.readlines()
    for i in line:
        sources.append(i.strip())

with open("target.txt", "r") as f:
    line = f.readlines()
    for i in line:
        targets.append(i.strip())
print(len(sources))
print(len(targets))
for s, t in zip(sources, targets):
    output.append(
        {
            "source":s,
            "target":t
        }
    )

with open("edge.json", "w") as f:
    json.dump(output, f, indent=4)