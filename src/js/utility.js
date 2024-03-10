
var dbPromise = idb.open('posts-store', 1, function (db) {
    if (!db.objectStoreNames.contains('posts')) {
      db.createObjectStore('posts', {keyPath: 'id'});
    }
  });
  
  function writeData(st, dataArray) {
    return dbPromise
      .then(function(db) {
        var tx = db.transaction(st, 'readwrite');
        var store = tx.objectStore(st);
  
        dataArray.forEach(function(dataItem) {
          store.put(dataItem);
        });
  
        return tx.complete;
      });
  }
  
  function readAllData(st) {
    return dbPromise
      .then(function(db) {
        var tx = db.transaction(st, 'readonly');
        var store = tx.objectStore(st);
        return store.getAll();
      });
  }
  
  function readDataById(st, id){
    return dbPromise
      .then(function (db) {
        var tx = db.transaction(st, 'readonly');
        var store = tx.objectStore(st);
        return store.get(id);
      })
      .then(function (data) {
        if (data) {
          // Data dengan spesifik id ditemukan
          return data;
        } else {
          // Data dengan spesifik id tidak ditemukan
          console.log('Data not found for ID ' + id);
          return null;
        }
      })
      .catch(function (error) {
        // tidak ada data dengan id tersebut
        console.error('Error reading data by ID:', error);
        throw error; 
      });
  }
  
  function clearAllData(st) {
    return dbPromise
      .then(function(db) {
        var tx = db.transaction(st, 'readwrite');
        var store = tx.objectStore(st);
        store.clear();
        return tx.complete;
      });
  }
  
  function deleteItemFromData(st, id) {
    dbPromise
      .then(function(db) {
        var tx = db.transaction(st, 'readwrite');
        var store = tx.objectStore(st);
        store.delete(id);
        return tx.complete;
      })
      .then(function() {
        console.log('Item deleted!');
      });
  }