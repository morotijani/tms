const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const scanDatabase = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
        });

        console.log(`Connected to ${process.env.DB_NAME}. Scouting for duplicate indexes...`);

        // Get all tables
        const [tables] = await connection.execute('SHOW TABLES');
        const tableList = tables.map(t => Object.values(t)[0]);

        console.log(`Found ${tableList.length} tables:`, tableList.join(', '));

        let issuesFound = 0;

        for (const table of tableList) {
            const [indexes] = await connection.execute(`SHOW INDEX FROM \`${table}\``);

            // Map column(s) signature to list of index names
            // key: "col1,col2" -> value: ["indexName1", "indexName2"]
            const indexSignatures = {};

            indexes.forEach(idx => {
                if (idx.Key_name === 'PRIMARY') return;

                // Simple check for single-column indexes for now (most common issue)
                // For multi-column, we'd need to group by Key_name first to get full signature
            });

            // Better approach: Group by Key_name first to reconstruct the full index definition
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

            // Now compare definitions
            // Definition Signature: "col1-col2-unique"
            const uniqueSignatures = {};

            Object.entries(definedIndexes).forEach(([keyName, cols]) => {
                if (keyName === 'PRIMARY') return;

                // Sort columns by sequence to ensure order matches
                cols.sort((a, b) => a.seq - b.seq);
                const colString = cols.map(c => c.col).join(',');
                const signature = `${colString}|unique:${cols[0].non_unique === 0}`;

                if (!uniqueSignatures[signature]) {
                    uniqueSignatures[signature] = [];
                }
                uniqueSignatures[signature].push(keyName);
            });

            // Check for duplicates
            Object.entries(uniqueSignatures).forEach(([sig, names]) => {
                if (names.length > 1) {
                    console.warn(`[ALERT] Table '${table}' has ${names.length} duplicate indexes for signature [${sig}]:`);
                    console.warn(`       Names: ${names.join(', ')}`);
                    issuesFound++;

                    // Auto-fix suggestion logic (not running it yet)
                    // Keep the shortest name?
                }
            });
        }

        if (issuesFound === 0) {
            console.log('✅ scan complete. No duplicate indexes found in other tables.');
        } else {
            console.log(`⚠️ scan complete. Found duplicate indexes in ${issuesFound} places.`);
        }

        await connection.end();

    } catch (error) {
        console.error('Scan failed:', error);
    }
};

scanDatabase();
