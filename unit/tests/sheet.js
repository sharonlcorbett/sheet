define([
    'platform/sheet/Sheet',
    'platform/sheet/Cell',
    'platform/sheet/Column',
    'platform/sheet/Row',
    'platform/sheet/Model',
],
function(
    Sheet,
    Cell,
    Column,
    Row,
    Model){

    var sheet_definition = {

        resizeMode : 'screen',

        columns : [
            {
                editable : true,
                flex : 1,
                width: 200,
                value : 'Description',
                defaultValue : "default value 1"
            },
            {
                editable : true,
                flex  : 2,
                width : 1500,
                value : 'Description',
                defaultValue : "default value 2"
            }
        ],

        rows : [
            {
                cells : [
                    {
                        value : 'test1'
                    },
                    {
                        value : 'test2'
                    }
                ]
            },
            {
                cells : [{},{}]
            }
        ]
    };
    
    var EntryModel = new Class({

        Extends : Model,

        Alias : "test.models.entry",

        initialize: function(def){

            var me = this;

            this.addFields([
                {
                    name: "checked",
                    defaultValue : false,
                    options : {
                        humanTitle : "Status",
                        valueType  : "boolean"
                    }
                },
                {
                    name: "text",
                    defaultValue : 'New entry',
                    options : {
                        humanTitle : "Description",
                        valueType  : "string"
                    }
                }
            ]);

            this.parent(def)
        }
    })

    var sd, tests;
    
    tests = {
    
        "parse_test cell": function(test){
    
           var cell = new Cell(sheet_definition.rows[0].cells[0]);
           
           test.ok(instanceOf(cell, Cell), 1);
           test.equal(cell.value(), 'test1', 2);
           
           test.done();
        },
    
        "parse_test row": function(test){
    
           var row = new Row(sheet_definition.rows[0]);
           test.ok(instanceOf(row, Row), 1);
           test.equal(row.cells.count(), 2, 2);
           test.ok(instanceOf(row.cells.getAt(0), Cell), 3);
           
           test.done();
        },
    
    
        "parse_test column": function(test){
    
           var column = new Column(sheet_definition.columns[0]);
           
           test.ok(instanceOf(column, Column), 1);
           test.equal(column.width(), 200, 2);
           
           test.done();
        },    

        "parse_test whole sheet": function(test){
    
            sd = new Sheet(sheet_definition);
            
            test.ok(sd, 1);
            test.ok(instanceOf(sd, Sheet), 2);
            
            test.equal(sd.rows.count(), 2, 1);
            test.equal(sd.columns.count(), 2, 2);
            
            test.equal(sd.cellAt(0,0).column, sd.columnAt(0), 1);
            test.equal(sd.cellAt(0,1).column, sd.columnAt(1), 2);
            
            test.equal(sd.cellAt(1,0).value(), sd.columnAt(0).defaultValue(), 1);
            test.equal(sd.cellAt(1,1).value(), sd.columnAt(1).defaultValue(), 2);
                
            test.done();
        },
        
        "create sheet from model" : function(test){
            
            var sheet = new Sheet({
                modelClass : {
                    alias : "test.models.entry"   
                }
            })
            
            test.equal(sheet.columns.count(), 2);
            
            //generated columns
            test.equal(sheet.columns.getAt(0).value(), "Status");
            test.equal(sheet.columns.getAt(1).value(), "Description");
            
            test.done();
                        
        },
        
        "create sheet from model and some definitions" : function(test){
            
            var sheet = new Sheet({
                
                //set both modelClass ...
                modelClass : {
                    alias : "test.models.entry"   
                },
                
                //... and column definition
                columns : [
                    {
                        value : "test"
                    }
                ]
            })
            
            test.equal(sheet.columns.count(), 3);
            
            //columns from definition
            test.equal(sheet.columns.getAt(0).value(), "test");
            
            //generated columns
            test.equal(sheet.columns.getAt(1).value(), "Status");
            test.equal(sheet.columns.getAt(2).value(), "Description");
            
            test.done();                        
        },
        
        "add and remove many rows" : function(test){
            
            var sheet = new Sheet({
                
                //set both modelClass ...
                modelClass : {
                    alias : "test.models.entry"   
                }                
            })
            
            test.expect(203)
            
            test.equal(sheet.rows.count(), 0);
            
            sheet.watchFields({
                rows : {
                    elementAdded : function(row){
                        test.equal(row.cells.count(), 2);
                    }
                }
            });
            
            (100).times(function(){
                sheet.addRow();  
            });            
            
            test.equal(sheet.rows.count(), 100);          
                        
            sheet.rows.each(function(row){
                
                test.ok(
                    instanceOf(
                        row.model(), 
                        ClassManager.getClass(sheet.modelClass().alias)
                    )
                );           
            });
            
            (100).times(function(){
                sheet.removeRowAt(0);  
            });
            
            test.equal(sheet.rows.count(), 0);
                        
            test.done();                        
        },
        
        "sheet model -> cells binding" : function(test){
            
            var sheet = new Sheet({
                
                modelClass : {
                    alias : "test.models.entry"   
                }
            })
                    
            //addRow follows model definition
            sheet.addRow();
            
            test.expect(3+2+2)
            
            sheet.rowAt(0).model().watchFields({
                checked : {
                    changed : function(value){
                        test.ok(true);
                    }
                }
            });
            
            sheet.cellAt(0,0).watchFields({
                value : {
                    changed : function(value){
                        test.ok(true);
                    }
                }
            });
            
            test.equal(
                sheet.cellAt(0,0).value(), 
                sheet.rowAt(0).model().checked()
            );
            
            sheet.cellAt(0,0).value(
                !sheet.cellAt(0,0).value()
            );
            
            test.equal(
                sheet.cellAt(0,0).value(), 
                sheet.rowAt(0).model().checked()
            );
            
            sheet.rowAt(0).model().checked(
                !sheet.rowAt(0).model().checked()
            );
            
            test.equal(
                sheet.cellAt(0,0).value(), 
                sheet.rowAt(0).model().checked()
            );                
            
            test.done();                        
        },
        
        "add and remove columns" : function(test){
            
            var sheet = new Sheet({
                
                //set both modelClass ...
                modelClass : {
                    alias : "test.models.entry"   
                }                
            })
            
            sheet.addRow();
            
            test.equal(sheet.columns.count(), 2);
            
            sheet.addColumn({
                value : "test",
                defaultValue : "test_cell"
            });
            
            test.equal(sheet.columns.count(), 3);
            test.equal(sheet.columnAt(2).value(), "test");          
            
            test.equal(sheet.rowAt(0).cells.count(), 3);
            test.ok(instanceOf(sheet.rowAt(0).cells.getAt(2), Cell));
            
            var cell = sheet.rowAt(0).cells.getAt(2);
            
            test.equal(cell.value(), "test_cell");
            
            sheet.columns.addElement({
                value : "test",
                defaultValue : "test_cell2"
            }, 'before', null, 2);
            
            test.equal(sheet.columns.count(), 4);
            
            var cell2 = sheet.rowAt(0).cells.getAt(2);
            var cell = sheet.rowAt(0).cells.getAt(3);
            
            test.equal(cell2.value(), "test_cell2");
            test.equal(cell.value(), "test_cell");
                        
            test.done();                
        },
        
        "add and remove many columns" : function(test){
            
            var sheet = new Sheet({
                
                //set both modelClass ...
                modelClass : {
                    alias : "test.models.entry"   
                }                
            });
            
            test.expect(401);
            
            (100).times(function(){
                sheet.addRow();  
            });
            
            (20).times(function(){
                sheet.addColumn();  
            }); 
            
            sheet.rows.each(function(row){
                test.equal(row.cells.count(), 22);
                test.equal(row.cells.getAt(2).column.value(), "New column");
            });
            
            (20).times(function(i){
                sheet.removeColumnAt(21 - i);  
            });
            
            test.equal(sheet.columns.count(), 2);
            
            sheet.rows.each(function(row){
                test.equal(row.cells.count(), 2);
                test.equal(row.cells.getAt(1).column.value(), "Description");
            });
        
            test.done();                
        },
    };
    
    return tests;

});