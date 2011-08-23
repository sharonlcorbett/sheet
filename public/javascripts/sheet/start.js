



require(["sheet/definitions/SheetDefinition"], function(SD){

    sd = new SD({

        resizeMode : "screen",

        columns : [
            {
                editable : true,
                flex : 1,
                width: 200,
                header : {
                    value : "Название задачи"
                }
            },
            {
                editable : true,
                flex  : 2,
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
    })

})

/*require(["sheet/Sheet", "sheet/Operations"], function(Sheet, Operation){

    var sheet = new Sheet({

        resizeMode : "screen",

        columns : [
            {
                editable : true,
                flex : 1,
                width: 200,
                header : {
                    value : "Название задачи"
                }
            },
            {
                editable : true,
                flex  : 2,
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

    sheet_def = sheet.definition;

    sheet.materializeTo($("#tabs-1"));
    sheet.render();


})*/
