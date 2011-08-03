
define([
    "/javascripts/sheet/Header.js",
    "/javascripts/sheet/Row.js",
    "/javascripts/sheet/HeaderRow.js"
    ], function(Header, Row, HeaderRow){

    //фабрика объектов Sheet
    return function(settings){
        /**
         * Events:
         *  row_added(row)
         */

        //стандартные настройки
        this.default_settings = {
            //селектор для поиска таблицы
            table_selector : "xx-sheet",
            //высота строки
            row_height     : 20,
            //заголовки таблицы
            headers        : [
                {},
                {},
                {},
                {}
            ],
            plugins: [
                "/javascripts/sheet/plugins/Resize.js",
                "/javascripts/sheet/plugins/EditByClick.js",
                "/javascripts/sheet/plugins/HighlightRow.js",
                "/javascripts/sheet/plugins/MoveRows.js",
                "/javascripts/sheet/plugins/MoveColumns.js",
                "/javascripts/sheet/plugins/Select.js"
            ]
        }

        var table;

        //применяем настройки
        var return_obj = $.extend({}, this.default_settings, settings);

        //ищем в DOM таблицу и связываем ее с листом
        table = $("." + return_obj.table_selector);

        $.each(return_obj.headers, function(){
            //отложенное создание заголовков
            var header = this;
            if(!header.render && !header.materialize){
                //отложенное создание заголовков
                return_obj.headers[return_obj.headers.indexOf(this)] = new Header(header)
            }
        })

        var info_header = new Header({
            title : "",
            flex  : 0,
            width : 40,
            resizable : false,
            orderable : false
        })

        return_obj.headers = $.merge([info_header], return_obj.headers)

        $.extend(return_obj, {

            table : table,
            /**
             * операция добавления новой строки в таблицу
             * @param row
             */
            add_row : function(row){

                if (!row){
                    //создаем строку, если она не передана
                    row = new Row({}, this.headers);
                }
                if(row.phantom){
                    //если строка не матеарилизована, сделаем это
                    row.materialize(table)
                }
                //рендерим строку и её ячейки
                row.render()
                //добавляем строку в список строк
                this.rows.push(row);

                //пробрасываем выше необходимые события
                $(row).bind("edit_finished",  function(e, cell){$(return_obj).trigger("edit_finished",  [cell])})
                $(row).bind("edit_cancelled", function(e, cell){$(return_obj).trigger("edit_cancelled", [cell])})

                //генерируется событие row_added, извещающее подписчиков о добавлении строки
                $(this).trigger("row_added", [row]);
            },

            //строки нашей таблицы
            rows : [],
            //строка заголовков
            header_row: null,

            /**
             * матеарилизация и рендеринг строки заголовков
             */
            materialize_headers : function(){
                if(this.header_row) return;
                this.header_row = new HeaderRow(this.headers)
                this.header_row.materialize(table);
                this.header_row.render();
            },

            /**
             * Возвращает массив всех ячеек в таблице
             */
            getCells : function(){

                var cells = []
                $.each(this.rows, function(){
                    $.merge(cells, this.cells);
                })
                return cells
            }

        })

        //загрузка и инициализация плагинов
        require(return_obj.plugins, function(){
            $.each(arguments, function(){
                (new this()).init(return_obj)
            })
        })

        return return_obj
    }
})
