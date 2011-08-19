
require(["sheet/Sheet", "sheet/Operation"], function(Sheet, Operation){

    sheet = new Sheet({

        resizeMode : "screen",

        columns : [
            {
                editable : true,
                width: 200,
                header : {
                    value : "Название задачи"
                }
            },
            {
                editable : true,
                flex  : 0.5,
                width : 1500,
                header : {
                    value : "Описание задачи"
                }
            }
        ],

        rows : [
            {
                cells : [
                    {
                        value : "Привет"
                    },
                    {
                        value : "Привет"
                    }
                ]
            },
            {
                cells : [{}, {}]
            },
            {
                cells : [{}, {}]
            },
            {
                cells : [{}, {}]
            },
            {
                cells : [{}, {}]
            },
            {
                cells : [{}, {}]
            },
            {
                cells : [{}, {}]
            },
            {
                cells : [{}, {}]
            }
        ]
    });

    sheet.materializeTo($("#tabs-1"));
    sheet.render();

    ChangeCellValue = Operation.extend({

        init : function(row_index, column_index, value){

            this.row_index  = row_index;
            this.column_index = column_index;
            this.value = value;

            this._super();
        },

        getCell : function(sheet_def){

            return sheet_def.rows()[this.row_index].cells()[this.column_index];
        },

        forwardFunction : function(sheet_def){

            var cell = this.getCell(sheet_def);
            this.revert_value = cell.value();
            cell.value(this.value);
        },

        backwardFunction: function(sheet_def){

            var cell = this.getCell(sheet_def);
            cell.value(this.revert_value);
        }
    })

})
