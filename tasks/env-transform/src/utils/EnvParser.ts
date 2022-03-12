import { EnvEntry } from '../operations/EnvEntry';

export function parse(src: string, includeComments = false): EnvEntry[] {
  const result: EnvEntry[] = [];
  const lines = src.toString().split('\n');
  for (const line of lines) {
    const keyValMatch = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (keyValMatch) {
      const key = keyValMatch[1]?.trim();
      if (key) {
        const value = keyValMatch[2]?.trim();
        result.push({
          key: key,
          value: value
        });
        continue;
      }
    }

    if (includeComments && line.trimLeft().startsWith('#')) {
      result.push({
        key: undefined,
        comment: line
      });
    }
  }
  return result;
}

export function stringify(vars: EnvEntry[]): string {
  let result = '';
  for (const entry of vars) {
    if (entry.key) {
      if (entry.value) {
        const line = `${entry.key}=${String(entry.value)}`;
        result += line + '\n';
      } else {
        const line = `${entry.key}=`;
        result += line + '\n';
      }
      continue;
    }

    if (entry.comment) {
      result += entry.comment + '\n';
      continue;
    }
  }

  return result;
}
