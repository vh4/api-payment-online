import type { DataSource } from 'typeorm'
import { Logger } from '@nestjs/common'

export async function checkDatabaseConnection(
  dataSource: DataSource
): Promise<void> {
  const logger = new Logger('DatabaseConnection')

  try {
    await dataSource.query('SELECT 1')
    logger.log(
      'Database connection established successfully.'
    )
  } catch (error) {
    logger.error(
      'Error connecting to the database:',
      error.message
    )
    process.exit(1)
  }
}
