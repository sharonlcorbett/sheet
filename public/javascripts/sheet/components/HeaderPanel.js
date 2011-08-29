/**
 * Строка заголовков, одна на лист
 */
define([
    'sheet/Component'], function(Component){

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

        initialize       : function(sheet, options){

            var me = this;
            this.parent(options)
            this.sheet = sheet;
        },

        inject : function(element){

            this.parent(element);

            var me = this,
                view = this.view.getElement('tr');

            this.sheet.columns.each(function(column){
                column.inject(view);
            });
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