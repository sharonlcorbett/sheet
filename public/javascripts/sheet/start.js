
var oldAttach = require.attach;
require.attach = function (url, contextName, moduleName, callback, type) {
    url += (url.indexOf('?') === -1 ? '?' : '&') + 'bust=' + (new
        Date()).getTime()
    return oldAttach.call(require, url, contextName, moduleName,
        callback, type);
}

require(["sheet/Sheet"], function(Sheet){

    sheet = new Sheet({

        resize_mode : "free",

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
                cells : [
                    {
                        value : "Привет"
                    },
                    {
                        value : "Привет"
                    }
                ]
            },
        ]
    });

    sheet.materialize($("#tabs-1"));
    sheet.render();
})
