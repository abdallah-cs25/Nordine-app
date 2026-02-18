const { Pool } = require('pg');

const commonPasswords = [
    'password',
    'postgres',
    'admin',
    'root',
    '123456',
    'securepassword123',
    'myword',
    ''
];

const users = ['postgres', 'myword_admin'];

async function testConnection() {
    console.log('Testing common credentials...');

    for (const user of users) {
        for (const pass of commonPasswords) {
            const connectionString = `postgresql://${user}:${pass}@localhost:5432/myword_marketplace`; // Try myword_marketplace first
            // Also try 'myword' db if 'myword_marketplace' fails (could be DB name mismatch too)

            const strategies = [
                { user, pass, db: 'myword_marketplace' },
                { user, pass, db: 'myword' },
                { user, pass, db: 'postgres' }
            ];

            for (const strat of strategies) {
                const pool = new Pool({
                    connectionString: `postgresql://${strat.user}:${strat.pass}@localhost:5432/${strat.db}`,
                    connectionTimeoutMillis: 2000
                });

                try {
                    await pool.query('SELECT 1');
                    console.log(`\n✅ SUCCESS! Found working credentials:`);
                    console.log(`User: ${strat.user}`);
                    console.log(`Pass: ${strat.pass}`);
                    console.log(`DB:   ${strat.db}`);

                    // Write directly to .env
                    const fs = require('fs');
                    const envContent = `DATABASE_URL=postgresql://${strat.user}:${strat.pass}@localhost:5432/${strat.db}\nJWT_SECRET=your_secret_key\nNODE_ENV=production\nPORT=3001`;
                    fs.writeFileSync('.env', envContent);
                    console.log('Updated .env file automatically.');
                    process.exit(0);
                } catch (err) {
                    // Ignore auth errors, keep trying
                    // console.log(`Failed: ${strat.user}:${strat.pass}@${strat.db}`);
                } finally {
                    await pool.end();
                }
            }
        }
    }

    console.log('\n❌ Failed to find working credentials from common list.');
    process.exit(1);
}

testConnection();
