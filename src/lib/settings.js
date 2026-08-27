import fs from 'node:fs';
import path from 'node:path';

// fica em content/ e não em src/ para o painel admin poder editar dps

export function getSettings() {
    const file = path.join(process.cwd(), 'content', 'settings.json');
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}