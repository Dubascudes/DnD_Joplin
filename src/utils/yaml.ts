import * as yaml from 'js-yaml';

export function parseFrontMatter(body:string){
  const m = body.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return { front:null, bodyNoFront: body };
  const data = yaml.load(m[1]) as any || {};
  const bodyNoFront = body.slice(m[0].length);
  return { front: data, bodyNoFront };
}

export function writeFrontMatter(bodyNoFront:string, obj:any){
  const y = yaml.dump(obj, { lineWidth: 100 });
  return `---\n${y}---\n${bodyNoFront.replace(/^\n*/, '')}`;
}
/** Parse a raw YAML string into an object */
export function parse(yamlText: string): any {
    try {
        return yaml.load(yamlText);
    } catch (e) {
        console.warn('YAML parse error:', e);
        return null;
    }
}

/** Stringify an object into YAML */
export function stringify(obj: any): string {
    try {
        return yaml.dump(obj, { noRefs: true });
    } catch (e) {
        console.warn('YAML stringify error:', e);
        return '';
    }
}


