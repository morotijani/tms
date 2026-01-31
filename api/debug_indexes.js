const { sequelize } = require('./src/config/database');

(async () => {
    try {
        await sequelize.authenticate();
        console.log("Connected to DB.");
        const [results] = await sequelize.query("SHOW INDEX FROM Users");
        console.log("Indexes on Users table:");
        // Group by Key_name to count them
        const keyCounts = {};
        results.forEach(row => {
            keyCounts[row.Key_name] = (keyCounts[row.Key_name] || 0) + 1;
        });
        console.log(keyCounts);

        console.log("-- Detailed List --");
        results.forEach(row => console.log(`${row.Key_name}: ${row.Column_name}`));

    } catch (error) {
        console.error("Error:", error.message);
    } finally {
        await sequelize.close();
    }
})();
