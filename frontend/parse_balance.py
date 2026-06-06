from pathlib import Path
code = Path('src/pages/JavaTracker.jsx').read_text()
ops = {'(': 0, '[': 0, '{': 0}
clos = {')': '(', '}': '{', ']': '['}
in_s = None
esc = False
for i, ch in enumerate(code):
    if in_s:
        if esc:
            esc = False
        elif ch == '\\':
            esc = True
        elif ch == in_s:
            in_s = None
    else:
        if ch in ('"', "'"):
            in_s = ch
        elif ch in ops:
            ops[ch] += 1
        elif ch in clos:
            ops[clos[ch]] -= 1
        if any(v < 0 for v in ops.values()):
            print('negative', i, ch, ops)
            break
print('counts', ops)
