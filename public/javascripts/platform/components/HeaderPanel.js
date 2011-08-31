/**
 * Строка заголовков, одна на лист
 */
define(
    [
        'sheet/Component'
    ],
    function(
        Component
    ){

    var HeaderPanel = new Class({

        Extends : Component,

        Binds : ['resize'],

        options : {
            elementTemplate : function(){
                div({class:'header_table'},
                    table(
                        tr()
                    )
                )
            }
        },

        headers : [],

        initialize       : function(options){

            var me = this;
            this.parent(options)
        },

        resize : function(){

            var me = this;
            if(this.sheet.resizeMode() == "screen"){

                this.view.setStyle("width", "100%");

                var total_flex = 0;
                this.sheet.columns.each(function(col){
                    total_flex += col.flex();
                });

                this.sheet.columns.each(function(col){

                    col.view.setStyle("width",
                        Math.round(
                            (col.flex()/total_flex)*me.view.getSize().x
                        )
                    )
                })

            } else {

                var total_width = 0;
                this.sheet.columns.each(function(col){

                    total_width += col.width();
                    col.view.setStyle("width", col.width())
                });

                this.view.setStyle("width", total_width);
            }
        },

        loadSheet : function(sheet){

            this.sheet = sheet;
            var view = this.view.getElement('tr');

            this.sheet.columns.each(function(column){
                column.inject(view);
            });

            this.render()

            this.sheet.addEvent('resizeSheet', this.resize)
        },

        inject : function(element){

            this.parent(element);
        },

        render : function(){

            this.sheet.columns.each(function(header){
                header.render();
            })
            this.fireEvent('rendered')
        }
    });

    return HeaderPanel;

});