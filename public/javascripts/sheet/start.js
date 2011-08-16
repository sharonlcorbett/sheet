
var oldAttach = require.attach;
require.attach = function (url, contextName, moduleName, callback, type) {
    url += (url.indexOf('?') === -1 ? '?' : '&') + 'bust=' + (new
        Date()).getTime()
    return oldAttach.call(require, url, contextName, moduleName,
        callback, type);
}

require(["/javascripts/sheet/Sheet.js"], function(Sheet){

    sheet = new Sheet({

        columns : [
            {
                editable : true,
                header : {
                    value : "Название задачи"
                }
            },
            {
                editable : true,
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
            }
        ]
    });

    sheet.materialize($("#tabs-1"));
    sheet.render();
})
