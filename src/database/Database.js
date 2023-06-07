import SQLite from 'react-native-sqlite-storage';
export const insertDataIntoDatabase = async responseDetail => {
  try {
    const db = SQLite.openDatabase({name: 'WorkOrder.db'});
    const data = responseDetail;
    console.log('data database', data);

    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS Workorder (wonum TEXT PRIMARY KEY, status TEXT, location TEXT,wopriority INTEGER, description TEXT)',
        [],
        () => {
          console.log('database created');
          data.forEach(item => {
            console.log('inserting item:', item);
            tx.executeSql(
              'INSERT INTO Workorder (wonum, status,location,wopriority,description) VALUES (?, ?,?,?,?)',
              [
                item.wonum,
                item.status,
                item.location,
                item.wopriority,
                item.description,
              ],
              () => {
                console.log(`Inserted ${item.wonum} into the database`);
              },
              error => {
                console.log(`Error inserting ${item.wonum}: ${error}`);
              },
            );
          });
        },
        error => {
          console.log(`Error creating table: ${error}`);
        },
      );
    });
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};
