// Script utilitário para gerar o hash seguro de usuário e senha
// Uso: node generate-hash.js <usuario> <senha>
import crypto from 'crypto';

const user = process.argv[2] || 'admin';
const pass = process.argv[3] || 'vinteum2026';
const salt = process.argv[4] || 'vinteum_dashboard_secure_salt_2026';

const combined = `${user.trim().toLowerCase()}:${pass.trim()}:${salt}`;
const hash = crypto.createHash('sha256').update(combined).digest('hex');

console.log('========================================================');
console.log('       CREDENCIAIS SEGURAS GERADAS COM SUCESSO         ');
console.log('========================================================');
console.log(`Usuário:  ${user}`);
console.log(`Senha:    ${pass}`);
console.log(`Salt:     ${salt}`);
console.log(`Hash:     ${hash}`);
console.log('========================================================');
console.log('\nCopie e cole no seu arquivo .env.local:');
console.log(`VITE_AUTH_USER=${user}`);
console.log(`VITE_AUTH_SALT=${salt}`);
console.log(`VITE_AUTH_HASH=${hash}`);
console.log('========================================================');
