define([
    'sheet/definitions/SheetDefinition',
    'sheet/definitions/CellDefinition',
    'sheet/definitions/ColumnDefinition',
    'sheet/definitions/HeaderDefinition',
    'sheet/definitions/RowDefinition',
    'sheet/definitions/WidgetDefinition'], function(SheetDefinition,
                                                    CellDefinition,
                                                    ColumnDefinition,
                                                    HeaderDefinition,
                                                    RowDefinition,
                                                    WidgetDefinition){

    var sheet_definition = {

        resizeMode : 'screen',

        columns : [
            {
                editable : true,
                flex : 1,
                width: 200,
                header : {
                    value : 'Title'
                },
                defaultValue : "default value 1"
            },
            {
                editable : true,
                flex  : 2,
                width : 1500,
                header : {
                    value : 'Description'
                },
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
    }

    var sd;

    module("Sheet definition")

    test("parse_test cell", function(){

       var cell = new CellDefinition(sheet_definition.rows[0].cells[0]);
       ok(instanceOf(cell, CellDefinition), 1);
       equal(cell.value(), 'test1', 2);
    })

    test("parse_test row", function(){

       var row = new RowDefinition(sheet_definition.rows[0]);
       ok(instanceOf(row, RowDefinition), 1);
       equal(row.cells.field.count(), 2, 2);
       ok(instanceOf(row.cells.field.getAt(0), CellDefinition), 3);
    })

    test("parse_test header", function(){

       var header = new HeaderDefinition(sheet_definition.columns[0].header);
       ok(instanceOf(header, HeaderDefinition), 1);
       equals(header.value(), 'Title', 2);
    })

    test("parse_test column", function(){

       var column = new ColumnDefinition(sheet_definition.columns[0]);
       ok(instanceOf(column, ColumnDefinition), 1);
       equals(column.width(), 200, 2);

       ok(instanceOf(column.header(), HeaderDefinition), 3);
    })

    test("parse_test column widget", function(){

       var column = new ColumnDefinition(sheet_definition.columns[0]);

       ok(instanceOf(column.defaultWidget(), WidgetDefinition), 1);
    })

    test("parse_test whole sheet", function(){

       sd = new SheetDefinition(sheet_definition);
       ok(sd, 1);
       ok(instanceOf(sd, SheetDefinition), 2)
    })

    test("count test", function(){

        equals(sd.rows.field.count(), 2, 1);
        equals(sd.columns.field.count(), 2, 2);
    })

    test("cell columns test", function(){

        equals(sd.cellAt(0,0).column, sd.columnAt(0), 1);
        equals(sd.cellAt(0,1).column, sd.columnAt(1), 2);
    })

    test("cell default inheritense test", function(){

        equals(sd.cellAt(1,0).value(), sd.columnAt(0).defaultValue(), 1);
        equals(sd.cellAt(1,1).value(), sd.columnAt(1).defaultValue(), 2);

        equals(sd.cellAt(1,0).widget(), sd.columnAt(0).defaultWidget(), 3);
        equals(sd.cellAt(1,1).widget(), sd.columnAt(1).defaultWidget(), 4);
    })

    test("idx", function(){

        equals(sd.columnAt(0).idx, 0, 1);
        equals(sd.columnAt(1).idx, 1, 2);

        equals(sd.rowAt(0).idx, 0, 3);
        equals(sd.rowAt(1).idx, 1, 4);
    })

})