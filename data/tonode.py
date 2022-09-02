import json

output = []
with open('name.txt', 'r') as f:
    line = f.readlines()
    
    for i, name in enumerate(line):
        recode = {}
        recode['id'] = i
        recode['name'] = name.strip()
        output.append(recode)
#print(output)      
with open('group.txt','r') as f:
    line = f.readlines()

    for i, group in enumerate(line):
        output[i]['group'] = group.strip()
print(output) 

with open('node.json', 'w') as f:
    json.dump(output, f, indent=4)
