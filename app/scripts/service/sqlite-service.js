/**
 * Created by gusenlin on 16/5/21.
 */
angular.module('HmsModule')
  .service('sqliteService', [
    'baseConfig',
    function (baseConfig) {

      this.buildExpenseSql = function (state) {

        var db = window.sqlitePlugin.openDatabase({
          name: baseConfig.dbName,
          createFromLocation: 1,
          location: baseConfig.dbLocation
        });
        
        db.transaction(function (tx) {
          tx.executeSql('CREATE TABLE IF NOT EXISTS MOBILE_EXP_REPORT_LINE \
                    (line_id integer primary key AUTOINCREMENT,\
                    expenseObject_id INTEGER,\
                    expenseObject_code TEXT,\
                    expenseObject_desc TEXT,\
                    expenseObject_type TEXT,\
                    costObject_id TEXT,\
                    costObject_desc TEXT,\
                    expense_type_id INTEGER,  \
                    expense_type_desc TEXT,   \
                    expense_item_id INTEGER,\
                    expense_item_code TEXT,\
                    expense_item_desc TEXT,\
                    expense_apply_id TEXT,\
                    expense_apply_desc TEST,\
                    expense_price INTEGER,\
                    expense_quantity INTEGER,\
                    currency_code TEXT,\
                    currency_code_desc text,\
                    invoice_quantity INTEGER,\
                    exchange_rate INTEGER,\
                    total_amount INTEGER,\
                    expense_date_from TEXT,\
                    expense_date_to TEXT,\
                    expense_place Text ,\
                    description TEXT,\
                    local_status TEXT,\
                    service_id INTEGER,\
                    creation_date  TEXT ,\
                    created_by TEXT,\
                    timestamp TEXT,\
                    segment_1 INTEGER,\
                    segment_2 INTEGER,\
                    segment_3 INTEGER,\
                    segment_4 INTEGER,\
                    segment_5 INTEGER,\
                    segment_6 TEXT,\
                    segment_7 TEXT,\
                    segment_8 TEXT ,\
                    segment_9 TEXT,\
                    segment_10 TEXT )'
          );
          tx.executeSql('CREATE TABLE IF NOT EXISTS MOBILE_EXP_LINE_PHOTOS (' +
            'photo_id integer primary key, ' +
            'line_id integer, ' +
            'photo_name text,' +
            'photo_src text,' +
            'creation_date text,' +
            'created_by integer)'
          );
        });
      };
    }]);
