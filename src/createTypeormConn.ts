import { createConnection, Connection } from 'typeorm';

export const createTypeormConn = async (): Promise<Connection | null> => {
  try {
    return await createConnection();
  } catch (err) {
    // TODO Log error
  }
  return null;
}