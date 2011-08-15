define(function(){

    return function(){

        var RESIZE_MODE_CHANGED_EVENT = "resize_mode_changed",
            SCREEN_MODE               = "screen",
            FREE_MODE                 = "free",

            RESIZE_SLIDER_CLASS       = "resize-slider",
            COLUMN_RESIZER_CLASS      = "column-resizer",
            RESIZE_REJECT_CLASS       = "resize-reject",
            MIN_COLUMN_WIDTH          = 40,
            NOT_RESIZABLE_COLUMN_CLASS="not-resizable"

        return {

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

            init : function(sheet){

                var me = this;

                $.extend(sheet, {

                    //добавляем листу функцию ресайзинга
                    resize_columns: $.proxy(this.resize_columns, sheet),

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
                     *
                     *
                     */
                    resize_mode   : function(mode){

                        if (mode){
                            this.__resize_mode = mode
                            me.resize_mode_handler(null, this, mode)
                            $(this).trigger(RESIZE_MODE_CHANGED_EVENT, [this, mode])
                        }

                        return this.__resize_mode
                    },

                    //скрытая переменная режима ресайзинга
                    __resize_mode : SCREEN_MODE

                })

                $(sheet).bind("column_moved", function(){
                    me.resize_mode_handler(null, sheet, sheet.resize_mode())
                })

                //первичное выполнение функции resize_mode_handler
                //для получения ширины колонок и установки ограничений на
                //движки ресайзинга
                me.resize_mode_handler(null, sheet, sheet.resize_mode())

                //если ресайзится окно, то в режиме screen нужно ресайзить лист
                //и обновлять значения ширины колонок
                $(window).resize($.proxy(function(){if(sheet.resize_mode() == SCREEN_MODE) this.resize_columns()}, sheet))

                //вертикальная полоска движка для ресайзинга
                var helper = function(){
                    return $("<div class='" + RESIZE_SLIDER_CLASS + "'></div>")
                        .height($(sheet.table).height())
                        .css($(sheet.table).offset());
                }

                /**
                 * Использование плагина draggable JQueryUI для
                 * перетаскивания движка ресайзинга
                 */
                sheet.table.find("." + COLUMN_RESIZER_CLASS).draggable({
                    axis   : "x",
                    helper : helper,
                    //класс устанавливается на последнюю колонку в режиме screen
                    cancel : "." + RESIZE_REJECT_CLASS,
                    stop   : $.proxy(this.stop_handler, sheet)
                })
            },

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
                sheet.table.find("." + COLUMN_RESIZER_CLASS).removeClass(RESIZE_REJECT_CLASS)
                if(mode == "screen"){
                    sheet.table.find("." + COLUMN_RESIZER_CLASS + ":last").addClass(RESIZE_REJECT_CLASS)
                }
                sheet.table.find("." + NOT_RESIZABLE_COLUMN_CLASS).find("." + COLUMN_RESIZER_CLASS).addClass(RESIZE_REJECT_CLASS)
            },

            /**
             * Обработка реакции на завершение перетаскивания
             * ползунка колонки
             * @param e
             * @param ui
             */
            stop_handler : function(e, ui){

                var sheet = this;

                //на сколько пикселей смещен ползунок, может быть отрицательным
                var move = ui.position.left - ui.originalPosition.left;

                //ячейка Cell, у которой тянули ползунок
                var cell = ui.helper.parents("th").data("cell")

                //не уменьшаем колонку, если достигнут минимум
                if (move < 0 && cell.width <= 40) return

                switch(sheet.resize_mode()){

                    case FREE_MODE:

                        /**
                         * В режиме free мы просто добавляем к столбцу ту ширину, на которую
                         * мы подвинули ползунок. Ширина соседних столбцов не меняется. Лист может
                         * выйти за границы экрана и появятся скролбары.
                         */

                        var new_width = cell.width + move
                        if (new_width < MIN_COLUMN_WIDTH) {
                            new_width = MIN_COLUMN_WIDTH
                        }

                        //триггер события
                        $(this).trigger("before_resize", [ new_width ])

                        //добавляем ширину
                        cell.width = new_width
                        break;

                    case SCREEN_MODE:

                        /**
                         * В режиме screen мы увеличиваем/уменьшаем ширину столбца за счет соседнего столбца,
                         * Лист не может выйти за границы экрана, т.к. ширина листа не меняется.
                         */

                        //ищем соседнюю колонку
                        var next_cell = $(cell.table_cell).next("th").data("cell");

                        var new_width_cell      = cell.width + move
                        var new_width_next_cell = next_cell.width - move

                        if (move < 0){
                            if (new_width_cell < MIN_COLUMN_WIDTH){
                                new_width_cell = MIN_COLUMN_WIDTH
                                new_width_next_cell = next_cell.width + cell.width - MIN_COLUMN_WIDTH
                            }
                        } else {
                            if (new_width_next_cell < MIN_COLUMN_WIDTH){
                                new_width_next_cell = MIN_COLUMN_WIDTH
                                new_width_cell = cell.width + next_cell.width - MIN_COLUMN_WIDTH
                            }
                        }

                        //триггер события
                        $(cell)     .trigger("before_resize", [ new_width_cell ])
                        $(next_cell).trigger("before_resize", [ new_width_next_cell ])

                        //добавляем ширину
                        cell.width = new_width_cell
                        next_cell.width = new_width_next_cell

                        break;
                }

                //считаем общую ширину листа
                var total_width = sheet.table.width()
                $.each(sheet.headers, function(){
                    //обновляем flex у каждого столбца
                    this.flex = this.width / total_width;
                })

                //применяем изменения
                sheet.resize_columns()
            },

            /**
             * Функция, подстраивающая ширину физических колонок таблицы
             * на основании метаданных flex и width соответствующих ячеек
             * и режима ресайзинга.
             */
            resize_columns : function(){

                //me - Sheet
                var sheet = this;

                switch(sheet.resize_mode()){

                    case SCREEN_MODE:

                        //ширина листа - 100% доступного пространства
                        sheet.table.css("width", "100%");

                        //вычисляем ширину листа
                        var sheet_width = $(sheet.table).innerWidth();

                        //считаем сумму всех flex
                        var total_flex = 0;
                        $.each(sheet.headers, function(){
                            total_flex += this.flex
                        });

                        $.each(sheet.headers, function(){
                            //для каждого столбца обновляем метаинформацию width и
                            //физическую ширину ячейки
                            var width = (this.flex/total_flex)*sheet_width

                            this.width = width
                            this.table_cell.width(width)
                            //триггер события
                            $(this).trigger("after_resize")
                        })

                    break;

                    case FREE_MODE:

                        //ширина листа -- сумма ширины колонок, вычисляем ее
                        var total_width = 0
                        $.each(sheet.headers, function(){

                            //ширина колонок записана в метаинформации
                            if (this.width < 20)
                                this.width = $(this.table_cell).width()
                            total_width += this.width
                        })

                        //ставим размер листа равным ширине колонок
                        $(sheet.table).css("width", total_width.toString() + "px")
                        $.each(sheet.headers, function(){
                            //для каждой строки обновляем физическую ширину ячейки

                            $(this.table_cell).width(this.width);
                            //триггер события
                            $(this).trigger("after_resize")
                        })
                    break;
                }
            }
        }
    }
})