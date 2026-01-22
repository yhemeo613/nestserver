import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { runSeed } from './seed';
import dataSource from '../data-source';

async function main() {
  try {
    await dataSource.initialize();
    console.log('数据库连接已建立');
    
    await runSeed(dataSource);
    
    await dataSource.destroy();
    console.log('数据库连接已关闭');
    process.exit(0);
  } catch (error) {
    console.error('播种过程中出错:', error);
    process.exit(1);
  }
}

main();
