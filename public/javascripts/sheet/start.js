
var oldAttach = require.attach;
require.attach = function (url, contextName, moduleName, callback, type) {
    url += (url.indexOf('?') === -1 ? '?' : '&') + 'bust=' + (new
        Date()).getTime()
    return oldAttach.call(require, url, contextName, moduleName,
        callback, type);
}

/*require(["/javascripts/sheet/Sheet.js"], function(Sheet){

    sheet = new Sheet({
        headers : [
            {
                value : "Название задачи"
            },
            {
                value : "Описание"
            },
            {
                value : "ПОПО"
            },
            {
                value : "ПОПО"
            }
        ]
    });

    sheet.materialize($("#tabs-1"));
    sheet.render();

})*/


require(["/javascripts/sheet/definition/SheetDefinition.js"], function(SD){

    sheet = new SD({

        columns : [
            {
                editable : true,
                header : {
                    value : "Название задачи"
                }
            }
        ],

        rows : [
            {
                cells : [
                    {
                        value : "Привет"
                    }
                ]
            }
        ]
    });

    //sheet.materialize($("#tabs-1"));
    //sheet.render();

})
