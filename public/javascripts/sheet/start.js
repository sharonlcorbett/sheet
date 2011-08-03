
var oldAttach = require.attach;
require.attach = function (url, contextName, moduleName, callback, type) {
    url += (url.indexOf('?') === -1 ? '?' : '&') + 'bust=' + (new
        Date()).getTime()
    return oldAttach.call(require, url, contextName, moduleName,
        callback, type);
}

require(["/javascripts/sheet/Sheet.js"], function(Sheet){

    sheet = new Sheet({
        headers : [
            {
                title : "Название задачи"
            },
            {
                title : "Описание"
            },
            {
                title : "ПОПО"
            }
        ]
    });

    sheet.materialize_headers()
    sheet.add_row();
    sheet.add_row();
    sheet.add_row();
    sheet.add_row();
    sheet.add_row();
    sheet.add_row();
    sheet.add_row();
    sheet.add_row();
    sheet.add_row();
    sheet.add_row();
    sheet.add_row();

    $(sheet).bind("column_moved", function(e, cell){
        console.log(cell)
    })

    $(sheet.table).find("th").contextPopup({
        title: 'Заголовок таблицы',
        items: [
            {label:'Переименовать',     icon: "/images/icons/document-rename.png", action:function() { alert('clicked 1') } },
            null,
            {label:'Удалить столбец',     icon: "/images/icons/cross.png", action:function() { alert('clicked 1') } },
        ]});

})