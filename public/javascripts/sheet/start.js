
require(["sheet/Sheet"], function(Sheet){

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
                cells : [{}, {}],
            },
            {
                cells : [{}, {}],
            },
            {
                cells : [{}, {}],
            },
            {
                cells : [{}, {}],
            },
            {
                cells : [{}, {}],
            },
            {
                cells : [{}, {}],
            },
            {
                cells : [{}, {}],
            }
        ]
    });

    sheet.materializeTo($("#tabs-1"));
    sheet.render();
})
