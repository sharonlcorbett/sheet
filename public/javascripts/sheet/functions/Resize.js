define(function(){

    var RESIZE_MODE_CHANGED_EVENT  = "resize_mode_changed",
        SCREEN_MODE                = "screen",
        FREE_MODE                  = "free",

        RESIZE_SLIDER_CLASS        = "resize-slider",
        COLUMN_RESIZER_CLASS       = "column-resizer",
        RESIZE_REJECT_CLASS        = "resize-reject",
        MIN_COLUMN_WIDTH           = 40,
        NOT_RESIZABLE_COLUMN_CLASS = "not-resizable"

    return Class.extend({

        /**
         * Плагин ресайзинга
         *
         * добавляет к Sheet события:
         *
         *  resize_mode_changed(sheet, mode = ("screen"|"free"))
         *
         * к Header:
         *  before_resize(width)
         *  after_resize()
         *
         */

        name : "resize",

        init : function(sheet){

            var me = this;
            this.sheet = sheet;

            console.log(sheet.definition.resizeMode())

            sheet.definition.addFields([

                /**
                 * Режим работы с шириной:
                 *
                 *  screen - таблица полностью умещается в экран и зумится.
                 *           ресайз колонок происходит из расчета ширины таблицы
                 *           и flex'a каждой из колонок
                 *
                 *  free   - каждая колонка имеет фиксированную ширину в пикселях,
                 *           таблица может быть шире экрана. Ресайз происходим путем
                 *           увеличения ширины только одной колонки.
                 */
                "resizeMode"
            ]);

            sheet.definition.setupIf({

                resizeMode: SCREEN_MODE
            });

            var me = this;

            //если ресайзится окно, то в режиме screen нужно ресайзить лист
            //и обновлять значения ширины колонок
            $(window).resize(function(){
                if(me.sheet.definition.resizeMode() == SCREEN_MODE) me.screenModeResize();
            });

            _(sheet.headersPanel.headers).each(function(header){

                header.column_definition.fieldsListener({
                    width : function(){
                        me.transmitColumnSize(header);
                    },
                    flex : function(){
                        me.screenModeResize();
                    }
                });

            });

            sheet.definition.fieldsListener({

                "resizeMode" : function(e, val){

                    if (val == FREE_MODE){
                        me.freeModeResize();
                    } else {
                        me.screenModeResize();
                    }
                }
            });

            $(this.sheet).bind("rendered", $.proxy(this.enableDrag, this));

            this.resizeColumns();
        },

        toggleScreenMode : function(){

            this.sheet.definition.resizeMode(SCREEN_MODE);
        },

        toggleFreeMode : function(){

            this.sheet.definition.resizeMode(FREE_MODE);
        },

        transmitColumnSize : function(column_header){

            var width = column_header.column_definition.width();
            column_header.view.width(width);
            this.sheet.grid.rows[0].cells[column_header.column_definition.orderId()].view.width(width);
        },

        screenModeResize : function(){

            var sheet = this.sheet;

            if (sheet.definition.resizeMode() != SCREEN_MODE) return;

            //ширина листа - 100% доступного пространства

            sheet.view.width("100%");

            //вычисляем ширину листа
            var sheet_width = sheet.view.innerWidth() - 2;

            //считаем сумму всех flex
            var total_flex = 0;
            _.each(sheet.headersPanel.headers, function(header){
                total_flex += header.column_definition.flex();
            });

            var total_width = 0
            $.each(sheet.headersPanel.headers, function(index, header){
                //для каждого столбца обновляем метаинформацию width и
                //физическую ширину ячейки
                var width = Math.round((this.column_definition.flex()/total_flex)*sheet_width);

                this.column_definition.width(width);
                total_width += width;
                //триггер события
                $(this).trigger("after_resize")
            });

            if (total_width > sheet_width){
                var width = sheet.definition.columns()[0].width();
                sheet.definition.columns()[0].width(width - (total_width-sheet_width-20));
            }
        },

        freeModeResize : function(){

            var sheet = this.sheet;

            if (sheet.definition.resizeMode() != FREE_MODE) return;

            //ширина листа -- сумма ширины колонок, вычисляем ее
            var total_width = 0
            _.each(sheet.headersPanel.headers, function(header){
                total_width += header.column_definition.width();
            })

            //ставим размер листа равным ширине колонок
            sheet.view.width(total_width + 2);

            var me = this;
            $.each(sheet.headersPanel.headers, function(index, header){
                me.transmitColumnSize(header);
            });
        },

        /**
         * Функция, подстраивающая ширину физических колонок таблицы
         * на основании метаданных flex и width соответствующих ячеек
         * и режима ресайзинга.
         */
        resizeColumns: function(){

            //me - Sheet
            var sheet = this.sheet;

            switch(sheet.definition.resizeMode()){

                case FREE_MODE:

                    this.freeModeResize();
                    break;

                case SCREEN_MODE:

                    this.screenModeResize();
                    break;
            }
        },

            /*$(sheet).bind("column_moved", function(){
                me.resize_mode_handler(null, sheet, sheet.resize_mode())
            })*/

            //первичное выполнение функции resize_mode_handler
            //для получения ширины колонок и установки ограничений на
            //движки ресайзинга

        enableDrag : function(){

            //вертикальная полоска движка для ресайзинга
            var helper = function(){
                return $("<div class='" + RESIZE_SLIDER_CLASS + "'></div>")
                    .height(sheet.headersPanel.view.height())
                    .css($(sheet.view).offset())
            }

            /**
             * Использование плагина draggable JQueryUI для
             * перетаскивания движка ресайзинга
             */
            this.sheet.view.find("." + COLUMN_RESIZER_CLASS).draggable({
                axis   : "x",
                helper : helper,
                //класс устанавливается на последнюю колонку в режиме screen
                //cancel : "." + RESIZE_REJECT_CLASS
                stop   : $.proxy(this.stopHandler, this)
            })
        },


        //},

        /**
         * Реакция на изменение режима ресайзинга листа внутри плагина.
         * Ресайзит лист с новыми правилами и устанавливает констрейнты
         * на ползунки
         * @param e
         * @param sheet
         * @param mode
         */
        resize_mode_handler : function(e, sheet, mode){

            sheet.resize_columns()
            sheet.headersPanel.view.find("." + COLUMN_RESIZER_CLASS).removeClass(RESIZE_REJECT_CLASS)
            if(mode == "screen"){
                sheet.headersPanel.view.find("." + COLUMN_RESIZER_CLASS + ":last").addClass(RESIZE_REJECT_CLASS)
            }
            sheet.headersPanel.view.find("." + NOT_RESIZABLE_COLUMN_CLASS).find("." + COLUMN_RESIZER_CLASS).addClass(RESIZE_REJECT_CLASS)
        },

        /**
         * Обработка реакции на завершение перетаскивания
         * ползунка колонки
         * @param e
         * @param ui
         */
        stopHandler : function(e, ui){

            var sheet = this.sheet;

            //на сколько пикселей смещен ползунок, может быть отрицательным
            var move = ui.position.left - ui.originalPosition.left;

            //ячейка Cell, у которой тянули ползунок
            var header = ui.helper.parents("th").data("component");

            //не уменьшаем колонку, если достигнут минимум
            if (move < 0 && header.column_definition.width() <= 40) return

            switch(sheet.definition.resizeMode()){

                case FREE_MODE:

                    /**
                     * В режиме free мы просто добавляем к столбцу ту ширину, на которую
                     * мы подвинули ползунок. Ширина соседних столбцов не меняется. Лист может
                     * выйти за границы экрана и появятся скролбары.
                     */

                    var new_width = header.column_definition.width() + move
                    if (new_width < MIN_COLUMN_WIDTH) {
                        new_width = MIN_COLUMN_WIDTH
                    }

                    //триггер события
                    $(this).trigger("before_resize", [ new_width ])

                    //добавляем ширину
                    header.column_definition.width(new_width);
                    this.freeModeResize();
                    break;

                case SCREEN_MODE:

                    /**
                     * В режиме screen мы увеличиваем/уменьшаем ширину столбца за счет соседнего столбца,
                     * Лист не может выйти за границы экрана, т.к. ширина листа не меняется.
                     */

                    //ищем соседнюю колонку
                    var next_header = $(header.view).next("th").data("component"),
                        header_width = header.column_definition.width(),
                        next_header_width = next_header.column_definition.width(),

                        new_header_width      = header.column_definition.width() + move,
                        new_next_header_width = next_header.column_definition.width() - move

                    if (move < 0){
                        if (new_header_width < MIN_COLUMN_WIDTH){
                            new_header_width = MIN_COLUMN_WIDTH
                            new_next_header_width = next_header_width + header_width - MIN_COLUMN_WIDTH - 1
                        }
                    } else {
                        if (new_next_header_width < MIN_COLUMN_WIDTH){
                            new_next_header_width = MIN_COLUMN_WIDTH
                            new_header_width = header_width + next_header_width - MIN_COLUMN_WIDTH - 1
                        }
                    }

                    //триггер события
                    $(header)     .trigger("before_resize", [ new_header_width ])
                    $(next_header).trigger("before_resize", [ new_next_header_width ])

                    //добавляем ширину
                    header.column_definition.width(new_header_width)
                    next_header.column_definition.width(new_next_header_width)

                    break;
            }

            //считаем общую ширину листа
            var total_width = sheet.grid.view.innerWidth()
            _.each(sheet.definition.columns(), function(column){
                //обновляем flex у каждого столбца
                column.flex(column.width() / total_width, false);
            })

        }

        /*column_definition_changed : function(sheet, column_definition, column_header, name, value){


            switch(name){

                case "flex":
                    if (sheet.definition.resize_mode() == SCREEN_MODE) {
                        sheet.resize_columns();
                    }
                    break;
                case "width":
                    if (sheet.definition.)
            }

        }*/


    //});
    });

})