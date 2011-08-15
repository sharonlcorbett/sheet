/**
 * Класс заголовков таблицы
 * @param settings
 */
define(function(Cell){

    var Meta = Class.extend({

            init : function(){

                this.add_setters([
                    "widget_type",
                    "editable",
                    "value",
                    "resizable",
                    "orderable"
                ])
            }
        });

    return Meta;

})