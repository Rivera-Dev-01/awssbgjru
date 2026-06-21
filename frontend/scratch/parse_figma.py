import re

filepath = "/Users/keithalanspeirs/.gemini/antigravity-cli/brain/8f2665b6-abe1-4b37-9d94-0561fc64b6a7/.system_generated/steps/505/output.txt"

with open(filepath, "r") as f:
    text = f.read()

match = re.search(r"layout_6AH108:\n.*?(?=\n\s{4}\w+:|\Z)", text, re.DOTALL)
if match:
    print(match.group(0))
else:
    print("layout_6AH108 not found")
