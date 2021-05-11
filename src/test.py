from itertools import combinations


def check(comb):
    for index, item in enumerate(comb):
        if index == 0:
            continue
        if item - comb[index-1] <= 1:
            return False
    return True


def count_pair(comb, pair):
    if comb[0] == pair[0] and comb[1] == pair[1]:
        return True
    return False


total = 0
arr = list(combinations(range(1,21), 4))
res = []
wrong = []

with_12 = []
with_23 = []
with_34 = []
with_45 = []
with_56 = []
with_67 = []
with_78 = []
with_910 = []

for item in arr:
    if check(item):
        total += 1
        # print(item)
        res.append(item)
    else:
        print(item)
        wrong.append(item)
# print(arr)
print(res)
# print(wrong)
print(len(arr))
print(total)