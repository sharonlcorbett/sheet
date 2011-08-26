/**
 * Строка заголовков, одна на лист
 */
define([
    'sheet/Component',
    'sheet/ColumnHeader'], function(
        Component,
        ColumnHeader){

    var HeaderPanel = new Class({

        Extends : Component,

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

        applyDefinition : function(sheet_def){

            var me = this;
            this.parent(sheet_def);

           sheet_def.columns().each(function(column){
                //создаем заголовки на основании Definition
                var col = new ColumnHeader()
                col.applyDefinition(column);
                me.headers.push(col);
            });
        },

        inject : function(element){

            this.parent(element);

            var me = this,
                view = this.view.getElement('tr');

            this.headers.each(function(header){
                header.inject(view);
            });
        },

        render : function(){

            this.headers.each(function(header){
                header.render();
            })
            this.fireEvent('rendered')
        }
    });

    return HeaderPanel;

});