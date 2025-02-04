import fs from 'fs';
import dotenv from 'dotenv';

try {
  const envConfig = dotenv.parse(fs.readFileSync('.env.local'));
  console.log('Successfully parsed .env.local:');
  console.log(envConfig);
  fs.writeFileSync('env.json', JSON.stringify(envConfig, null, 2));
} catch (error) {
  console.error('Error parsing .env.local:', error);
}
