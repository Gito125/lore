import { uuidv7 } from 'uuidv7';

/**
 * Generates a UUID v7 string to be used as the primary key for all models.
 * UUID v7 provides time-sortable IDs that work efficiently with database indexes.
 */
export const newId = (): string => uuidv7();
