const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const cleanupAllIndexes = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
        });

        console.log(`Connected to ${process.env.DB_NAME}. Cleaning up ALL duplicate indexes...`);

        // Get all tables
        const [tables] = await connection.execute('SHOW TABLES');
        const tableList = tables.map(t => Object.values(t)[0]);
        let totalDropped = 0;

        for (const table of tableList) {
            const [indexes] = await connection.execute(`SHOW INDEX FROM \`${table}\``);

            const definedIndexes = {};

            indexes.forEach(idx => {
                if (!definedIndexes[idx.Key_name]) {
                    definedIndexes[idx.Key_name] = [];
                }
                definedIndexes[idx.Key_name].push({
                    col: idx.Column_name,
                    seq: idx.Seq_in_index,
                    non_unique: idx.Non_unique
                });
            });

            // Definition Signature: "col1-col2-unique"
            const uniqueSignatures = {};

            Object.entries(definedIndexes).forEach(([keyName, cols]) => {
                if (keyName === 'PRIMARY') return;

                cols.sort((a, b) => a.seq - b.seq);
                const colString = cols.map(c => c.col).join(',');
                const signature = `${colString}|unique:${cols[0].non_unique === 0}`;

                if (!uniqueSignatures[signature]) {
                    uniqueSignatures[signature] = [];
                }
                uniqueSignatures[signature].push(keyName);
            });

            // Check for duplicates
            for (const [sig, names] of Object.entries(uniqueSignatures)) {
                if (names.length > 1) {
                    console.log(`[FIXING] Table '${table}' has ${names.length} duplicate indexes for signature [${sig}].`);

                    // Logic to figure out which one to keep
                    // 1. Keep the one that matches our standard naming if possible 'users_email_unique' or 'email'
                    // 2. Otherwise keep the shortest one

                    // Simple heuristic: shortest length, then alphabetical
                    names.sort((a, b) => a.length - b.length || a.localeCompare(b));

                    const keep = names[0];
                    const dropList = names.slice(1);

                    console.log(`         Keeping: ${keep}`);
                    console.log(`         Dropping: ${dropList.join(', ')}`);

                    for (const indexName of dropList) {
                        try {
                            await connection.execute(`DROP INDEX \`${indexName}\` ON \`${table}\``);
                            totalDropped++;
                        } catch (err) {
                            console.error(`Failed to drop ${indexName} on ${table}:`, err.message);
                        }
                    }
                }
            }
        }

        console.log(`Cleanup complete. Dropped ${totalDropped} redundant indexes.`);
        await connection.end();

    } catch (error) {
        console.error('Scan failed:', error);
    }
};

cleanupAllIndexes();
