const mysql = require('mysql2/promise');
const axios = require('axios');

// 数据库配置
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'test'
};

// 连接数据库
async function connectToDatabase() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        return connection;
    } catch (error) {
        console.error('数据库连接出错:', error);
        document.getElementById('status-message').textContent = '数据库连接出错，请检查配置。';
        throw error;
    }
}

// 获取所有表名
async function getTableNames() {
    const connection = await connectToDatabase();
    try {
        const [rows] = await connection.execute('SHOW TABLES');
        const tableNames = rows.map(row => Object.values(row)[0]);
        return tableNames;
    } catch (error) {
        console.error('获取表名时出错:', error);
        document.getElementById('status-message').textContent = '获取表名时出错，请检查数据库。';
        throw error;
    } finally {
        await connection.end();
    }
}

// 填充表选择框
async function populateTableSelect() {
    const tableSelect = document.getElementById('table-select');
    try {
        const tableNames = await getTableNames();
        tableNames.forEach(tableName => {
            const option = document.createElement('option');
            option.value = tableName;
            option.textContent = tableName;
            tableSelect.appendChild(option);
        });
    } catch (error) {
        console.error('获取表名时出错:', error);
    }
}

// 模拟 AI 接口
async function mockAIGenerator(tableName, dataCount, foreignKeyRanges) {
    const generatedData = [];
    for (let i = 0; i < dataCount; i++) {
        const record = {};
        // 这里简单模拟生成数据，实际需要根据表结构和字段类型生成
        for (const [column, range] of Object.entries(foreignKeyRanges)) {
            record[column] = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
        }
        generatedData.push(record);
    }
    return generatedData;
}

// 获取外键字段及其范围
async function getForeignKeyRanges(tableName) {
    const connection = await connectToDatabase();
    try {
        // 这里简单模拟查询外键表的 ID 范围，实际需要根据数据库外键关系查询
        const [rows] = await connection.execute('SELECT MIN(id) as min_id, MAX(id) as max_id FROM related_table');
        const foreignKeyRanges = {
            foreign_key_column: {
                min: rows[0].min_id,
                max: rows[0].max_id
            }
        };
        return foreignKeyRanges;
    } catch (error) {
        console.error('获取外键范围时出错:', error);
        document.getElementById('status-message').textContent = '获取外键范围时出错，请检查数据库。';
        throw error;
    } finally {
        await connection.end();
    }
}

// 生成数据按钮点击事件
document.getElementById('generate-button').addEventListener('click', async () => {
    const tableName = document.getElementById('table-select').value;
    const dataCount = parseInt(document.getElementById('data-count').value);

    try {
        const foreignKeyRanges = await getForeignKeyRanges(tableName);
        const generatedData = await mockAIGenerator(tableName, dataCount, foreignKeyRanges);
        console.log('生成的数据:', generatedData);

        // 插入数据到 MySQL 数据库
        const connection = await connectToDatabase();
        try {
            for (const record of generatedData) {
                const columns = Object.keys(record).join(', ');
                const values = Object.values(record);
                const placeholders = values.map(() => '?').join(', ');
                const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;
                await connection.execute(query, values);
            }
            document.getElementById('status-message').textContent = '数据插入成功。';
        } catch (insertError) {
            console.error('数据插入出错:', insertError);
            document.getElementById('status-message').textContent = '数据插入出错，请检查数据库表结构。';
        } finally {
            await connection.end();
        }
    } catch (error) {
        console.error('生成数据时出错:', error);
    }
});

populateTableSelect();
